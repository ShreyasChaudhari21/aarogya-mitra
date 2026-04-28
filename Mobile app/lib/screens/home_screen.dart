import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:animations/animations.dart';
import 'sos_screen.dart';
import '../services/translation_service.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListenableBuilder(
        listenable: translator,
        builder: (context, _) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 60), // Space for status bar area
              _buildHeader(),
              const SizedBox(height: 30),
              _buildHealthCard(),
              const SizedBox(height: 25),
              _buildWearableMetrics(),
              const SizedBox(height: 25),
              _buildSOSButton(context),
              const SizedBox(height: 35),
              _buildSectionHeader(TranslationService.translate('chat_ai'), ""),
              const SizedBox(height: 15),
              _buildActionGrid(context),
              const SizedBox(height: 35),
              _buildSectionHeader(TranslationService.translate('home_prescriptions'), TranslationService.translate('home_view_all')),
              const SizedBox(height: 15),
              _buildPrescriptionList(),
              const SizedBox(height: 30),
              _buildSectionHeader(TranslationService.translate('home_records'), TranslationService.translate('home_manage')),
              const SizedBox(height: 15),
              _buildRecordCard(),
              const SizedBox(height: 120), // Space for bottom nav and FAB
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "${TranslationService.translate('home_title').split(',')[0]}, Aditya",
              style: GoogleFonts.outfit(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1E293B),
              ),
            ),
            Text(
              TranslationService.translate('home_subtitle'),
              style: GoogleFonts.outfit(
                fontSize: 14,
                color: const Color(0xFF64748B),
              ),
            ),
          ],
        ),
        Stack(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(Icons.notifications_none_rounded, color: Color(0xFF3B82F6)),
            ),
            Positioned(
              right: 8,
              top: 8,
              child: Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
              ),
            )
          ],
        )
      ],
    );
  }

  Widget _buildHealthCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF3B82F6).withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                TranslationService.translate('home_health_score'),
                style: GoogleFonts.outfit(color: Colors.white70, fontSize: 16),
              ),
              const Icon(Icons.info_outline, color: Colors.white70, size: 20),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                "85",
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.arrow_upward, color: Colors.white, size: 14),
                    Text(" 2%", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildHealthStat(TranslationService.translate('home_blood'), "O+"),
              _buildHealthStat(TranslationService.translate('home_weight'), "72kg"),
              _buildHealthStat(TranslationService.translate('home_height'), "180cm"),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildSOSButton(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SOSScreen()),
        );
      },
      borderRadius: BorderRadius.circular(25),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
          borderRadius: BorderRadius.circular(25),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFEF4444).withOpacity(0.4),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(FontAwesomeIcons.triangleExclamation, color: Colors.white, size: 24),
            const SizedBox(width: 12),
            Text(
              TranslationService.translate('home_sos'),
              style: GoogleFonts.outfit(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.w800,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.outfit(color: Colors.white60, fontSize: 12)),
        Text(value, style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildWearableMetrics() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(TranslationService.translate('wearable_sync') ?? "Wearable Sync", "Live View"),
        const SizedBox(height: 15),
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                "Heart Rate",
                "82",
                "bpm",
                FontAwesomeIcons.heartPulse,
                Colors.red,
                "+2 from avg",
                true,
              ),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: _buildMetricCard(
                "SpO2 Level",
                "98",
                "%",
                FontAwesomeIcons.lungs,
                Colors.blue,
                "Normal",
                false,
              ),
            ),
          ],
        ),
        const SizedBox(height: 15),
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                "Active Steps",
                "6,432",
                "steps",
                FontAwesomeIcons.personWalking,
                Colors.green,
                "Goal: 10k",
                false,
              ),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: _buildMetricCard(
                "Sleep Time",
                "7h 20m",
                "",
                FontAwesomeIcons.moon,
                Colors.indigo,
                "Good quality",
                false,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMetricCard(String title, String value, String unit, IconData icon, Color color, String subtitle, bool isAnimating) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 16),
              ),
              if (isAnimating) 
                Icon(Icons.monitor_heart, color: color.withOpacity(0.5), size: 18)
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: GoogleFonts.outfit(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(value, style: GoogleFonts.outfit(color: const Color(0xFF1E293B), fontSize: 24, fontWeight: FontWeight.bold)),
              if (unit.isNotEmpty)
                Text(" $unit", style: GoogleFonts.outfit(color: Colors.grey, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          Text(subtitle, style: GoogleFonts.outfit(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildActionGrid(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 15,
      mainAxisSpacing: 15,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildActionItem(
          context,
          TranslationService.translate('nav_booking'),
          TranslationService.translate('home_appointments_sub'),
          FontAwesomeIcons.calendarCheck,
          const Color(0xFFEFF6FF),
          const Color(0xFF3B82F6),
        ),
        _buildActionItem(
          context,
          TranslationService.translate('home_sos'),
          TranslationService.translate('home_sos_sub'),
          FontAwesomeIcons.truckMedical,
          const Color(0xFFFEF2F2),
          const Color(0xFFEF4444),
        ),
        _buildActionItem(
          context,
          TranslationService.translate('home_pharmacy'),
          TranslationService.translate('home_pharmacy_sub'),
          FontAwesomeIcons.capsules,
          const Color(0xFFF0FDF4),
          const Color(0xFF22C55E),
        ),
        _buildActionItem(
          context,
          TranslationService.translate('home_beds'),
          TranslationService.translate('home_beds_sub'),
          FontAwesomeIcons.fileLines,
          const Color(0xFFF3E8FF),
          const Color(0xFFA855F7),
        ),
      ],
    );
  }

  Widget _buildActionItem(BuildContext context, String title, String subtitle, IconData icon, Color bg, Color iconColor) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: bg,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: iconColor, size: 24),
                ),
                const SizedBox(height: 15),
                Text(
                  title,
                  style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, String action) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        Text(
          action,
          style: GoogleFonts.outfit(color: const Color(0xFF3B82F6), fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _buildPrescriptionList() {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(FontAwesomeIcons.receipt, color: Colors.orange, size: 20),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Amoxicillin 500mg", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
                Text("Twice a day - After meals", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildRecordCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(FontAwesomeIcons.fileMedical, color: Color(0xFF3B82F6), size: 20),
              const SizedBox(width: 10),
              Text(TranslationService.translate('home_last_lab'), style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
              const Spacer(),
              Text("2 days ago", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const Divider(height: 30),
          Row(
            children: [
              _buildBadge("Blood Test", Colors.blue),
              const SizedBox(width: 10),
              _buildBadge("Normal", Colors.green),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
