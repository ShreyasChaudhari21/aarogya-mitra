import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/firestore_service.dart';

class SOSScreen extends StatefulWidget {
  const SOSScreen({super.key});

  @override
  State<SOSScreen> createState() => _SOSScreenState();
}

class _SOSScreenState extends State<SOSScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isSending = false;
  bool _isTracking = false;
  StreamSubscription<Position>? _positionStream;
  StreamSubscription<QuerySnapshot>? _sosStream;
  String? _notificationId;
  String? _queueId;
  Position? _currentPos;
  String _locStatus = "Initializing GPS...";
  
  // New requirements
  int _countdownSeconds = 5;
  Timer? _timer;
  bool _isCountingDown = false;
  String? _assignedDoctor;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _listenToActiveSOS();
  }

  void _listenToActiveSOS() {
    // Trim and use a robust check
    const patientName = "Aditya Karodiwal";
    _sosStream = FirestoreService().getActiveSOS(patientName).listen((snapshot) {
      final activeDocs = snapshot.docs.where((doc) {
        final data = doc.data() as Map<String, dynamic>;
        final status = data['status'] as String?;
        return status != 'Completed' && status != 'Cancelled';
      }).toList();

      if (activeDocs.isNotEmpty) {
        final data = activeDocs.first.data() as Map<String, dynamic>;
        if (mounted) {
          setState(() {
            _isTracking = true;
            _queueId = activeDocs.first.id;
            _assignedDoctor = data['assignedDoctor'];
            _isCountingDown = false; // Force stop countdown if tracking started
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _isTracking = false;
            _queueId = null;
            _assignedDoctor = null;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _positionStream?.cancel();
    _sosStream?.cancel();
    _timer?.cancel();
    super.dispose();
  }

  void _startCountdown() {
    // HARD GUARD: Prevent multiple triggers
    if (_isTracking || _isCountingDown || _isSending) return;

    setState(() {
      _isCountingDown = true;
      _countdownSeconds = 5;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_countdownSeconds <= 1) {
        timer.cancel();
        _triggerSOS();
      } else {
        setState(() {
          _countdownSeconds--;
        });
      }
    });
  }

  void _cancelCountdown() {
    _timer?.cancel();
    setState(() {
      _isCountingDown = false;
      _countdownSeconds = 5;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("SOS Cancelled.")),
    );
  }

  void _triggerSOS() async {
    setState(() {
      _isCountingDown = false;
      _isSending = true;
    });
    
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
        timeLimit: const Duration(seconds: 15),
      );
      
      final ids = await FirestoreService().triggerEmergencySOS(
        patientName: "Aditya Karodiwal",
        address: "Live Tracking Active",
        lat: position.latitude,
        lng: position.longitude,
      );

      _notificationId = ids['notificationId'];
      _queueId = ids['queueId'];

      _positionStream = Geolocator.getPositionStream(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 5,
        ),
      ).listen((Position newPos) {
        if (_notificationId != null) {
          FirestoreService().updateEmergencyLocation(
            notificationId: _notificationId!,
            lat: newPos.latitude,
            lng: newPos.longitude,
          );
          if (mounted) {
            setState(() {
              _currentPos = newPos;
              _locStatus = "Live: ${newPos.latitude.toStringAsFixed(4)}, ${newPos.longitude.toStringAsFixed(4)}";
            });
          }
        }
      });

      if (mounted) {
        setState(() {
          _isSending = false;
          _isTracking = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSending = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    }
  }

  void _stopTracking() async {
    // Note: User can only stop tracking if doctor is not assigned or by resolving the case?
    // The requirement says "send SOS only once until it didnt get assign doctor".
    // I'll allow stopping for now but indicate it's active.
    await _positionStream?.cancel();
    // We don't delete the queue doc here, Admin completes it.
    setState(() {
      _isTracking = false; 
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF5F5), // Build Verification Color
      appBar: AppBar(
        title: Text("Emergency SOS", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.red[900],
      ),
      body: Stack(
        children: [
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _isTracking ? "Emergency Signal Active" : "Are you in an emergency?",
                    style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.red[900]),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _isTracking 
                      ? (_assignedDoctor != null 
                          ? "Assigned Doctor: $_assignedDoctor\nHelp is currently in transit to your location."
                          : "Your SOS signal has been received by the Command Center. Awaiting physician assignment.")
                      : "Press the button below. After a 5-second safety countdown, we will notify the hospital immediately.",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(fontSize: 14, color: Colors.red[700]),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.red.withOpacity(0.2)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _isTracking ? Icons.wifi_tethering : Icons.location_on, 
                          size: 14, 
                          color: _isTracking ? Colors.blue : Colors.red
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _isTracking ? "BROADCASTING SIGNAL" : _locStatus,
                          style: GoogleFonts.outfit(
                            fontSize: 11, 
                            fontWeight: FontWeight.bold, 
                            color: _isTracking ? Colors.blue : Colors.red
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  GestureDetector(
                    onTap: _isSending || _isTracking ? null : (_isCountingDown ? _cancelCountdown : _startCountdown),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        ScaleTransition(
                          scale: _animation,
                          child: Container(
                            width: 220,
                            height: 220,
                            decoration: BoxDecoration(
                              color: (_isCountingDown || _isTracking) ? Colors.blue.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                        ScaleTransition(
                          scale: _animation,
                          child: Container(
                            width: 180,
                            height: 180,
                            decoration: BoxDecoration(
                              color: (_isCountingDown || _isTracking) ? Colors.blue.withOpacity(0.2) : Colors.red.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            color: _isTracking ? Colors.blue : (_isCountingDown ? Colors.orange : Colors.red),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: (_isCountingDown || _isTracking) ? Colors.blue.withOpacity(0.4) : Colors.red.withOpacity(0.4),
                                blurRadius: 30,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Center(
                            child: _isSending
                                ? const CircularProgressIndicator(color: Colors.white)
                                : Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        _isTracking ? "ACTIVE" : (_isCountingDown ? "$_countdownSeconds" : "SOS"),
                                        style: GoogleFonts.outfit(
                                          color: Colors.white,
                                          fontSize: (_isTracking || _isCountingDown) ? 32 : 40,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                      if (_isCountingDown)
                                        Text(
                                          "CANCEL",
                                          style: GoogleFonts.outfit(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                        )
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                  _buildEmergencyAction(
                    "Call Ambulance",
                    "102",
                    FontAwesomeIcons.truckMedical,
                    Colors.red,
                  ),
                  const SizedBox(height: 15),
                  _buildEmergencyAction(
                    "Call Family",
                    "+91 98765 43210",
                    FontAwesomeIcons.phone,
                    Colors.blue,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    "Build Ver: 23-APR-1928 | Sync Active",
                    style: GoogleFonts.outfit(fontSize: 8, color: Colors.grey[400], fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          if (_isTracking)
            Positioned.fill(
              child: GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Emergency SOS in progress. Hospital has been notified.")),
                  );
                },
                child: Container(
                  color: Colors.transparent, // Blocks taps but remains invisible or semi-transparent
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildEmergencyAction(String title, String subtitle, IconData icon, Color color) {
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
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(subtitle, style: GoogleFonts.outfit(color: Colors.grey, fontSize: 14)),
              ],
            ),
          ),
          IconButton(
            onPressed: () async {
              final Uri url = Uri.parse('tel:$subtitle');
              if (await canLaunchUrl(url)) {
                await launchUrl(url);
              }
            },
            icon: const Icon(Icons.call, color: Colors.green),
          )
        ],
      ),
    );
  }
}
