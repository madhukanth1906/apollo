import 'package:flutter/material.dart';
import '../models/inspection.dart';
import '../services/pdf_service.dart';

class PdfFormScreen extends StatefulWidget {
  final Inspection inspection;

  const PdfFormScreen({Key? key, required this.inspection}) : super(key: key);

  @override
  State<PdfFormScreen> createState() => _PdfFormScreenState();
}

class _PdfFormScreenState extends State<PdfFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _estNoController = TextEditingController();
  final _licenceNoController = TextEditingController();
  final _estNameAddressController = TextEditingController();
  final _businessNatureController = TextEditingController();
  final _employerNameController = TextEditingController();
  final _repNameController = TextEditingController();
  final _maleCountController = TextEditingController(text: '0');
  final _femaleCountController = TextEditingController(text: '0');

  // Checklist answers
  final List<bool> _checklistAnswers = List.filled(8, true);

  bool _isGenerating = false;

  @override
  void dispose() {
    _estNoController.dispose();
    _licenceNoController.dispose();
    _estNameAddressController.dispose();
    _businessNatureController.dispose();
    _employerNameController.dispose();
    _repNameController.dispose();
    _maleCountController.dispose();
    _femaleCountController.dispose();
    super.dispose();
  }

  Future<void> _generatePdf() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isGenerating = true);

    final formData = {
      'estNo': _estNoController.text,
      'licenceNo': _licenceNoController.text,
      'estNameAddress': _estNameAddressController.text,
      'businessNature': _businessNatureController.text,
      'employerName': _employerNameController.text,
      'repName': _repNameController.text,
      'maleCount': _maleCountController.text,
      'femaleCount': _femaleCountController.text,
      'checklist': _checklistAnswers.map((b) => b ? 'Yes' : 'No').toList(),
    };

    try {
      await PdfService.generateAndPrintReport(widget.inspection, formData);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Report generated successfully!')),
        );
        Navigator.pop(context); // Go back to inspection detail
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating report: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isGenerating = false);
      }
    }
  }

  Widget _buildTextField(String label, TextEditingController controller, {bool isNumber = false, int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        maxLines: maxLines,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
          filled: true,
          fillColor: const Color(0xFF1C2541),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF38BDF8)),
          ),
        ),
        validator: (value) {
          if (value == null || value.trim().isEmpty) {
            return 'Please enter $label';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildChecklistSwitch(int index, String title) {
    return SwitchListTile(
      title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 13)),
      value: _checklistAnswers[index],
      activeColor: const Color(0xFF38BDF8),
      contentPadding: EdgeInsets.zero,
      onChanged: (val) {
        setState(() {
          _checklistAnswers[index] = val;
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Establishment Details'),
      ),
      body: _isGenerating 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Please fill out the establishment details before generating the PDF report. These details will be printed on Part 1 of the official checklist.',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                  ),
                  const SizedBox(height: 24),
                  
                  _buildTextField('1. Establishment No.', _estNoController),
                  _buildTextField('2. Licence or Registration No.', _licenceNoController),
                  _buildTextField('3. Name and Address of the Establishment', _estNameAddressController, maxLines: 3),
                  _buildTextField('4. Nature of Business', _businessNatureController),
                  _buildTextField('5. Name of Employer/Proprietor', _employerNameController),
                  _buildTextField('6. Name & Signature of representative present', _repNameController),
                  
                  const Text(
                    'Employee Details',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildTextField('Total Male', _maleCountController, isNumber: true)),
                      const SizedBox(width: 16),
                      Expanded(child: _buildTextField('Total Female', _femaleCountController, isNumber: true)),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  const Text(
                    'Part 2: Statutory Checklist',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _buildChecklistSwitch(0, '1. Weights & Measures verified and stamped? (Sec 24(1))'),
                  _buildChecklistSwitch(1, '2. Certificate of Verification exhibited? (Rule 22)'),
                  _buildChecklistSwitch(2, '3. Registration Certificate obtained? (Rule 27)'),
                  _buildChecklistSwitch(3, '4. Mandatory declarations made? (Sec 18(1))'),
                  _buildChecklistSwitch(4, '5. Not sold above M.R.P? (Rule 18(2))'),
                  _buildChecklistSwitch(5, '6. Electronic Weighing Machine with Printer? (Rule 18(7))'),
                  _buildChecklistSwitch(6, '7. Manufacturer/dealer is License Holder? (Sec 23)'),
                  _buildChecklistSwitch(7, '8. Test weight available? (Rule 21(4))'),

                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _generatePdf,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF38BDF8),
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'GENERATE OFFICIAL PDF',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
    );
  }
}
