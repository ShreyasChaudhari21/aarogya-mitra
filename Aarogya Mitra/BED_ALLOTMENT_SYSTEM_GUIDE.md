# Bed Allotment System - Comprehensive Guide
## Aarogya Mitra Hospital Management System

---

## 📋 Table of Contents
1. Overview & Architecture
2. System Components
3. Technical Implementation
4. Data Flow & Operations
5. User Workflows
6. Database Schema
7. API Integration
8. Frontend Features
9. Key Algorithms
10. Future Enhancements

---

## 1. Overview & Architecture

### Purpose
The Bed Allotment System is a critical component of the Aarogya Mitra HMS that manages the allocation of hospital beds to patients during admission. It provides:
- Real-time bed availability tracking
- Intelligent bed allocation
- Patient queue management
- Ward-based organization
- Occupancy visualization
- Admission workflow automation

### System Objectives
✅ Minimize bed allocation time  
✅ Optimize bed utilization  
✅ Reduce patient waiting time  
✅ Prevent double-booking  
✅ Track bed status accurately  
✅ Manage ward capacity  
✅ Support emergency admissions  

### Architecture Pattern
**Model-View-Hook Pattern** (React Context-based)
- **Model:** Backend Flask APIs + SQLite Database
- **View:** React Components (BedAllotment.tsx)
- **Hook:** useAarogyaData() for state management

---

## 2. System Components

### 2.1 Frontend Components

#### **BedAllotment Page Component**
**File:** `src/pages/BedAllotment.tsx`

**Primary Responsibilities:**
- Display pending admissions queue
- Render bed availability heatmap
- Handle admission approval workflow
- Manage ward-level visualization

**Key UI Sections:**

```
┌─────────────────────────────────────────┐
│         HOSPITAL HEADER                  │
│  Logo | Title | Notifications | Profile │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    PENDING ADMISSIONS SECTION            │
│  Patient Name | Source | Wait | Est Time│
│  [Mary Johnson]  [ED]   [2h]   [2h 5m] │
│  [James Clark]   [ED]   [14h]  [1h 45m]│
│  [Patricia White][ED]   [1h]   [1h 10m]│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      BED AVAILABILITY HEATMAP            │
│          (Wards × Beds Matrix)           │
│  ┌──────────────────────────────────┐   │
│  │ Ward      │ Bed1│Bed2│...│Bed11│   │
│  │ 7 South   │  ●  │ ● │ ● │     │   │
│  │ 7 West    │  ●  │ ● │ ● │     │   │
│  │ 6 North   │  ●  │ ● │ ● │     │   │
│  │ 5 East    │  ●  │ ● │ ◐ │ ●   │   │
│  │ ICUs      │  ●  │ ● │ ● │     │   │
│  └──────────────────────────────────┘   │
│  Legend: ● Occupied | ◐ Anticipated | ○ Available
└─────────────────────────────────────────┘
```

#### **Heatmap Matrix**
- **Rows:** Hospital wards (7 South, 7 West, 6 North, 5 East, ICUs)
- **Columns:** Individual beds (1-11)
- **Values:** 
  - `0` = Empty/Available
  - `1` = Occupied
  - `2` = Anticipated/Reserved

#### **Sidebar Component**
- Navigation to other pages
- Quick access to dashboard
- User profile access

#### **Topbar Component**
- Search functionality
- System notifications
- User settings

---

### 2.2 State Management Hook

#### **useAarogyaData Hook**
**File:** `src/hooks/useAarogyaData.ts`

**State Variables:**
```typescript
beds: Bed[]                    // All beds in system
detailedBeds: DetailedBed[]    // Beds with extended info
wards: Ward[]                  // All wards
patients: Patient[]            // Patient database
admissions: Admission[]        // Current admissions
```

**Functions Provided:**
```typescript
addBed(bedData)       // Add new bed to system
updateBed(id, data)   // Update bed status/info
deleteBed(id)         // Remove bed from system
addWard(wardData)     // Create new ward
updateWard(id, data)  // Modify ward details
deleteWard(id)        // Delete ward
searchQuery           // Search/filter capability
```

