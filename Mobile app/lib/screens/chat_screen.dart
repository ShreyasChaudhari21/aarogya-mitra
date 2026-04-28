import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'sos_screen.dart';
import 'booking_screen.dart';
import 'dart:async';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  final List<Map<String, dynamic>> _messages = [
    {
      "text": "Welcome to Aarogya Mitra. I am your specialized medical assistant. How can I assist with your health today?",
      "isAi": true
    }
  ];

  bool _isLoading = false;
  late stt.SpeechToText _speech;
  bool _isListening = false;
  late FlutterTts _flutterTts;

  @override
  void initState() {
    super.initState();
    _initSpeech();
    _initTts();
  }

  void _initSpeech() async {
    _speech = stt.SpeechToText();
  }

  void _initTts() {
    _flutterTts = FlutterTts();
    _flutterTts.setLanguage("en-US");
    _flutterTts.setPitch(1.0);
    _flutterTts.setSpeechRate(1.0);
  }

  @override
  void dispose() {
    _flutterTts.stop();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _speak(String text) async {
    await _flutterTts.speak(text);
  }

  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (val) {
          if (val == 'done' || val == 'notListening') {
            setState(() => _isListening = false);
          }
        },
        onError: (val) => debugPrint('Speech Error: $val'),
      );
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (val) => setState(() {
            _controller.text = val.recognizedWords;
          }),
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
      if (_controller.text.isNotEmpty) {
        _sendMessage();
      }
    }
  }

  Future<String> _getGeminiResponse(String prompt) async {
    // Production Fail-safe: Hardcoded key for stable deployment
    const String apiKey = 'YOUR_GEMINI_API_KEY'; // Get from https://aistudio.google.com/app/apikey

    // FINAL ATTEMPT: Using gemini-2.5-flash-lite (Newest model, likely has a fresh quota)
    final url = Uri.parse('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=$apiKey');
    
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "SYSTEM: You are Aarogya Mitra, a highly professional hospital assistant. You are empathetic, concise (max 2 sentences), and medical-focused. USER: $prompt"
              }
            ]
          }
        ],
        "generationConfig": {
          "temperature": 0.4, // Lower temperature for more clinical/accurate responses
          "maxOutputTokens": 150,
        }
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['candidates'][0]['content']['parts'][0]['text'];
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error']['message'] ?? "Connection Error");
    }
  }

  void _handleCommands(String text) async {
    final lowerText = text.toLowerCase();
    
    // Smart Intent Detection for SOS
    if (lowerText.contains("ambulance") || 
        lowerText.contains("emergency") || 
        lowerText.contains("sos") ||
        lowerText.contains("accident") ||
        lowerText.contains("heart attack") ||
        lowerText.contains("cannot breathe")) {
      
      _speak("EMERGENCY DETECTED. Dispatching SOS alert to HMS Dashboard now.");
      
      try {
        await FirebaseFirestore.instance.collection('queue').add({
          "type": "Emergency",
          "message": "VOICE ALERT: $text",
          "status": "Pending",
          "priority": "Critical",
          "source": "Voice Assistant",
          "timestamp": FieldValue.serverTimestamp(),
        });
      } catch (e) {
        debugPrint("Firestore Error: $e");
      }

      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) {
          Navigator.push(context, MaterialPageRoute(builder: (context) => const SOSScreen()));
        }
      });
    } 
    // Smart Intent Detection for Booking
    else if (lowerText.contains("book") || 
             lowerText.contains("appointment") || 
             lowerText.contains("see a doctor") ||
             lowerText.contains("checkup")) {
      
      _speak("Navigating you to the appointment booking system.");
      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) {
          Navigator.push(context, MaterialPageRoute(builder: (context) => const BookingScreen()));
        }
      });
    }
  }

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    _handleCommands(text);

    setState(() {
      _messages.add({"text": text, "isAi": false});
      _isLoading = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final aiResponse = await _getGeminiResponse(text);

      setState(() {
        _messages.add({"text": aiResponse.trim(), "isAi": true});
      });
      
      _speak(aiResponse.trim());
      
    } catch (e) {
      setState(() {
        _messages.add({"text": "System Note: $e. Please check your connectivity.", "isAi": true});
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent + 200,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeOutCubic,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Aarogya Mitra", style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18)),
            Text("AI Medical Assistant", style: GoogleFonts.outfit(fontSize: 12, color: Colors.blue)),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.grey),
            onPressed: () => setState(() => _messages.clear()),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildModernBubble(msg['text'], isAi: msg['isAi']);
              },
            ),
          ),
          
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.only(bottom: 15),
              child: _TypingIndicator(),
            ),
          
          _buildInputPanel(),
        ],
      ),
    );
  }

  Widget _buildModernBubble(String text, {required bool isAi}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: isAi ? CrossAxisAlignment.start : CrossAxisAlignment.end,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
            decoration: BoxDecoration(
              color: isAi ? Colors.white : const Color(0xFF1A73E8),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(20),
                topRight: const Radius.circular(20),
                bottomLeft: isAi ? const Radius.circular(4) : const Radius.circular(20),
                bottomRight: isAi ? const Radius.circular(20) : const Radius.circular(4),
              ),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 4)),
              ],
            ),
            child: Text(
              text,
              style: GoogleFonts.outfit(
                color: isAi ? Colors.black87 : Colors.white,
                fontSize: 15,
                height: 1.4,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 4, left: 4, right: 4),
            child: Text(
              isAi ? "Aarogya AI" : "You",
              style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputPanel() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20)],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F3F4),
                borderRadius: BorderRadius.circular(28),
              ),
              child: TextField(
                controller: _controller,
                onSubmitted: (_) => _sendMessage(),
                decoration: InputDecoration(
                  hintText: _isListening ? "Listening context..." : "How can I help?",
                  hintStyle: GoogleFonts.outfit(color: Colors.grey),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          _buildActionButton(
            icon: _isListening ? Icons.mic : Icons.mic_none,
            color: _isListening ? Colors.red : const Color(0xFF1A73E8),
            onTap: _listen,
          ),
          const SizedBox(width: 8),
          _buildActionButton(
            icon: Icons.send_rounded,
            color: const Color(0xFF1A73E8),
            onTap: _sendMessage,
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({required IconData icon, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        width: 48,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text("AI is thinking", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
        const SizedBox(width: 8),
        const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2)),
      ],
    );
  }
}
