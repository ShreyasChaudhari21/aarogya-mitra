import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'screens/booking_screen.dart';
import 'screens/sos_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/reports_screen.dart';
import 'services/translation_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: "assets/.env");
  debugPrint("Env Loaded: ${dotenv.env.keys.length} variables");
  debugPrint("Project ID: ${dotenv.env['DIALOGFLOW_PROJECT_ID']}");
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    debugPrint("Firebase initialization failed: $e");
  }
  runApp(const AarogyaMitraApp());
}

class AarogyaMitraApp extends StatelessWidget {
  const AarogyaMitraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Aarogya Mitra',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
          secondary: const Color(0xFF2563EB),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.outfitTextTheme(),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomeScreen(),
    const BookingScreen(),
    const ReportsScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: _pages[_selectedIndex],
      floatingActionButton: _buildAIChatFAB(),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ListenableBuilder(
          listenable: translator,
          builder: (context, _) {
            return NavigationBar(
              backgroundColor: Colors.white,
              elevation: 0,
              indicatorColor: const Color(0xFF3B82F6).withOpacity(0.1),
              selectedIndex: _selectedIndex,
              onDestinationSelected: (index) {
                setState(() {
                  _selectedIndex = index;
                });
              },
              destinations: [
                NavigationDestination(
                  icon: const Icon(Icons.home_outlined),
                  selectedIcon: const Icon(Icons.home_rounded, color: Color(0xFF3B82F6)),
                  label: TranslationService.translate('nav_home'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.calendar_month_outlined),
                  selectedIcon: const Icon(Icons.calendar_month_rounded, color: Color(0xFF3B82F6)),
                  label: TranslationService.translate('nav_booking'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.receipt_long_outlined),
                  selectedIcon: const Icon(Icons.receipt_long_rounded, color: Color(0xFF3B82F6)),
                  label: TranslationService.translate('nav_reports'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.person_outline),
                  selectedIcon: const Icon(Icons.person_rounded, color: Color(0xFF3B82F6)),
                  label: TranslationService.translate('nav_profile'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildAIChatFAB() {
    return FloatingActionButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ChatScreen()),
        );
      },
      backgroundColor: const Color(0xFF3B82F6),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: const Icon(FontAwesomeIcons.robot, color: Colors.white, size: 24),
    );
  }
}
