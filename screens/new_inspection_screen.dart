import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import 'inspection_detail_screen.dart';

class NewInspectionScreen extends StatefulWidget {
  const NewInspectionScreen({Key? key}) : super(key: key);

  @override
  State<NewInspectionScreen> createState() => _NewInspectionScreenState();
}

class _NewInspectionScreenState extends State<NewInspectionScreen> {
  File? _frontImage;
  File? _backImage;
  File? _side1Image;
  File? _side2Image;
  
  final ImagePicker _picker = ImagePicker();
  bool _isAnalyzing = false;

  Future<void> _pickImage(String slot, ImageSource source) async {
    try {
      final XFile? picked = await _picker.pickImage(source: source);
      if (picked != null) {
        setState(() {
          if (slot == 'front') _frontImage = File(picked.path);
          else if (slot == 'back') _backImage = File(picked.path);
          else if (slot == 'side1') _side1Image = File(picked.path);
          else if (slot == 'side2') _side2Image = File(picked.path);
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to pick image: $e')),
      );
    }
  }

  void _showPickerOptions(BuildContext context, String slot) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt_rounded),
                title: const Text('Camera'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(slot, ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library_rounded),
                title: const Text('Gallery'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(slot, ImageSource.gallery);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  bool get _canSubmit => _frontImage != null && _backImage != null;

  Future<void> _analyze() async {
    if (!_canSubmit) return;

    setState(() {
      _isAnalyzing = true;
    });

    List<File> images = [];
    if (_frontImage != null) images.add(_frontImage!);
    if (_backImage != null) images.add(_backImage!);
    if (_side1Image != null) images.add(_side1Image!);
    if (_side2Image != null) images.add(_side2Image!);

    final provider = Provider.of<AppProvider>(context, listen: false);
    final result = await provider.analyzeInspection(images);

    setState(() {
      _isAnalyzing = false;
    });

    if (result != null && result['inspection_id'] != null) {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => InspectionDetailScreen(
            inspectionId: result['inspection_id'],
          ),
        ),
      );
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            provider.errorMessage ?? 'Inspection failed. Check backend connection.',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildImageSlot(String slot, String label, File? imageFile, bool mandatory) {
    return GestureDetector(
      onTap: () => _showPickerOptions(context, slot),
      child: Container(
        height: 140,
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          border: Border.all(color: mandatory && imageFile == null ? Colors.red.withOpacity(0.5) : const Color(0xFF334155)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Stack(
          children: [
            if (imageFile != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: kIsWeb 
                  ? Image.network(
                      imageFile.path,
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.contain,
                    )
                  : Image.file(
                      imageFile,
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.contain,
                    ),
              )
            else
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_a_photo_rounded, color: Colors.grey[400], size: 32),
                    const SizedBox(height: 8),
                    Text(
                      label,
                      style: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.bold),
                    ),
                    if (mandatory)
                      const Text(
                        '(Required)',
                        style: TextStyle(color: Colors.redAccent, fontSize: 11),
                      ),
                  ],
                ),
              ),
            if (imageFile != null)
              Positioned(
                top: 4,
                right: 4,
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      if (slot == 'front') _frontImage = null;
                      else if (slot == 'back') _backImage = null;
                      else if (slot == 'side1') _side1Image = null;
                      else if (slot == 'side2') _side2Image = null;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.close_rounded,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Commodity Inspection'),
      ),
      body: _isAnalyzing
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: Color(0xFFF59E0B)),
                    const SizedBox(height: 24),
                    const Text(
                      'AI Analyzing Label Evidence...',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Executing Legal Metrology Rules 2011 checks\n(MRP, Net Qty, Mfg Date, Manufacturer details)',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                    ),
                  ],
                ),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1C2541),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      children: const [
                        Icon(Icons.center_focus_strong_rounded,
                            color: Color(0xFFF59E0B), size: 32),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Capture package label photos for Legal Metrology AI inspection. Front and Back are mandatory.',
                            style: TextStyle(color: Colors.white, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  Row(
                    children: [
                      Expanded(child: _buildImageSlot('front', 'Front Image', _frontImage, true)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildImageSlot('back', 'Back Image', _backImage, true)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildImageSlot('side1', 'Side View 1', _side1Image, false)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildImageSlot('side2', 'Side View 2', _side2Image, false)),
                    ],
                  ),

                  const SizedBox(height: 32),

                  ElevatedButton.icon(
                    onPressed: _canSubmit ? _analyze : null,
                    icon: const Icon(Icons.psychology_rounded),
                    label: const Text(
                      'START AI INSPECTION',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B),
                      foregroundColor: Colors.black,
                      disabledBackgroundColor: Colors.grey.withOpacity(0.2),
                      minimumSize: const Size(double.infinity, 54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}



