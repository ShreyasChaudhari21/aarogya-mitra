import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { EmergencyCase, BedStats, Staff, Transaction, Bed, Ward, WardType } from '@/types';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
}

export interface Ambulance {
  id: string;
  driverName: string;
  phone: string;
  status: 'Available' | 'On Route' | 'Maintenance';
  regNumber: string;
  type: 'ALS' | 'BLS' | 'ICU';
  section: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
}
import { 
  db, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  serverTimestamp
} from '@/firebase';
import { toast } from 'react-hot-toast';
import { seedFirestore } from '@/scripts/seedFirestore';

export type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

interface AarogyaContextType {
  cases: EmergencyCase[];
  beds: BedStats;
  staff: Staff[];
  transactions: Transaction[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addEmergencyCase: (newCase: Partial<EmergencyCase>) => Promise<void>;
  updateCaseStatus: (id: string, updates: Partial<EmergencyCase>) => Promise<void>;
  allotBed: (type: 'general' | 'icu') => void;
  removeBedAllotment: (type: 'general' | 'icu') => void;
  addStaff: (staff: Omit<Staff, 'id'>) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  
  // Bed & Ward Mgmt
  detailedBeds: Bed[];
  wards: Ward[];
  addBed: (bed: Partial<Bed>) => void;
  updateBed: (id: string, updates: Partial<Bed>) => void;
  deleteBed: (id: string) => void;
  addWard: (ward: Partial<Ward>) => Promise<void>;
  updateWard: (id: string, updates: Partial<Ward>) => Promise<void>;
  deleteWard: (id: string) => Promise<void>;
  assignBedToPatient: (patientId: string, bedId: string) => void;
  dischargePatient: (admissionId: string, bedId: string) => void;
  patients: Patient[];
  addPatient: (patient: Partial<Patient>) => Promise<string | undefined>;
  user: { id: string; name: string; role: string } | null;
  setUser: (user: { id: string; name: string; role: string } | null) => void;
  
  // Bed Requests (Receptionist -> Admin)
  bedRequests: any[];
  addBedRequest: (req: any) => Promise<void>;
  updateBedRequestStatus: (id: string, status: string) => Promise<void>;
  
  // Billing
  billings: any[];
  addBilling: (bill: any) => Promise<void>;

  // Queue
  queue: any[];
  addQueueToken: (name: string, type: string, patient_id?: string) => Promise<void>;
  updateQueueStatus: (id: string, status: string) => Promise<void>;
  removeQueueToken: (id: string) => Promise<void>;
  
  // Notifications
  notifications: any[];
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  createNotification: (notif: { user_id?: string, role?: string, title: string, message: string, type?: string, category?: string, priority?: string }) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  syncStatus: SyncStatus;
  syncProgress: number;
  initializeSystem: () => Promise<void>;
  ambulances: Ambulance[];
  updateAmbulanceStatus: (id: string, status: Ambulance['status']) => void;
}

export const AarogyaContext = createContext<AarogyaContextType | undefined>(undefined);

export const AarogyaProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [beds, setBeds] = useState<BedStats>({
    total: 450,
    available: 120,
    icuTotal: 40,
    icuAvailable: 12
  });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [detailedBeds, setDetailedBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [bedRequests, setBedRequests] = useState<any[]>([]);
  const [billings, setBillings] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('SYNCED');
  const [syncProgress] = useState(0);

  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => {
    const saved = localStorage.getItem('aarogya_ambulances');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch(e) {}
    }
    return [
      { id: 'AMB-101', driverName: 'Rajesh Kumar', phone: '+91 9876543210', status: 'Available', regNumber: 'MH-01-AB-1234', type: 'ALS', section: 'Main Gate' },
      { id: 'AMB-102', driverName: 'Suresh Singh', phone: '+91 9876543211', status: 'Available', regNumber: 'MH-01-AB-1235', type: 'BLS', section: 'Main Gate' },
      { id: 'AMB-103', driverName: 'Amit Patel', phone: '+91 9876543212', status: 'Available', regNumber: 'MH-01-AB-1236', type: 'ICU', section: 'Main Gate' },
      { id: 'AMB-104', driverName: 'Vikas Sharma', phone: '+91 9876543213', status: 'Maintenance', regNumber: 'MH-01-AB-1237', type: 'BLS', section: 'Main Gate' },
      { id: 'AMB-105', driverName: 'Rahul Verma', phone: '+91 9876543214', status: 'Available', regNumber: 'MH-01-AB-1238', type: 'ALS', section: 'Main Gate' },
      { id: 'AMB-201', driverName: 'Sunil Yadav', phone: '+91 9876543215', status: 'Available', regNumber: 'MH-01-CD-9876', type: 'ICU', section: 'Emergency Entrance' },
      { id: 'AMB-202', driverName: 'Prakash Rao', phone: '+91 9876543216', status: 'Available', regNumber: 'MH-01-CD-9877', type: 'ALS', section: 'Emergency Entrance' },
      { id: 'AMB-203', driverName: 'Manoj Tiwari', phone: '+91 9876543217', status: 'Available', regNumber: 'MH-01-CD-9878', type: 'BLS', section: 'Emergency Entrance' },
      { id: 'AMB-301', driverName: 'Deepak Joshi', phone: '+91 9876543218', status: 'Available', regNumber: 'MH-01-EF-4567', type: 'BLS', section: 'Rear Gate' },
      { id: 'AMB-302', driverName: 'Karan Singh', phone: '+91 9876543219', status: 'Available', regNumber: 'MH-01-EF-4568', type: 'ALS', section: 'Rear Gate' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aarogya_ambulances', JSON.stringify(ambulances));
  }, [ambulances]);

  const updateAmbulanceStatus = (id: string, status: Ambulance['status']) => {
    setAmbulances(prev => prev.map(amb => amb.id === id ? { ...amb, status } : amb));
  };

  useEffect(() => {
    const unsubscribeQueue = onSnapshot(collection(db, 'queue'), (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as any[];
      
      const rawPatients = allDocs.filter(d => (d.type === 'Clinical' || d.type === 'Emergency') && d.patient_name).map(d => ({
        id: d.id,
        name: d.patient_name,
        age: d.age || 0,
        gender: d.gender || 'Unknown'
      }));

      // Deduplicate by Name
      const uniquePatients = Array.from(new Map(rawPatients.filter(p => p.name).map(p => [p.name.toUpperCase(), p])).values());
      setPatients(uniquePatients);

      setBedRequests(allDocs.filter(d => d.type === 'BedRequest' || d.status === 'Waiting/Bed' || d.status === 'Admitted').sort((a, b) => {
        // 1. Pending status takes strategic precedence
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        
        // 2. Priority escalation rank
        const pRank: any = { 'Critical': 3, 'Urgent': 2, 'Normal': 1 };
        const scoreA = pRank[a.priority] || 0;
        const scoreB = pRank[b.priority] || 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // 3. Chronological recency
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      }));

      setBillings(allDocs.filter(d => d.billing).map(d => {
        const patientName = d.patient_name || 'System User';
        let billDate = new Date().toLocaleDateString();
        try {
          if (d.billing.createdAt) {
            const parsed = new Date(d.billing.createdAt);
            if (!isNaN(parsed.getTime())) billDate = parsed.toLocaleDateString();
          }
        } catch(e) {}
        
        return {
          id: d.id,
          ...d.billing,
          patientName,
          date: billDate
        };
      }));

      const sortedQueue = allDocs
        .filter(d => d.type !== 'Ward Metadata' && d.type !== 'Bed Metadata')
        .sort((a, b) => (Number(a.token_number) || 0) - (Number(b.token_number) || 0));
      setQueue(sortedQueue);

      const dynamicWards = allDocs.filter(d => d.type === 'Ward Metadata').map(d => ({
        id: d.id,
        name: d.name,
        type: d.wardType as WardType,
        floor: d.floor
      })) as Ward[];
      
      const placeholders: Ward[] = [
        { id: 'w1', name: 'ICU ALPHA', type: 'ICU' as WardType, floor: '1' },
        { id: 'w2', name: 'GENERAL WARD A', type: 'General' as WardType, floor: '2' }
      ];

      const activeWards = [...dynamicWards];
      placeholders.forEach(p => {
        if (!activeWards.some(aw => aw.name?.toLowerCase() === p.name.toLowerCase())) {
          activeWards.push(p);
        }
      });
      
      setWards(activeWards);

      const dynamicBeds = allDocs.filter(d => d.type === 'Bed Metadata').map(d => ({
        id: d.id,
        bedNumber: d.bedNumber,
        wardId: d.wardId,
        type: d.bedType,
        status: d.status || 'Available'
      })) as Bed[];

      const activeBeds = dynamicBeds.length > 0 ? dynamicBeds : Array.from({ length: 40 }, (_, i) => ({
          id: `b_base_${i+1}`,
          bedNumber: (i + 1).toString().padStart(3, '0'),
          wardId: i < 10 ? (activeWards[0]?.id || 'w1') : (activeWards[1 % activeWards.length]?.id || 'w2'),
          status: 'Available',
          type: i < 10 ? 'ICU' : 'General'
      })) as Bed[];

      const occupiedBeds = allDocs.filter(d => d.status === 'Admitted' && d.bed_details);
      
      const hydratedBeds = activeBeds.map(bed => {
        const occupant = occupiedBeds.find(d => String(d.bed_details?.bedNumber) === String(bed.bedNumber));
        return occupant ? { 
          ...bed, 
          status: 'Occupied', 
          patientId: occupant.id, 
          patientName: occupant.patient_name 
        } as Bed : bed;
      });
      
      setDetailedBeds(hydratedBeds);

      const clinicalQueue = sortedQueue.filter(d => d.type === 'Clinical');
      const inProgress = clinicalQueue.find(d => d.status === 'In Progress');
      const nextWaiting = clinicalQueue.find(d => d.status === 'Waiting');

      if (!inProgress && nextWaiting) {
        updateDoc(doc(db, 'queue', nextWaiting.id), {
          status: 'In Progress',
          updatedAt: serverTimestamp()
        });
      }

      setCases(allDocs.filter(d => d.type === 'Emergency').map(d => ({
        id: d.id,
        patientName: d.patient_name || 'Emergency Patient',
        symptoms: d.symptoms || [],
        priority: d.priority || 'Moderate',
        status: d.status || 'Pending',
        assignedDoctor: d.assignedDoctor,
        bed_details: d.bed_details,
        location: d.location,
        ambulanceId: d.ambulanceId,
        timestamp: (() => {
          try {
            if (d.timestamp?.toDate) return d.timestamp.toDate().toISOString();
            if (d.timestamp?.seconds) return new Date(d.timestamp.seconds * 1000).toISOString();
            if (typeof d.timestamp === 'string' && !isNaN(new Date(d.timestamp).getTime())) return d.timestamp;
            return new Date().toISOString();
          } catch(e) {
            return new Date().toISOString();
          }
        })()
      })));

      setLoading(false);
    });

    // 2. Staff Listener (Synced with 'users' collection)
    const unsubscribeStaff = onSnapshot(collection(db, 'users'), (snapshot) => {
      const staffList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];
      setStaff(staffList);
    });

    // 3. Notifications Listener
    const unsubscribeNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const priorityRank = (p: string) => {
          switch(p?.toUpperCase()) {
              case 'HIGH': return 3;
              case 'URGENT': return 4;
              case 'MEDIUM': return 2;
              case 'LOW': return 1;
              default: return 0;
          }
      };

      const notificationsData = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        const isForMe = !data.role || 
                         data.role === 'All' || 
                         data.role.toLowerCase() === user?.role?.toLowerCase();
        
        if (!isForMe) return null;
        const isReadByMe = data.read_by?.includes(user?.id?.toString());
        
        return {
          ...data,
          id: doc.id,
          docId: doc.id,
          category: data.category || 'HS', 
          is_read: isReadByMe ? 1 : 0,
          created_at: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : 
                     (data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000).toISOString() : 
                     (data.created_at || new Date().toISOString()))
        };
      })
      .filter(n => n !== null)
      .sort((a: any, b: any) => {
          const pDiff = priorityRank(b.priority) - priorityRank(a.priority);
          if (pDiff !== 0) return pDiff;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setNotifications(notificationsData);
    });

    // 4. Ambulances Listener removed

    return () => {
      unsubscribeQueue();
      unsubscribeStaff();
      unsubscribeNotifications();
    };
  }, [user]);

  // --- CLOUD FUNCTION SIMULATOR (VIVA AUTOMATION) ---
  useEffect(() => {
    const processCloudLogic = async () => {
      // Only one 'engine' should run (e.g. the Admin's terminal) 
      // but for demo, we let the active terminal handle its own auto-logic
      const pendingReqs = bedRequests.filter(r => r.status === 'Pending' && r.priority === 'Urgent');
      
      for (const req of pendingReqs) {
        if (beds.available > 0) {
          console.log(`[Cloud Engine] Auto-approving request: ${req.id}`);
          toast.loading("Google Cloud: Auto-assigning bed...", { id: 'cloud-f' });
          
          setTimeout(async () => {
            setBeds(prev => ({ ...prev, available: prev.available - 1 }));
            await updateBedRequestStatus(req.id, 'Approved');
            
            await createNotification({
              title: "AUTO-ALLOTMENT",
              message: `System assigned bed to ${req.patientName || 'Emergency Patient'}.`,
              role: "Admin",
              type: "success",
              category: "HS"
            });
            
            toast.success("Cloud Automation: Bed Secured", { id: 'cloud-f' });
          }, 2000);
        }
      }
    };

    if (bedRequests.length > 0) processCloudLogic();
  }, [bedRequests]);

  const addEmergencyCase = async (newCase: Partial<EmergencyCase>) => {
    try {
      await addDoc(collection(db, 'queue'), {
        patient_name: newCase.patientName || 'Emergency Patient',
        age: 0,
        gender: 'Unknown',
        type: 'Emergency',
        status: 'Pending',
        priority: newCase.priority || 'Critical',
        symptoms: newCase.symptoms || [],
        bed_details: null,
        billing: null,
        timestamp: serverTimestamp(),
        token_number: queue.length + 500
      });
      toast.success("Emergency Signal Broadcasted");
    } catch (e: any) {
      toast.error("Emergency sync failed: " + e.message);
    }
  };

  const updateCaseStatus = async (id: string, updates: Partial<EmergencyCase>) => {
    try {
      await updateDoc(doc(db, 'queue', id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const allotBed = () => { /* Derived */ };
  const removeBedAllotment = () => { /* Derived */ };

  const addStaff = async (newStaff: Omit<Staff, 'id'>) => {
    try {
      await addDoc(collection(db, 'users'), {
        name: newStaff.name,
        role: newStaff.role || 'Doctor',
        dept: newStaff.dept || 'General medicine',
        status: newStaff.status || 'ON_DUTY',
        phone: newStaff.phone || '+91 00000 00000',
        email: newStaff.email || `${newStaff.name?.toLowerCase().replace(' ', '.')}@aarogya.com`,
        createdAt: new Date().toISOString()
      });
      toast.success(`Personnel registered in secure ledger: ${newStaff.name}`);
    } catch (e: any) {
      toast.error("Cloud registration failed: " + e.message);
    }
  };
  const addTransaction = async (tx: Transaction) => {
    try {
      await addDoc(collection(db, 'queue'), {
        ...tx,
        type: 'Transaction',
        timestamp: serverTimestamp()
      });
      toast.success("Settlement synchronized.");
    } catch(e) { console.error(e); }
  };

  const addBed = async (bed: Partial<Bed>) => {
    try {
      await addDoc(collection(db, 'queue'), {
        bedNumber: bed.bedNumber,
        wardId: bed.wardId,
        bedType: bed.type,
        type: 'Bed Metadata',
        age: 0,
        gender: 'N/A',
        priority: 'Normal',
        status: 'Available',
        patient_name: '',
        symptoms: [],
        bed_details: null,
        billing: null,
        timestamp: serverTimestamp()
      });
      toast.success("New bed unit synchronized.");
    } catch(e: any) { toast.error("Hardware sync failed: " + e.message); }
  };

  const updateBed = async (id: string, updates: Partial<Bed>) => {
    try {
      const payload: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      if (updates.type !== undefined) {
        payload.bedType = updates.type;
        delete payload.type;
      } else {
        delete payload.type;
      }
      await updateDoc(doc(db, 'queue', id), payload);
    } catch(e) { console.error(e); }
  };

  const deleteBed = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'queue', id));
      toast.success("Bed resource removed.");
    } catch(e) { console.error(e); }
  };
  
  const assignBedToPatient = async (patientId: string, bedId: string) => {
    try {
      const bed = detailedBeds.find(b => b.id === bedId);
      await updateDoc(doc(db, 'queue', patientId), {
        status: "Admitted",
        bed_details: {
          bedNumber: bed?.bedNumber,
          ward: bed?.wardId === 'w1' ? 'ICU ALPHA' : 'GENERAL WARD A',
          type: bed?.type
        },
        updatedAt: serverTimestamp()
      });
      toast.success("Patient successfully moved to bed.");
    } catch (e) {
      toast.error("Cloud assignment failed.");
    }
  };

  const dischargePatient = async (admissionId: string, _bedId: string) => {
    try {
      await updateDoc(doc(db, 'queue', admissionId), {
        status: "Discharged",
        bed_details: null, 
        updatedAt: serverTimestamp()
      });
      toast.success("Bed vacated and registry updated.");
    } catch (e) {
      toast.error("Discharge protocol sync failed.");
    }
  };

  const addPatient = async (patient: Partial<Patient>) => {
    try {
      const docRef = await addDoc(collection(db, 'queue'), {
        patient_name: patient.name,
        age: patient.age || 0,
        gender: patient.gender || 'Unknown',
        type: 'Clinical',
        status: 'Waiting',
        priority: 'Normal',
        symptoms: [],
        bed_details: null,
        billing: null,
        token_number: queue.length + 101,
        timestamp: serverTimestamp()
      });
      toast.success("Patient recorded in cloud registry.");
      return docRef.id;
    } catch(e) { 
      toast.error("Cloud registration failed.");
    }
  };

  const addWard = async (ward: Partial<Ward>) => {
    try {
      await addDoc(collection(db, 'queue'), {
        name: ward.name,
        wardType: ward.type,
        floor: ward.floor,
        type: 'Ward Metadata',
        age: 0,
        gender: 'N/A',
        priority: 'Normal',
        status: 'Operational',
        symptoms: [],
        bed_details: null,
        billing: null,
        timestamp: serverTimestamp()
      });
      toast.success("Ward configuration broadcasted to cloud.");
    } catch(e: any) { toast.error("Handshake failed: " + e.message); }
  };

  const updateWard = async (id: string, updates: Partial<Ward>) => {
    try {
      const payload: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      if (updates.type !== undefined) {
        payload.wardType = updates.type;
        delete payload.type;
      } else {
        delete payload.type;
      }
      await updateDoc(doc(db, 'queue', id), payload);
    } catch(e) { console.error(e); }
  };

  const deleteWard = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'queue', id));
      toast.success("Ward decommissioned.");
    } catch(e) { console.error(e); }
  };


  const createNotification = async (notif: { user_id?: number | string, role?: string, title: string, message: string, type?: string, category?: string, priority?: string, timestamp?: any }) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notif,
        priority: notif.priority || 'Medium',
        timestamp: serverTimestamp(),
        read_by: []
      });
      toast.success("Signal broadcasted.");
    } catch (err: any) {
      console.error("Firebase Propagation Error:", err.message);
      toast.error("Cloud Sync Failed");
    }
  };

  const addBedRequest = async (req: any) => {
    try {
      await addDoc(collection(db, 'queue'), {
        patient_name: req.patient_name,
        age: 0,
        gender: 'Unknown',
        type: 'BedRequest',
        status: 'Waiting/Bed',
        priority: req.priority || 'High',
        symptoms: [],
        bed_details: null,
        billing: null,
        timestamp: serverTimestamp(),
        token_number: queue.length + 300
      });

      await createNotification({
        type: 'BED_REQUEST',
        title: 'Admission Required',
        message: `Bed signal for ${req.patient_name}`,
        priority: req.priority || 'High',
        timestamp: serverTimestamp(),
        role: 'Admin'
      });
      toast.success("Bed request synchronized.");
    } catch (err) {
      console.error(err);
    }
  };

  const updateBedRequestStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'queue', id), {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addQueueToken = async (name: string, typeValue: string, patient_id?: string) => {
    if (patient_id) {
       await updateDoc(doc(db, 'queue', patient_id), { status: 'Waiting', type: typeValue });
    } else {
      await addDoc(collection(db, 'queue'), {
        token_number: queue.length + 101,
        patient_name: name,
        type: typeValue,
        status: 'Waiting',
        age: 0,
        gender: 'Unknown',
        priority: 'Normal',
        symptoms: [],
        bed_details: null,
        billing: null,
        timestamp: serverTimestamp()
      });
    }
  };

  const updateQueueStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'queue', id), {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeQueueToken = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'queue', id));
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!user) return;
    const notif = notifications.find(n => n.id === id);
    
    if (notif?.docId) {
      try {
         const { arrayUnion } = await import('firebase/firestore');
         await updateDoc(doc(db, 'notifications', notif.docId), {
           read_by: arrayUnion(user.id.toString())
         });
      } catch (err) {
        console.error("Firebase per-user read sync failed:", err);
      }
    }
  };

  const markAllNotificationsRead = async () => {
    if (!user) return;
    
    try {
      const { writeBatch, arrayUnion } = await import('firebase/firestore');
      const batch = writeBatch(db);
      
      notifications.forEach(n => {
        if (n.docId) {
          batch.update(doc(db, 'notifications', n.docId), {
            read_by: arrayUnion(user.id.toString())
          });
        }
      });
      
      await batch.commit();
      toast.success("All signals acknowledged.");
    } catch (err) {
      console.error("Cloud mark-all-read failed:", err);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      toast.success("Signal permanently purged.");
    } catch (err) {
      console.error("Cloud delete failed:", err);
      toast.error("Failed to expunge signal.");
    }
  };

  return (
    <AarogyaContext.Provider value={{
      cases, beds, staff, transactions, loading, searchQuery, setSearchQuery,
      addEmergencyCase, updateCaseStatus, allotBed, removeBedAllotment,
      addStaff, addTransaction,
      detailedBeds, wards, addBed, updateBed, deleteBed,
      addWard, updateWard, deleteWard,
      assignBedToPatient, dischargePatient, patients, addPatient,
      user, setUser,
      bedRequests,
      billings,
      addBilling: async (bill: any) => {
        try {
          const targetId = bill.patientId || bill.patient_id;
          if (!targetId) throw new Error("Missing Patient Identity for Settlement");

          await updateDoc(doc(db, 'queue', targetId), {
            billing: {
              amount: bill.amount,
              status: bill.status || 'PENDING',
              method: bill.method || 'UPI',
              createdAt: new Date().toISOString()
            }
          });
          toast.success("Billing pulse recorded.");
        } catch (e: any) {
          console.error(e);
          toast.error("Billing update failed: " + e.message);
        }
      },
      addBedRequest,
      updateBedRequestStatus,
      queue,
      addQueueToken,
      updateQueueStatus: async (id: string, status: string) => updateQueueStatus(id, status),
      removeQueueToken: async (id: string) => removeQueueToken(id),
      // Notifications
      notifications,
      fetchNotifications: async () => {
        // Handled by realtime listener
      },
      markNotificationRead: async (id: string) => markNotificationRead(id),
      markAllNotificationsRead,
      createNotification,
      deleteNotification,
      syncStatus,
      syncProgress,
      ambulances,
      updateAmbulanceStatus,
      initializeSystem: async () => {
        try {
          setSyncStatus('PENDING');
          toast.loading("🔥 Initializing Firestore Backbone...", { id: 'seed' });
          await seedFirestore();
          setSyncStatus('SYNCED');
          toast.success("System Architecture Hardened & Seeded", { id: 'seed' });
        } catch (e: any) {
          setSyncStatus('FAILED');
          toast.error("Initialization Failed: " + e.message, { id: 'seed' });
        }
      }
    }}>
      {children}
    </AarogyaContext.Provider>
  );
};

export const useAarogyaContext = () => {
  const context = useContext(AarogyaContext);
  if (context === undefined) {
    throw new Error('useAarogyaContext must be used within an AarogyaProvider');
  }
  return context;
};