**Data Flow:**
```
Component State
    ↓
useAarogyaData Hook
    ↓
Context API (AarogyaContext)
    ↓
Backend API Calls
    ↓
Flask Routes (/beds, /wards, /admissions)
    ↓
SQLite Database
```

---

### 2.3 Backend API Routes

#### **Beds API** (`/beds`)
**File:** `backend/routes/beds.py`

**GET /beds**
```
Request: None
Response: 
[
  {
    "id": 1,
    "bed_number": "101",
    "status": "Available",
    "ward_id": 1,
    "ward_name": "7 South",
    "type": "General"
  },
  ...
]
```

**POST /beds**
```
Request:
{
  "bed_number": "102",
  "status": "Available",
  "ward_id": 1
}
Response:
{
  "id": 2,
  "bed_number": "102",
  "status": "Available",
  "ward_id": 1
}
```

**PUT /beds/{id}**
```
Request:
{
  "status": "Occupied"
}
Response:
{
  "id": 1,
  "bed_number": "101",
  "status": "Occupied",
  ...
}
```

**DELETE /beds/{id}**
```
Response: Success message
```

#### **Admissions API** (`/admissions`)
**File:** `backend/routes/admissions.py`

**GET /admissions**
```
Response:
[
  {
    "id": 1,
    "patient_id": 5,
    "patient_name": "Mary Johnson",
    "bed_id": 1,
    "bed_number": "101",
    "status": "Active",
    "admission_date": "2024-04-14T10:30:00"
  },
  ...
]
```

**POST /admissions**
```
Request:
{
  "patient_id": 5,
  "bed_id": 1
}
Response:
{
  "id": 1,
  "patient_id": 5,
  "bed_id": 1,
  "status": "Active",
  "admission_date": "2024-04-14T10:30:00"
}
```

---

### 2.4 Database Schema

#### **Beds Table**
```sql
CREATE TABLE beds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bed_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Available',
  ward_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(ward_id) REFERENCES wards(id)
);
```

**Fields:**
- `id` - Unique bed identifier
- `bed_number` - Display number (e.g., "101", "ICU-5")
- `status` - Current state (Available/Occupied/Maintenance/Reserved)
- `ward_id` - Associated ward
- `created_at` - Record creation timestamp
- `updated_at` - Last modification timestamp

#### **Wards Table**
```sql
CREATE TABLE wards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  capacity INTEGER,
  current_occupancy INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Ward identifier
- `name` - Ward name (e.g., "7 South", "ICU")
- `type` - Ward type (General, ICU, Emergency, etc.)
- `capacity` - Total beds in ward
- `current_occupancy` - Currently occupied beds

#### **Admissions Table**
```sql
CREATE TABLE admissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  bed_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  admission_date DATETIME NOT NULL,
  discharge_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(patient_id) REFERENCES patients(id),
  FOREIGN KEY(bed_id) REFERENCES beds(id)
);
```

**Fields:**
- `id` - Admission record ID
- `patient_id` - Patient reference
- `bed_id` - Allocated bed
- `status` - Admission status (Active/Discharged/Transferred)
- `admission_date` - Check-in timestamp
- `discharge_date` - Check-out timestamp

#### **Patients Table**
```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(10),
  contact VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Technical Implementation

### 3.1 Bed Status Lifecycle

```
┌─────────────┐
│ Available   │ ← Initial state
└──────┬──────┘
       │ (Admission)
       ↓
┌──────────────┐
│ Occupied     │ ← Patient assigned
└──────┬───────┘
       │ (Patient discharged)
       ↓
┌──────────────┐
│ Available    │ ← After cleaning/prep
└──────┬───────┘
       │ (Maintenance needed)
       ↓
┌──────────────┐
│ Maintenance  │ ← Under repair/cleaning
└──────┬───────┘
       │ (Maintenance complete)
       ↓
┌─────────────┐
│ Available   │
└─────────────┘
```

### 3.2 Admission Workflow

