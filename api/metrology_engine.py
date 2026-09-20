import os
import sys
from pathlib import Path
import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify

# Add the project root and aruco_measurement to sys.path so we can import modules
project_root = Path(__file__).resolve().parent.parent
aruco_dir = project_root / 'aruco_measurement'

if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(aruco_dir) not in sys.path:
    sys.path.insert(0, str(aruco_dir))

from aruco_measurement.measurement import MeasurementEngine

app = Flask(__name__)

def encode_image_base64(img_np):
    """Encode OpenCV numpy image to Base64 data URI."""
    if img_np is None:
        return None
    success, buffer = cv2.imencode('.jpg', img_np, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    if not success:
        return None
    b64_string = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_string}"

@app.route('/api/metrology_engine', methods=['POST'])
def run_metrology():
    try:
        marker_size = float(request.form.get('markerSize', 40.0))
        marker_id = int(request.form.get('markerId', 0))
        
        if 'image' not in request.files or request.files['image'].filename == '':
            # Demo fallback mode if no image is uploaded
            sample_path = project_root / 'aruco_measurement' / 'input' / 'sample_product.jpg'
            if not sample_path.exists():
                return jsonify({'error': 'No image provided and sample not found'}), 400
            image = cv2.imread(str(sample_path))
        else:
            file = request.files['image']
            file_bytes = np.frombuffer(file.read(), np.uint8)
            image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Failed to decode image data'}), 400

        # Run measurement
        engine = MeasurementEngine(
            marker_size_mm=marker_size,
            target_marker_id=marker_id
        )
        
        res = engine.process_frame(image)
        
        # Rectified view
        rectified_view = None
        if res["aruco"].get("homography_px_to_mm") is not None:
            rectified_view = engine.get_rectified_view(
                res["raw_corrected_frame"], res["aruco"]["homography_px_to_mm"]
            )
            
        return jsonify({
            'success': True,
            'report': res['report'],
            'annotatedImage': encode_image_base64(res['annotated_frame']),
            'rectifiedImage': encode_image_base64(rectified_view),
            'isMockFallback': False
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Vercel entrypoint is the 'app' variable.
