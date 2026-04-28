import { db, doc, writeBatch, serverTimestamp } from '../firebase';

export const seedFirestore = async () => {
  console.log("🔥 Initializing 3-Table Firestore Architecture...");
  const batch = writeBatch(db);

  // 1. Seed Users (RBAC)
  const users = [
    { id: 'u1', name: 'Dr. Aditi', email: 'aditi@aarogya.com', role: 'Doctor' },
    { id: 'u2', name: 'Dr. Khanna', email: 'khanna@aarogya.com', role: 'Doctor' },
    { id: 'u3', name: 'Rohan Reception', email: 'reception@aarogya.com', role: 'Receptionist' },
    { id: 'u4', name: 'Aditya Admin', email: 'admin@aarogya.com', role: 'Admin' }
  ];

  users.forEach(user => {
    batch.set(doc(db, 'users', user.id), {
      ...user,
      createdAt: new Date().toISOString()
    });
  });

  // 2. Seed Queue (Active Patients, Emergencies, & Ward Infrastructure)
  const queueItems = [
    {
      id: 'w_icu',
      name: 'ICU ALPHA',
      wardType: 'ICU',
      floor: '1',
      type: 'Ward Metadata',
      status: 'Operational',
      age: 0,
      gender: 'N/A',
      priority: 'Normal',
      symptoms: [],
      bed_details: null,
      billing: null,
      timestamp: serverTimestamp()
    },
    {
      id: 'w_gen',
      name: 'GENERAL WARD A',
      wardType: 'General',
      floor: '2',
      type: 'Ward Metadata',
      status: 'Operational',
      age: 0,
      gender: 'N/A',
      priority: 'Normal',
      symptoms: [],
      bed_details: null,
      billing: null,
      timestamp: serverTimestamp()
    },
    {
      id: 'q1',
      patient_name: 'Kunal Lakhpati',
      age: 24,
      gender: 'Male',
      type: 'Clinical',
      status: 'Admitted',
      bed_details: { bedNumber: '001', ward: 'ICU ALPHA', type: 'ICU' },
      token_number: 101,
      timestamp: serverTimestamp()
    },
    {
      id: 'q2',
      patient_name: 'Aditya Karodiwal',
      age: 21,
      gender: 'Male',
      type: 'Clinical',
      status: 'Waiting',
      token_number: 102,
      timestamp: serverTimestamp()
    },
    {
      id: 'q3',
      patient_name: 'Emergency Case #08',
      type: 'Emergency',
      status: 'In Transit',
      priority: 'Critical',
      symptoms: ['Chest Pain', 'Shortness of Breath'],
      token_number: 501,
      timestamp: serverTimestamp()
    }
  ];

  queueItems.forEach(item => {
    batch.set(doc(db, 'queue', item.id), item);
  });

  // 3. Seed Notifications
  const notifications = [
    {
      id: 'n1',
      title: 'System Online',
      message: 'Aarogya Central Serverless Node Active.',
      role: 'All',
      priority: 'Low',
      timestamp: serverTimestamp()
    },
    {
      id: 'n2',
      title: 'Emergency Signal',
      message: 'Critical patient arriving in 5 mins.',
      role: 'Doctor',
      priority: 'Urgent',
      timestamp: serverTimestamp()
    }
  ];

  notifications.forEach(notif => {
    batch.set(doc(db, 'notifications', notif.id), notif);
  });

  await batch.commit();
  console.log("✅ 3-Table Migration Successful. Architecture Consolidated.");
};