```
1. PENDING STATE
   Patient arrives at ED
   → Enters admission queue
   → Status: "Waiting for Bed"

2. BED SELECTION
   Admin reviews pending admissions
   → Selects appropriate ward/bed
   → Checks bed availability
   → Confirms allocation

3. ALLOCATION
   System processes allocation:
   → Creates admission record
   → Updates bed status → "Occupied"
   → Sets admission timestamp
   → Notifies relevant staff

4. ACTIVE ADMISSION
   Patient assigned to bed
   → Bed shows as "Occupied"
   → Admission record active
   → Medical staff notified

5. DISCHARGE
   Patient ready for discharge
   → Admission status → "Discharged"
   → Bed status → "Available" (after cleaning)
   → Discharge timestamp recorded

6. BED RECYCLING
   Bed available for next admission
   → Returns to "Available" state
   → Can be allocated again
```

---

## 4. Data Flow & Operations

### 4.1 Real-time Bed Availability Check

```javascript
// Frontend Logic
const checkBedAvailability = async () => {
  // 1. Query backend for current bed status
  const beds = await fetch('/beds').then(r => r.json())
  
  // 2. Filter available beds
  const availableBeds = beds.filter(b => b.status === 'Available')
  
  // 3. Group by ward
  const bedsByWard = groupBy(availableBeds, 'ward_id')
  
  // 4. Update heatmap visualization
  updateHeatmap(bedsByWard)
  
  // 5. Calculate allocation metrics
  const occupancyRate = calculateOccupancy(beds)
  displayMetrics(occupancyRate)
}
```

### 4.2 Bed Allocation Operation

```
Frontend:
1. User selects patient from queue
2. User selects available bed
3. User confirms allocation
   ↓
4. POST /admissions {patient_id, bed_id}
   ↓
Backend:
5. Validate patient exists
6. Validate bed exists
7. Validate bed is available
8. Create admission record
9. UPDATE beds SET status='Occupied' WHERE id=bed_id
10. UPDATE wards SET current_occupancy++ WHERE id=ward_id
11. Commit transaction
    ↓
12. Return admission record
    ↓
Frontend:
13. Update local state
14. Refresh bed availability
15. Remove patient from queue
16. Display success notification
17. Update heatmap visualization
```

### 4.3 Heatmap Data Generation

```javascript
// Transform bed data into heatmap matrix
const generateHeatmapData = (beds, wards) => {
  const heatmap = wards.map(ward => {
    const wardBeds = beds.filter(b => b.ward_id === ward.id)
    return wardBeds.map(bed => {
      if (bed.status === 'Occupied') return 1
      if (bed.status === 'Reserved') return 2
      return 0  // Available
    })
  })
  return heatmap
}

// Result structure for 5 wards × 11 beds:
[
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 7 South
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 7 West
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 6 North
  [0, 1, 1, 1, 2, 1, 1, 1, 1, 2, 0],  // 5 East
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]   // ICUs
]
```

---

## 5. User Workflows

### 5.1 Administrator Workflow

```
1. LOGIN to Bed Allotment Page
   ↓
2. VIEW PENDING ADMISSIONS
   Display queue with:
   - Patient name
   - Source (ED/OPD/Transfer)
   - Waiting time
   - Estimated admission time
   ↓
3. REVIEW HEATMAP
   Observe bed availability across wards
   ↓
4. SELECT PATIENT
   Click on patient in queue
   ↓
5. IDENTIFY SUITABLE BED
   Consider:
   - Ward type suitability
   - Bed availability
   - Patient condition
   ↓
6. ALLOCATE BED
   Click on available bed in heatmap
   System confirms allocation
   ↓
7. CONFIRMATION
   - Admission record created
   - Bed marked occupied
   - Patient removed from queue
   - Success notification displayed
   ↓
8. DOCUMENT
   System auto-logs:
   - Allocation timestamp
   - Allocating admin
   - Patient details
   - Bed assignment
```

### 5.2 Patient Admission Flow

