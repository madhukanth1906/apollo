import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:uuid/uuid.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/inspection.dart';

class ApiService {
  static const String _vercelAnalyzeUrl = 'https://apollo-seven-sage.vercel.app/api/analyze';
  
  // Local in-memory mock DB to replace the python proxy
  static final Map<String, dynamic> _mockInspections = {};
  
  static Future<String> getBaseUrl() async {
    return _vercelAnalyzeUrl;
  }

  static Future<void> setBaseUrl(String url) async {
    // No longer needed, URL is fixed to Vercel
  }

  static Future<Map<String, dynamic>> checkSystemStatus() async {
    // Just return online since we are hitting Vercel directly now
    return {'status': 'online', 'aiModelReady': true};
  }

  static const String _appwriteEndpoint = 'https://sgp.cloud.appwrite.io/v1';
  static const String _appwriteProjectId = '6a9d93e80009b82fad0f';
  static const String _appwriteDatabaseId = 'pakshya-db';
  static const String _inspectionsCollectionId = 'inspections';

  static Future<void> _saveLocalInspections() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('local_inspections', json.encode(_mockInspections));
  }

  static Future<void> _loadLocalInspections() async {
    if (_mockInspections.isNotEmpty) return;
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString('local_inspections');
    if (str != null) {
      try {
        final Map<String, dynamic> decoded = json.decode(str);
        _mockInspections.clear();
        _mockInspections.addAll(decoded);
      } catch (e) {}
    }
  }

  static Future<List<Inspection>> getInspections() async {
    await _loadLocalInspections();
    final List<Inspection> history = _mockInspections.values.map((json) => Inspection.fromJson(json)).toList();
    history.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return history;
  }

  static Future<Inspection> getInspectionDetail(String id) async {
    if (_mockInspections.containsKey(id)) {
      return Inspection.fromJson(_mockInspections[id]);
    } else {
      final inspections = await getInspections();
      final insp = inspections.firstWhere((i) => i.id == id, orElse: () => throw Exception('Not found'));
      return insp;
    }
  }

  static Future<Map<String, dynamic>> uploadAndAnalyzeImages(
    List<File> imageFiles,
  ) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse(_vercelAnalyzeUrl),
    );

    for (var file in imageFiles) {
      if (kIsWeb) {
        final res = await http.get(Uri.parse(file.path));
        request.files.add(
          http.MultipartFile.fromBytes(
            'images',
            res.bodyBytes,
            filename: file.path.split('/').last,
            contentType: MediaType('image', 'jpeg'),
          ),
        );
      } else {
        request.files.add(
          await http.MultipartFile.fromPath(
            'images',
            file.path,
            contentType: MediaType('image', 'jpeg'),
          ),
        );
      }
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      if (result['status'] == 'success') {
        Map<String, dynamic> data = {};
        
        final dataField = result['data'];
        if (dataField is Map<String, dynamic>) {
          data = dataField;
        } else if (dataField is String) {
          String dataStr = dataField;
          if (dataStr.startsWith("```json")) {
            dataStr = dataStr.replaceAll("```json\n", "").replaceAll("```", "");
          }
          try {
            data = json.decode(dataStr);
          } catch (e) {
            // fallback
          }
        }

        final inspId = const Uuid().v4();
        
        _mockInspections[inspId] = {
            "id": inspId,
            "created_at": DateTime.now().toIso8601String(),
            "product_name": data["productName"],
            "category": data["category"],
            "batch_number": data["batchNumber"],
            "mrp": data["mrp"],
            "net_quantity": data["netQuantity"],
            "manufacturer": data["manufacturerAddress"],
            "status": ((data["complianceScore"] ?? 0) >= 80) ? "COMPLIANT" : "NON_COMPLIANT",
            "compliance_score": data["complianceScore"] ?? 0,
            "extracted_data": {
                "product": {"productName": data["productName"], "brand": data["brand"], "category": data["category"]},
                "pricing": {"mrp": data["mrp"], "dualMrpDetected": data["dualMrpDetected"]},
                "quantity": {"netQuantity": data["netQuantity"]},
                "dates": {"dateOfManufacture": data["dateOfManufacture"]},
                "batch": {"batchNumber": data["batchNumber"]},
                "manufacturer": {"manufacturerAddress": data["manufacturerAddress"], "customerCare": data["customerCare"]}
            }
        };
        
        await _saveLocalInspections();

        return {"inspection_id": inspId};
      } else {
        throw Exception('Vercel API failed: ${result['error']}');
      }
    } else {
      throw Exception('Failed to analyze image: ${response.body}');
    }
  }

  static Future<List<RuleItem>> getRules() async {
    final mockRules = [
        {"id": "R1", "title": "Verification & Stamping", "description": "Whether Weights and Measures in the premises is verified and stamped?", "status": "Active", "category": "Weights & Measures", "severity": "HIGH", "reference": "Sec 24(1)", "field": ""},
        {"id": "R2", "title": "Verification Certificate", "description": "Whether the Certified of Verification is exhibited?", "status": "Active", "category": "General", "severity": "MEDIUM", "reference": "Rule 22 TN LM (E)", "field": ""},
        {"id": "R3", "title": "Registration Certificate", "description": "Whether Registration Certificate is obtained under the Legal Metrology (Packaged Commodities) Rules, 2011?", "status": "Active", "category": "General", "severity": "HIGH", "reference": "Rule 27 LMPC", "field": ""},
        {"id": "R4", "title": "Mandatory Declarations", "description": "Whether the Mandatory declaration of P.C. have been made in the packages kept for sale?", "status": "Active", "category": "Declarations", "severity": "HIGH", "reference": "Sec 18(1) read w/ Rule 6(1)", "field": "productName"},
        {"id": "R5", "title": "MRP Adherence", "description": "Whether Packaged Commodities are not sold at a price higher than the M.R.P.?", "status": "Active", "category": "Pricing", "severity": "HIGH", "reference": "Rule 18(2) LMPC", "field": "mrp"},
        {"id": "R6", "title": "Test Weights", "description": "Whether Test weight is available to ensure a proper check of accuracy of a weighing instrument?", "status": "Active", "category": "Equipment", "severity": "HIGH", "reference": "Rule 21 (4) LMPC", "field": ""}
    ];
    return mockRules.map((json) => RuleItem.fromJson(json)).toList();
  }

  static Future<List<ProductItem>> getProducts() async {
    return [];
  }

  static Future<void> createProduct(Map<String, dynamic> productData) async {
  }
}

