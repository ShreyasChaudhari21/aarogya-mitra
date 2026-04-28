export type Priority = 'Critical' | 'Moderate' | 'Low';
export type Status = 'Pending' | 'In Progress' | 'Assigned' | 'Completed' | 'Cancelled';

export interface EmergencyCase {
  id: string;
  patientName: string;
  symptoms: string[];
  priority: Priority;
  status: Status;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedDoctor?: string;
  bed_details?: any;
  triageNotes?: string;
  firstAid?: string;
  ambulanceId?: string | null;
}

export interface BedStats {
  total: number;
  available: number;
  icuTotal: number;
  icuAvailable: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string; 
  status: 'ON_DUTY' | 'ON_BREAK' | 'OFF_DUTY' | 'Active' | 'On Break' | 'Offline';
  dept?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export interface Transaction {
  id: string;
  caseId: string;
  amount: number;
  status: 'Success' | 'Failure' | 'Pending';
  timestamp: string;
}

export type BedStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
export type WardType = 'ICU' | 'General' | 'Emergency' | 'Private';

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  status: BedStatus;
  type: 'ICU' | 'General';
  patientId?: string;
  patientName?: string;
  lastCleaned?: string;
}

export interface Ward {
  id: string;
  name: string;
  type: WardType;
  floor: string;
}
