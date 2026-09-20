import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/inspection.dart';
import '../services/api_service.dart';
import '../widgets/compliance_badge.dart';

import '../services/pdf_service.dart';

class InspectionDetailScreen extends StatefulWidget {
  final String inspectionId;

  const InspectionDetailScreen({Key? key, required this.inspectionId})
      : super(key: key);

  @override
  State<InspectionDetailScreen> createState() => _InspectionDetailScreenState();
}

class _InspectionDetailScreenState extends State<InspectionDetailScreen> {
  late Future<Inspection> _detailFuture;
  Inspection? _currentInspection;

  @override
  void initState() {
    super.initState();
    _detailFuture = ApiService.getInspectionDetail(widget.inspectionId).then((value) {
      _currentInspection = value;
      return value;
    });
  }

  Widget _buildFieldRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFF94A3B8),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              (value == null || value.isEmpty) ? 'Not Declared / Missing' : value,
              style: TextStyle(
                color: (value == null || value.isEmpty)
                    ? Colors.redAccent
                    : Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Inspection ${widget.inspectionId.length > 8 ? widget.inspectionId.substring(0, 8) : widget.inspectionId}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            tooltip: 'Download PDF Report',
            onPressed: () {
              if (_currentInspection != null) {
                PdfService.generateAndPrintReport(_currentInspection!);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Inspection details not loaded yet.')),
                );
              }
            },
          ),
        ],
      ),
      body: FutureBuilder<Inspection>(
        future: _detailFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError || !snapshot.hasData) {
            return Center(
              child: Text(
                'Error loading inspection: ${snapshot.error}',
                style: const TextStyle(color: Colors.red),
              ),
            );
          }

          final item = snapshot.data!;
          final extData = item.extractedData ?? {};
          final prod = extData['product'] ?? {};
          final pricing = extData['pricing'] ?? {};
          final quantity = extData['quantity'] ?? {};
          final dates = extData['dates'] ?? {};
          final batch = extData['batch'] ?? {};
          final manufacturer = extData['manufacturer'] ?? {};

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Status Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C2541),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: Column(
                    children: [
                      ComplianceBadge(status: item.status),
                      const SizedBox(height: 12),
                      Text(
                        item.productName ?? 'Commodity Label Inspection',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Compliance Score: ${item.complianceScore.toStringAsFixed(0)}%',
                        style: const TextStyle(
                          color: Color(0xFF38BDF8),
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Extracted Declarations Card
                const Text(
                  'EXTRACTED DECLARATIONS (LEGAL METROLOGY)',
                  style: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 8),

                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C2541),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
                  child: Column(
                    children: [
                      _buildFieldRow('Product Name', prod['productName'] ?? item.productName),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Brand Name', prod['brand'] ?? item.brand),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Category', prod['category'] ?? item.category),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Maximum Retail Price', pricing['mrp'] ?? item.mrp),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Net Quantity', quantity['netQuantity'] != null ? "${quantity['netQuantity']} ${quantity['unit'] ?? ''}" : item.netQuantity),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Mfg / Pkg Date', dates['dateOfManufacture']),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Batch / Lot #', batch['batchNumber'] ?? item.batchNumber),
                      const Divider(color: Color(0xFF334155)),
                      _buildFieldRow('Manufacturer Address', manufacturer['manufacturerAddress'] ?? item.manufacturer),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Legal Violations / Checks List
                if (item.violations != null && item.violations!.isNotEmpty) ...[
                  const Text(
                    'RULE VIOLATIONS DETECTED',
                    style: TextStyle(
                      color: Colors.redAccent,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: item.violations!.length,
                    itemBuilder: (context, index) {
                      final v = item.violations![index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.red.withOpacity(0.4)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.error_outline_rounded,
                                color: Colors.redAccent, size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                v is Map ? (v['description'] ?? jsonEncode(v)) : v.toString(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}