```
PATIENT ARRIVES
    ↓
ED TRIAGE
    ↓
REGISTRATION
    ↓
ENTER ADMISSION QUEUE
    - Status: "Waiting"
    - Waiting time: 0:00
    ↓
ADMIN RECEIVES ALERT
    ↓
REVIEW & APPROVE
    - Check patient condition
    - Allocate suitable bed
    ↓
BED ALLOCATION
    - Update bed status
    - Create admission record
    - Notify ward staff
    ↓
PATIENT TRANSFER TO WARD
    ↓
BEGIN TREATMENT
    - Patient in assigned bed
    - Medical care initiated
    ↓
ONGOING MONITORING
    ↓
DISCHARGE PLANNING
    ↓
PATIENT DISCHARGE
    - Update admission status
    - Free up bed
```

---

## 6. Key Operational Features

### 6.1 Pending Admissions Queue

**Display Format:**
```
NAME              SOURCE  WAIT TIME  EST. ADMISSION TIME
Mary Johnson      ED      2h         2h 5m
James Clark       ED      14h        1h 45m
Patricia White    ED      1h         1h 10m
```

**Logic:**
- Auto-populate from admission records with status="Waiting"
- Sort by wait time (longest first)
- Update timestamps in real-time
- Calculate estimated time based on bed availability

### 6.2 Ward Heatmap

**Visualization:**
```
Wards (Rows):      7 South, 7 West, 6 North, 5 East, ICUs
Beds (Columns):    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11

Color Coding:
● Green  = Occupied bed
◐ Orange = Anticipated/Reserved bed
○ White  = Available bed
```

**Interactivity:**
- Click bed to allocate
- Hover for bed details (bed number, patient name if occupied)
- Color updates in real-time

### 6.3 Occupancy Metrics

**Calculated Metrics:**
```
Total Capacity:        55 beds (5 wards × 11 beds)
Currently Occupied:    47 beds
Available:             8 beds
Occupancy Rate:        85.5%
Critical Beds:         5 (ICU occupied)
```

---

## 7. Advanced Features

### 7.1 Smart Bed Recommendation

```typescript
// Algorithm to recommend best bed for patient
recommendBed(patient: Patient, needsICU: boolean) {
  // 1. Filter by care level
  const candidateBeds = beds.filter(b => {
    if (needsICU) return b.ward_type === 'ICU'
    return b.ward_type !== 'ICU'
  })
  
  // 2. Filter available beds only
  const availableBeds = candidateBeds.filter(
    b => b.status === 'Available'
  )
  
  // 3. Consider proximity to primary ward
  const proximidyScore = calculateProximity(
    availableBeds, 
    patient.preferredWard
  )
  
  // 4. Sort by score
  return availableBeds.sort((a, b) => 
    proximidyScore(b) - proximidyScore(a)
  )[0]
}
```

### 7.2 Batch Allocation

```typescript
// Allocate multiple patients at once
batchAllocateBeds(patients: Patient[]) {
  const allocations = patients.map(patient => {
    const bed = recommendBed(patient, patient.needsICU)
    if (!bed) throw new Error(`No bed available for ${patient.name}`)
    
    return {
      patientId: patient.id,
      bedId: bed.id,
      status: 'Active'
    }
  })
  
  // Atomic transaction
  return submitAllocations(allocations)
}
```

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

**1. Caching:**
- Cache bed availability for 30 seconds
- Invalidate on allocation/discharge
- Reduce database queries

**2. Pagination:**
- Load pending admissions in batches
- Implement virtual scrolling for large queues
- Lazy-load patient details

**3. Real-time Updates:**
- WebSocket connection for live bed updates
- Server-sent events for admission notifications
- Minimal API polling

**4. Database Indexing:**
```sql
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_beds_ward ON beds(ward_id);
CREATE INDEX idx_admissions_patient ON admissions(patient_id);
CREATE INDEX idx_admissions_status ON admissions(status);
```

---

## 9. Error Handling

### 9.1 Common Error Scenarios

