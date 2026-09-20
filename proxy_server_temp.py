import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import base64

app = Flask(__name__)
CORS(app)

VERCEL_ANALYZE_URL = "https://apollo-seven-sage.vercel.app/api/analyze"

@app.route('/api/system/status', methods=['GET'])
def system_status():
    return jsonify({"status": "online", "message": "Local proxy is running"}), 200

@app.route('/api/inspections', methods=['GET'])
def get_inspections():
    return jsonify([]), 200

@app.route('/api/rules', methods=['GET'])
def get_rules():
    return jsonify([]), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify([]), 200

# Catch-all for any other GET requests the mobile app might make during sync
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    return jsonify([]), 200

import uuid
import datetime

mock_inspections = {}

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # Proxy to Vercel
    files = request.files.getlist('images')
    if not files:
        return jsonify({"error": "No images provided"}), 400
    
    files_to_send = []
    for f in files:
        # Force mimetype to image/jpeg because Flutter Web blob uploads might default to application/octet-stream
        # which causes the Gemini API to reject the request with a 400 Bad Request (leading to a 503)
        files_to_send.append(('images', (f.filename, f.read(), 'image/jpeg')))
    
    try:
        response = requests.post(VERCEL_ANALYZE_URL, files=files_to_send)
        if response.status_code == 200:
            result = response.json()
            if result.get("status") == "success":
                data_str = result.get("data", "{}")
                # Parse markdown json codeblock if present
                if data_str.startswith("```json"):
                    data_str = data_str.strip("`").replace("json\n", "")
                try:
                    data = json.loads(data_str)
                except:
                    data = {}
                
                insp_id = str(uuid.uuid4())
                mock_inspections[insp_id] = {
                    "id": insp_id,
                    "created_at": datetime.datetime.now().isoformat(),
                    "product_name": data.get("productName"),
                    "category": data.get("category"),
                    "batch_number": data.get("batchNumber"),
                    "mrp": data.get("mrp"),
                    "net_quantity": data.get("netQuantity"),
                    "manufacturer": data.get("manufacturerAddress"),
                    "status": "COMPLIANT" if data.get("complianceScore", 0) >= 80 else "NON_COMPLIANT",
                    "compliance_score": data.get("complianceScore", 0),
                    "extracted_data": {
                        "product": {"productName": data.get("productName"), "brand": data.get("brand"), "category": data.get("category")},
                        "pricing": {"mrp": data.get("mrp"), "dualMrpDetected": data.get("dualMrpDetected")},
                        "quantity": {"netQuantity": data.get("netQuantity")},
                        "dates": {"dateOfManufacture": data.get("dateOfManufacture")},
                        "batch": {"batchNumber": data.get("batchNumber")},
                        "manufacturer": {"manufacturerAddress": data.get("manufacturerAddress"), "customerCare": data.get("customerCare")}
                    }
                }
                return jsonify({"inspection_id": insp_id}), 200
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/inspections/<id>', methods=['GET'])
def get_inspection_detail(id):
    if id in mock_inspections:
        return jsonify(mock_inspections[id]), 200
    return jsonify({"error": "Not found"}), 404

@app.route('/api/metrology', methods=['POST'])
def metrology():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    image = request.files['image']
    marker_size = request.form.get('markerSize', '40.0')
    marker_id = request.form.get('markerId', '0')
    
    input_dir = os.path.join('aruco_measurement', 'input')
    os.makedirs(input_dir, exist_ok=True)
    img_path = os.path.join(input_dir, 'web_upload.jpg')
    image.save(img_path)
    
    try:
        # Run local aruco_measurement/main.py
        result = subprocess.run(
            ['python', 'aruco_measurement/main.py', '--image', img_path, '--marker-size', marker_size, '--marker-id', marker_id],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            return jsonify({"error": "Metrology script failed", "details": result.stderr}), 500
            
        # Parse JSON output from the script (it prints JSON at the end)
        lines = result.stdout.strip().split('\n')
        # Find the last valid JSON block
        data = None
        for line in reversed(lines):
            try:
                data = json.loads(line)
                if isinstance(data, dict):
                    break
            except json.JSONDecodeError:
                continue
                
        if not data:
            return jsonify({"error": "Could not parse JSON output from metrology script", "raw": result.stdout}), 500
            
        # Also return the annotated image if generated
        output_img_path = os.path.join('aruco_measurement', 'output', 'measurement_result.jpg')
        annotated_image_b64 = None
        if os.path.exists(output_img_path):
            with open(output_img_path, "rb") as image_file:
                annotated_image_b64 = "data:image/jpeg;base64," + base64.b64encode(image_file.read()).decode('utf-8')

        return jsonify({
            "success": True, 
            "report": data,
            "annotatedImage": annotated_image_b64
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

