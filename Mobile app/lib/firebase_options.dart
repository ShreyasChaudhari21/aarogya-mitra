import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

// Firebase configuration placeholders
// Replace these with your actual Firebase project values
// Get them from: https://console.firebase.google.com → Project Settings → Your apps

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_FIREBASE_API_KEY',
    appId: 'YOUR_FIREBASE_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
    storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_FIREBASE_API_KEY',
    appId: 'YOUR_FIREBASE_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_FIREBASE_API_KEY',
    appId: 'YOUR_FIREBASE_IOS_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
    iosBundleId: 'com.example.aarogyaMitraMobile',
  );
}
