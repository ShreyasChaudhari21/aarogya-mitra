import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Book an appointment
  Future<void> bookAppointment({
    required String patientName,
    required String doctorName,
    required DateTime date,
    required String slot,
    required String category,
  }) async {
    try {
      await _db.collection('appointments').add({
        'patientName': patientName,
        'doctorName': doctorName,
        'date': date.toIso8601String(),
        'slot': slot,
        'category': category,
        'status': 'Pending',
        'createdAt': FieldValue.serverTimestamp(),
      });

      // Also add to HMS shared queue
      await _db.collection('queue').add({
        'name': patientName,
        'doctor': doctorName,
        'type': 'Appointment',
        'status': 'Waiting',
        'timestamp': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      debugPrint("Error booking appointment: $e");
      rethrow;
    }
  }

  // Trigger SOS
  Future<Map<String, String>> triggerEmergencySOS({
    required String patientName,
    required String address,
    required double lat,
    required double lng,
  }) async {
    try {
      // Add to queue for the live feed
      DocumentReference queueRef = await _db.collection('queue').add({
        'patient_name': patientName,
        'type': 'Emergency',
        'status': 'Pending',
        'priority': 'Critical',
        'symptoms': ['Emergency SOS Signal'],
        'location': {
          'lat': lat,
          'lng': lng,
          'address': address,
        },
        'timestamp': FieldValue.serverTimestamp(),
      });

      // Add to notifications
      DocumentReference notifRef = await _db.collection('notifications').add({
        'title': '🚨 EMERGENCY SOS',
        'message': '$patientName triggered SOS at $address',
        'type': 'urgent',
        'patient_phone': '+91 98765 43210',
        'patient_id': 'AM-2024-9901',
        'health_summary': 'Type 2 Diabetes, Hypertension. Allergic to Penicillin.',
        'blood_group': 'O+ Positive',
        'age': '24 Years',
        'weight': '72 kg',
        'height': '180 cm',
        'category': 'AR',
        'role': 'Admin',
        'timestamp': FieldValue.serverTimestamp(),
        'read_by': [],
        'location': {
          'lat': lat,
          'lng': lng,
          'address': address,
        },
        'queue_id': queueRef.id,
      });

      return {
        'notificationId': notifRef.id,
        'queueId': queueRef.id
      };
    } catch (e) {
      debugPrint("Error triggering SOS: $e");
      rethrow;
    }
  }

  // Stream to check if a patient has an active SOS
  Stream<QuerySnapshot> getActiveSOS(String patientName) {
    return _db.collection('queue')
        .where('patient_name', isEqualTo: patientName)
        .where('type', isEqualTo: 'Emergency')
        .snapshots();
  }

  // Update SOS location in real-time
  Future<void> updateEmergencyLocation({
    required String notificationId,
    required double lat,
    required double lng,
  }) async {
    try {
      // 1. Get Notification Doc to find linked Queue Doc
      DocumentSnapshot notifDoc = await _db.collection('notifications').doc(notificationId).get();
      if (notifDoc.exists) {
        String? queueId = (notifDoc.data() as Map<String, dynamic>?)?['queue_id'];
        
        // 2. Update Notification
        await _db.collection('notifications').doc(notificationId).update({
          'location.lat': lat,
          'location.lng': lng,
          'updatedAt': FieldValue.serverTimestamp(),
        });

        // 3. Update Queue (if linked)
        if (queueId != null) {
          await _db.collection('queue').doc(queueId).update({
            'location.lat': lat,
            'location.lng': lng,
            'updatedAt': FieldValue.serverTimestamp(),
          });
        }
      }
    } catch (e) {
      debugPrint("Error updating SOS location: $e");
    }
  }

  // Get Bed Data (Stream)
  Stream<QuerySnapshot> getBedAvailability() {
    return _db.collection('beds').snapshots();
  }
}
