import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/inspection.dart';
import '../services/api_service.dart';

class AppProvider with ChangeNotifier {
  List<Inspection> _inspections = [];
  List<RuleItem> _rules = [];
  List<ProductItem> _products = [];
  bool _isLoading = false;
  bool _isOnline = false;
  bool _aiModelReady = false;
  String _serverUrl = 'http://10.50.241.37:8000';
  String? _errorMessage;
  String _inspectorName = 'Guest Inspector';

  List<Inspection> get inspections => _inspections;
  List<RuleItem> get rules => _rules;
  List<ProductItem> get products => _products;
  bool get isLoading => _isLoading;
  bool get isOnline => _isOnline;
  bool get aiModelReady => _aiModelReady;
  String get serverUrl => _serverUrl;
  String? get errorMessage => _errorMessage;
  String get inspectorName => _inspectorName;

  int get totalInspections => _inspections.length;
  int get compliantCount =>
      _inspections.where((i) => i.status == 'COMPLIANT').length;
  int get nonCompliantCount =>
      _inspections.where((i) => i.status == 'NON_COMPLIANT').length;
  int get reviewCount =>
      _inspections.where((i) => i.status == 'NEEDS_REVIEW').length;

  Future<void> init() async {
    _serverUrl = await ApiService.getBaseUrl();
    await refreshAll();
  }

  Future<void> refreshAll() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      _inspectorName = prefs.getString('inspectorName') ?? 'Guest Inspector';

      final status = await ApiService.checkSystemStatus();
      _isOnline = status['status'] != 'OFFLINE';
      _aiModelReady = status['aiModelReady'] ?? false;

      if (_isOnline) {
        try {
          _inspections = await ApiService.getInspections();
        } catch (e) {
          print("Error fetching inspections: $e");
        }

        try {
          _rules = await ApiService.getRules();
        } catch (e) {
          print("Error fetching rules: $e");
        }

        try {
          _products = await ApiService.getProducts();
        } catch (e) {
          print("Error fetching products: $e");
        }
      }
    } catch (e) {
      _errorMessage = e.toString();
      _isOnline = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateServerUrl(String newUrl) async {
    await ApiService.setBaseUrl(newUrl);
    _serverUrl = await ApiService.getBaseUrl();
    await refreshAll();
  }

  Future<Map<String, dynamic>?> analyzeInspection(List<File> images) async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await ApiService.uploadAndAnalyzeImages(images);
      await refreshAll();
      return result;
    } catch (e) {
      _errorMessage = e.toString();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
