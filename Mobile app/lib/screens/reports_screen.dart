import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../services/translation_service.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: ListenableBuilder(
          listenable: translator,
          builder: (context, _) => Text(TranslationService.translate('reports_title'), style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: ListenableBuilder(
        listenable: translator,
        builder: (context, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(TranslationService.translate('reports_recent'), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                _buildReportCard("Blood Test Profile", "12 Oct 2026", "Apollo Diagnostics", Colors.red),
                const SizedBox(height: 15),
                _buildReportCard("MRI Scan - Lower Back", "05 Sep 2026", "Aarogya Mitra Imaging", Colors.blue),
                const SizedBox(height: 15),
                _buildReportCard("Annual Health Checkup", "10 Jan 2026", "Dr. Rahul Mishra", Colors.green),
                const SizedBox(height: 30),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.blue[100]!),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.shield_outlined, color: Colors.blue),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Text(
                          TranslationService.translate('reports_info'),
                          style: GoogleFonts.outfit(fontSize: 13, color: Colors.blue[800]),
                        ),
                      )
                    ],
                  ),
                )
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildReportCard(String title, String date, String lab, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Icon(FontAwesomeIcons.fileMedical, color: color, size: 24),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 3),
                Text(lab, style: GoogleFonts.outfit(color: Colors.grey[700], fontSize: 12)),
                const SizedBox(height: 3),
                Text(date, style: GoogleFonts.outfit(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.download_rounded, color: Color(0xFF3B82F6)),
            onPressed: () {},
          )
        ],
      ),
    );
  }
}
