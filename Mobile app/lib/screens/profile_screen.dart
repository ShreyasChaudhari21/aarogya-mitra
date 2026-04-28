import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/translation_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: ListenableBuilder(
        listenable: translator,
        builder: (context, _) {
          return CustomScrollView(
            slivers: [
              SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF3B82F6), Color(0xFF1E40AF)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white,
                      child: Icon(Icons.person, size: 50, color: Color(0xFF3B82F6)),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Aditya Karodiwal",
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "${TranslationService.translate('profile_patient_id')}: AM-2024-9901",
                      style: GoogleFonts.outfit(color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle(TranslationService.translate('profile_health_profile')),
                  const SizedBox(height: 15),
                  _buildHealthGrid(),
                  const SizedBox(height: 30),
                  _buildSectionTitle(TranslationService.translate('profile_medical_history')),
                  const SizedBox(height: 15),
                  _buildHistoryTile("Type 2 Diabetes", "${TranslationService.translate('profile_diagnosed')}: 2022", Colors.orange),
                  _buildHistoryTile("Hypertension", "${TranslationService.translate('profile_diagnosed')}: 2021", Colors.red),
                  const SizedBox(height: 30),
                  _buildSectionTitle(TranslationService.translate('profile_allergies')),
                  const SizedBox(height: 15),
                  Wrap(
                    spacing: 10,
                    children: [
                      _buildAllergyBadge("Peanuts"),
                      _buildAllergyBadge("Penicillin"),
                      _buildAllergyBadge("Dust"),
                    ],
                  ),
                  const SizedBox(height: 30),
                  _buildSectionTitle(TranslationService.translate('profile_emergency_contacts')),
                  const SizedBox(height: 15),
                  _buildContactCard("Rajesh (Father)", "+91 91234 56780"),
                  _buildContactCard("Meena (Mother)", "+91 91234 56781"),
                  const SizedBox(height: 30),
                  _buildSectionTitle(TranslationService.translate('profile_lang')),
                  const SizedBox(height: 15),
                  _buildLanguageSelector(),
                  const SizedBox(height: 40),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.edit_outlined),
                      label: Text(TranslationService.translate('profile_settings')),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.logout, color: Colors.red),
                      label: const Text("Sign Out", style: TextStyle(color: Colors.red)),
                    ),
                  ),
                  const SizedBox(height: 50),
                ],
              ),
            ),
          )
        ],
      );
    },
  ),
);
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF1E293B)),
    );
  }

  Widget _buildHealthGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 15,
      mainAxisSpacing: 15,
      childAspectRatio: 2.5,
      children: [
        _buildInfoCard(TranslationService.translate('profile_blood_group'), "O+ Positive"),
        _buildInfoCard(TranslationService.translate('profile_age'), "24 ${TranslationService.translate('profile_years')}"),
        _buildInfoCard(TranslationService.translate('profile_weight'), "72 kg"),
        _buildInfoCard(TranslationService.translate('profile_height'), "180 cm"),
      ],
    );
  }

  Widget _buildInfoCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey)),
          Text(value, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildHistoryTile(String title, String date, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          Container(
            width: 5,
            height: 40,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          const SizedBox(width: 15),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
              Text(date, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildAllergyBadge(String tag) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.red.withOpacity(0.2)),
      ),
      child: Text(
        tag,
        style: GoogleFonts.outfit(color: Colors.red, fontWeight: FontWeight.w600, fontSize: 13),
      ),
    );
  }

  Widget _buildContactCard(String name, String phone) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Colors.blue.withOpacity(0.1),
            child: const Icon(Icons.person, color: Colors.blue, size: 20),
          ),
          const SizedBox(width: 15),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
              Text(phone, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const Spacer(),
          IconButton(onPressed: () {}, icon: const Icon(Icons.phone, color: Colors.green, size: 20)),
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    return ListenableBuilder(
      listenable: translator,
      builder: (context, _) {
        return Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            _buildLangChip("English", "en"),
            _buildLangChip("हिंदी", "hi"),
            _buildLangChip("मराठी", "mr"),
            _buildLangChip("தமிழ்", "ta"),
            _buildLangChip("ಕನ್ನಡ", "kn"),
            _buildLangChip("മലയാളം", "ml"),
          ],
        );
      },
    );
  }

  Widget _buildLangChip(String label, String code) {
    bool isSelected = translator.currentLocale == code;
    return GestureDetector(
      onTap: () => translator.setLocale(code),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF3B82F6) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF3B82F6) : const Color(0xFFE2E8F0),
          ),
          boxShadow: isSelected ? [
            BoxShadow(
              color: const Color(0xFF3B82F6).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ] : [],
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            color: isSelected ? Colors.white : const Color(0xFF64748B),
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}
