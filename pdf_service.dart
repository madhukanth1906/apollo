import 'dart:convert';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/inspection.dart';

class PdfService {
  static Future<void> generateAndPrintReport(Inspection inspection, [Map<String, dynamic>? formData]) async {
    final pdf = pw.Document();

    final qrData = jsonEncode({
      'id': inspection.id,
      'date': inspection.createdAt,
      'product': inspection.productName,
      'score': inspection.complianceScore,
      'status': inspection.status,
    });

    // Page 1: Official Establishment Details
    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              _buildHeader(inspection),
              pw.SizedBox(height: 20),
              pw.Text('Part 1: Establishment Details (To be filled by Inspector)', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 10),
              _buildFormRow('1. Establishment No.', formData?['estNo']),
              _buildFormRow('2. Licence or Registration No.', formData?['licenceNo']),
              _buildFormRow('3. Name and address of the Establishment', formData?['estNameAddress'], height: 40),
              _buildFormRow('4. Nature of Business', formData?['businessNature']),
              _buildFormRow('5. Name of Employer/Proprietor', formData?['employerName']),
              _buildFormRow('6. Name & Signature of representative present', formData?['repName']),
              pw.SizedBox(height: 20),
              pw.Text('Employee Details', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 8),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Expanded(child: _buildFormRow('Total Male: ', formData?['maleCount'])),
                  pw.SizedBox(width: 10),
                  pw.Expanded(child: _buildFormRow('Total Female: ', formData?['femaleCount'])),
                ],
              ),
              pw.Spacer(),
              _buildFooter(1),
            ],
          );
        },
      ),
    );

    // Page 2: Statutory Checklist
    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text('Part 2: Statutory Checklist', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 10),
              _buildChecklistTable(formData),
              pw.Spacer(),
              _buildFooter(2),
            ],
          );
        },
      ),
    );

    // Page 3: AI Extraction & QR Code
    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text('Part 3: Commodity Label AI Analysis', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 10),
              _buildProductInfo(inspection),
              pw.SizedBox(height: 20),
              _buildExtractedDeclarations(inspection),
              pw.Spacer(),
              pw.Center(
                child: pw.Column(
                  children: [
                    pw.Text('Encrypted Verification QR Code', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                    pw.SizedBox(height: 10),
                    pw.SizedBox(
                      width: 120,
                      height: 120,
                      child: pw.BarcodeWidget(
                        data: qrData,
                        barcode: pw.Barcode.qrCode(),
                        color: PdfColors.black,
                      ),
                    ),
                    pw.SizedBox(height: 10),
                    pw.Text('Scan to verify report authenticity in PAKSHYA system.', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
                  ],
                ),
              ),
              pw.SizedBox(height: 20),
              _buildFooter(3),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
      name: 'Inspection_Report_${inspection.id}.pdf',
    );
  }

  static pw.Widget _buildFormRow(String label, String? value, {double height = 20}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.only(bottom: 12),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text(label, style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey800)),
          pw.SizedBox(height: 4),
          if (value != null && value.trim().isNotEmpty)
            pw.Text(value, style: const pw.TextStyle(fontSize: 12))
          else
            pw.Container(
              height: height,
              decoration: const pw.BoxDecoration(
                border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey400)),
              ),
            ),
        ],
      ),
    );
  }

  static pw.Widget _buildHeader(Inspection inspection) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.center,
      children: [
        pw.Text(
          'INSPECTION REPORT',
          style: pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold),
        ),
        pw.SizedBox(height: 4),
        pw.Text(
          'Under The Legal Metrology Act, 2009 / The Tamil Nadu Legal Metrology (Enforcements) Rules, 2011',
          style: pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
          textAlign: pw.TextAlign.center,
        ),
        pw.SizedBox(height: 16),
        pw.Divider(),
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text('Inspection ID: ${inspection.id.length > 8 ? inspection.id.substring(0, 8) : inspection.id}'),
            pw.Text('Date: ${inspection.createdAt.split('T').first}'),
          ],
        ),
        pw.Divider(),
      ],
    );
  }

  static pw.Widget _buildChecklistTable([Map<String, dynamic>? formData]) {
    final items = [
      ['1', 'Sec 24(1)', 'Whether Weights and Measures in the premises is verified and stamped?'],
      ['2', 'Rule 22 of TN L.M. (E) Rules 2011', 'Whether the Certified of Verification is exhibited?'],
      ['3', 'Rule 27 of L.M. P.C. Rules 2011', 'Whether Registration Certificate is obtained?'],
      ['4', 'Sec 18(1) read with Rule 6(1)', 'Whether Mandatory declaration of P.C. have been made?'],
      ['5', 'Rule 18(2) of L.M. P.C. Rules 2011', 'Whether Packaged Commodities are not sold above M.R.P?'],
      ['6', 'Rule 18(7) of L.M. P.C. Rules 2011', 'Whether Retailer have Electronic Weighing Machine with Printer?'],
      ['7', 'Sec 23 / Rule 11 of TN L.M. (E)', 'Whether manufacturer/repairer/dealer is License Holder?'],
      ['8', 'Rule 21 (4) of L.M. P.C. Rules 2011', 'Whether Test weight is available to ensure proper check?'],
    ];

    final List<String> checklistAnswers = formData?['checklist'] ?? List.filled(8, '');

    return pw.TableHelper.fromTextArray(
      border: pw.TableBorder.all(color: PdfColors.grey400),
      headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10),
      headerDecoration: const pw.BoxDecoration(color: PdfColors.grey200),
      cellStyle: const pw.TextStyle(fontSize: 10),
      cellPadding: const pw.EdgeInsets.all(5),
      columnWidths: {
        0: const pw.FixedColumnWidth(25),
        1: const pw.FlexColumnWidth(2),
        2: const pw.FlexColumnWidth(3),
        3: const pw.FixedColumnWidth(60),
      },
      data: <List<String>>[
        ['S.No', 'Section / Rule', 'Details', 'Yes / No'],
        for (var i = 0; i < items.length; i++)
          [items[i][0], items[i][1], items[i][2], checklistAnswers[i]],
      ],
    );
  }

  static pw.Widget _buildProductInfo(Inspection inspection) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(10),
      decoration: pw.BoxDecoration(
        border: pw.Border.all(color: PdfColors.grey400),
      ),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text('Commodity Details', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
          pw.SizedBox(height: 8),
          _buildDetailRow('Product Name', inspection.productName),
          _buildDetailRow('Category', inspection.category ?? 'N/A'),
          _buildDetailRow('Batch/SKU', inspection.batchNumber ?? 'N/A'),
          _buildDetailRow('Compliance Score', '${inspection.complianceScore}%'),
          _buildDetailRow('Status', inspection.status),
        ],
      ),
    );
  }

  static pw.Widget _buildExtractedDeclarations(Inspection inspection) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text('AI Extracted Values', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
        pw.SizedBox(height: 8),
        pw.TableHelper.fromTextArray(
          border: pw.TableBorder.all(color: PdfColors.grey400),
          headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10),
          headerDecoration: const pw.BoxDecoration(color: PdfColors.grey200),
          cellAlignment: pw.Alignment.centerLeft,
          cellStyle: const pw.TextStyle(fontSize: 10),
          data: <List<String>>[
            ['Declaration', 'Extracted Value'],
            ['Maximum Retail Price (MRP)', inspection.mrp ?? 'Not Found'],
            ['Net Quantity', inspection.netQuantity ?? 'Not Found'],
            ['Date of Manufacture', _getExtractedValue(inspection, 'dates', 'dateOfManufacture')],
            ['Manufacturer Address', inspection.manufacturer ?? 'Not Found'],
            ['Customer Care Details', _getExtractedValue(inspection, 'manufacturer', 'customerCare')],
          ],
        ),
      ],
    );
  }

  static String _getExtractedValue(Inspection inspection, String section, String field) {
    if (inspection.extractedData == null) return 'Not Found';
    if (inspection.extractedData![section] == null) return 'Not Found';
    return inspection.extractedData![section][field]?.toString() ?? 'Not Found';
  }

  static pw.Widget _buildDetailRow(String label, String? value) {
    final displayValue = (value == null || value.isEmpty) ? 'N/A' : value;
    return pw.Padding(
      padding: const pw.EdgeInsets.only(bottom: 4),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.SizedBox(
            width: 120,
            child: pw.Text(label, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: PdfColors.grey700, fontSize: 10)),
          ),
          pw.Expanded(
            child: pw.Text(displayValue, style: const pw.TextStyle(fontSize: 10)),
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildFooter(int pageNumber) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.center,
      children: [
        pw.Divider(),
        pw.SizedBox(height: 5),
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text(
              'Apollo Legal Metrology System',
              style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
            ),
            pw.Text(
              'Page $pageNumber of 3',
              style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
            ),
          ],
        ),
      ],
    );
  }
}