```typescript
// Error: Bed already occupied
if (bed.status !== 'Available') {
  throw new AllocationError(`Bed ${bed.bed_number} is not available`)
}

// Error: Patient already admitted
if (getActiveAdmission(patientId)) {
  throw new AllocationError(`Patient already has active admission`)
}

// Error: Invalid ward type
if (!isValidWardType(wardId)) {
  throw new AllocationError(`Invalid ward ID`)
}

// Error: Capacity exceeded
if (ward.currentOccupancy >= ward.capacity) {
  throw new AllocationError(`Ward at maximum capacity`)
}

// Handle and notify user
catch (error) {
  toast.error(error.message)
  rollbackTransaction()
}
```

---

## 10. Security Measures

**1. Access Control:**
- Only authorized staff can allocate beds
- Role-based permissions (Admin, Ward Manager, etc.)

**2. Data Validation:**
- Server-side validation of all inputs
- Type checking with TypeScript
- Parameterized SQL queries

**3. Audit Logging:**
- Log all bed allocations
- Track modification history
- User accountability

**4. Transaction Safety:**
- ACID compliance for bed allocation
- Rollback on errors
- No partial allocations

---

## 11. Integration Points

### 11.1 With Other Modules

**Emergency Command Center:**
- Reserve beds for critical cases
- Priority allocation for ICU

**Billing System:**
- Charge patient based on ward type
- Track bed-associated costs

**Staff Management:**
- Notify ward staff of new admissions
- Assign care teams

**EMR System:**
- Link medical records to bed assignment
- Track patient location

---

## 12. Future Enhancements

### Planned Features

1. **AI-Powered Optimization**
   - Predict discharge times
   - Optimize bed allocation algorithmically
   - Reduce patient wait times

2. **Mobile App Integration**
   - Mobile-friendly bed management
   - Push notifications
   - On-the-go allocation

3. **Advanced Analytics**
   - Bed utilization reports
   - Peak hour predictions
   - Trend analysis

4. **Multi-Hospital Support**
   - Cross-hospital bed transfers
   - Centralized management
   - Resource sharing

5. **IoT Integration**
   - Smart bed sensors
   - Real-time occupancy detection
   - Automated status updates

6. **ML-Based Predictions**
   - Predict patient length of stay
   - Forecast bed availability
   - Seasonal demand analysis

---

## 13. Monitoring & Metrics

### Key Performance Indicators (KPIs)

```
1. Average Wait Time
   Target: < 30 minutes
   Current: Varies by ED volume

2. Bed Utilization Rate
   Target: 80-85%
   Current: Track and report

3. Allocation Error Rate
   Target: < 0.1%
   Current: Monitor transactions

4. System Response Time
   Target: < 500ms
   Current: Monitor API latency

5. Patient Satisfaction
   Target: > 90%
   Current: Survey feedback
```

---

## 14. Testing Strategy

### 14.1 Unit Tests
```typescript
// Test bed availability check
test('Should identify available beds correctly', () => {
  const beds = [
    { id: 1, status: 'Available' },
    { id: 2, status: 'Occupied' }
  ]
  expect(getAvailableBeds(beds)).toHaveLength(1)
})

// Test allocation logic
test('Should allocate bed and update status', () => {
  const result = allocateBed(patient, bed)
  expect(result.status).toBe('Active')
  expect(bed.status).toBe('Occupied')
})
```

### 14.2 Integration Tests
- Test bed allocation with database
- Test API endpoints
- Test state management
- Test real-time updates

### 14.3 E2E Tests
- Test complete admission workflow
- Test heatmap visualization
- Test error handling
- Test performance under load

---

## Conclusion

The Bed Allotment System is a crucial component that ensures efficient hospital operations. By combining real-time data, intelligent algorithms, and user-friendly interfaces, it optimizes the patient admission process and maximizes bed utilization.

**Key Takeaways:**
- 🎯 Streamlines patient admission workflow
- 📊 Provides real-time bed availability visualization
- ⚡ Reduces patient wait times
- 🔒 Maintains data integrity and security
- 📈 Enables data-driven decision making

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Complete Documentation
