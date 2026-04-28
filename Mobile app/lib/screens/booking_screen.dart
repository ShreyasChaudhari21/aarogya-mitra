import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/firestore_service.dart';
import '../services/translation_service.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  DateTime _selectedDate = DateTime.now();
  String _selectedSlot = "10:00 AM";
  String _selectedCategory = "General";

  final List<String> _categories = ["General", "Cardiology", "Dentist", "Neurology", "Ortho"];
  final List<String> _slots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: ListenableBuilder(
          listenable: translator,
          builder: (context, _) => Text(TranslationService.translate('booking_title'), style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        ),
        centerTitle: true,
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
                Text(TranslationService.translate('booking_category'), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                SizedBox(
                  height: 45,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      bool isSelected = _selectedCategory == _categories[index];
                      return Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: ChoiceChip(
                          label: Text(_categories[index]),
                          selected: isSelected,
                          onSelected: (val) => setState(() => _selectedCategory = _categories[index]),
                          selectedColor: const Color(0xFF3B82F6),
                          labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 30),
                Text(TranslationService.translate('booking_top_doctors'), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                _buildDoctorCard("Dr. Rahul Mishra", "Cardiologist", "4.9 (120 reviews)", "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"),
                _buildDoctorCard("Dr. Sneha Roy", "General Physician", "4.8 (85 reviews)", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"),
                const SizedBox(height: 30),
                Text(TranslationService.translate('booking_select_date'), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                _buildDatePicker(),
                const SizedBox(height: 30),
                Text(TranslationService.translate('booking_available_slots'), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: _slots.map((slot) {
                    bool isSelected = _selectedSlot == slot;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedSlot = slot),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF3B82F6) : Colors.white,
                          borderRadius: BorderRadius.circular(15),
                          border: Border.all(color: isSelected ? const Color(0xFF3B82F6) : Colors.grey[300]!),
                        ),
                        child: Text(
                          slot,
                          style: TextStyle(
                            color: isSelected ? Colors.white : Colors.black,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 40),
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: () => _confirmBooking(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      elevation: 0,
                    ),
                    child: Text(
                      TranslationService.translate('booking_confirm'),
                      style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildDoctorCard(String name, String specialty, String rating, String img) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.blue[50],
            child: const Icon(Icons.person, color: Colors.blue),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(specialty, style: GoogleFonts.outfit(color: Colors.grey, fontSize: 13)),
                const SizedBox(height: 5),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.orange, size: 14),
                    const SizedBox(width: 4),
                    Text(rating, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w600)),
                  ],
                )
              ],
            ),
          ),
          Radio(value: name, groupValue: "Dr. Rahul Mishra", onChanged: (v) {}),
        ],
      ),
    );
  }

  Widget _buildDatePicker() {
    return Container(
      height: 100,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 14,
        itemBuilder: (context, index) {
          DateTime date = DateTime.now().add(Duration(days: index));
          bool isSelected = DateFormat('yyyy-MM-dd').format(date) == DateFormat('yyyy-MM-dd').format(_selectedDate);
          return GestureDetector(
            onTap: () => setState(() => _selectedDate = date),
            child: Container(
              width: 70,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF3B82F6).withOpacity(0.1) : Colors.transparent,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isSelected ? const Color(0xFF3B82F6) : Colors.grey[200]!),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(DateFormat('EEE').format(date), style: TextStyle(color: isSelected ? const Color(0xFF3B82F6) : Colors.grey)),
                  const SizedBox(height: 5),
                  Text(
                    DateFormat('dd').format(date),
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? const Color(0xFF3B82F6) : Colors.black,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _confirmBooking(BuildContext context) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    try {
      await FirestoreService().bookAppointment(
        patientName: "Aditya Karodiwal",
        doctorName: "Dr. Rahul Mishra",
        date: _selectedDate,
        slot: _selectedSlot,
        category: _selectedCategory,
      );

      if (mounted) {
        Navigator.pop(context); // Close loading
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Icon(Icons.check_circle, color: Colors.green, size: 60),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("Booking Confirmed!", style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text(
                  "Your appointment with Dr. Rahul Mishra on ${DateFormat('dd MMM').format(_selectedDate)} at $_selectedSlot is successfully scheduled.",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(color: Colors.grey),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text("Done", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
              )
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // Close loading
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to book: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }
}
