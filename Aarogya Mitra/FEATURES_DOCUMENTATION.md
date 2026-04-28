# Aarogya Mitra - Hospital Management System
## Complete Features Documentation

---

## Overview

**Aarogya Mitra** is a comprehensive Hospital Management System (HMS) built with:
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Framer Motion
- **Backend:** Python Flask, SQLite
- **AI Integration:** Google Generative AI (Gemini)
- **Mapping:** Google Maps API
- **Firebase:** Integration for backend services

---

## 🏥 Frontend Features

### 1. **HMS Dashboard**
**Location:** `src/pages/HMSDashboard.tsx`

The main command center for hospital operations with real-time monitoring capabilities.

#### Key Components:
- **Real-time Statistics Panel**
  - Total Hospital Capacity with availability count
  - Critical Care (ICU) bed availability
  - Staff Personnel count with standby status
  - System Load monitoring (real-time metrics)

- **Bed Management System**
  - View all beds across different ward types
  - Filter beds by type (ICU, General, Emergency, etc.)
  - Add new beds dynamically
  - Update bed status (Available/Occupied/Maintenance)
  - Delete beds from the system
  - Visual bed status indicators with color coding

- **Ward Management**
  - Add new hospital wards
  - Modify ward information
  - Delete wards from system
  - Track ward capacity

- **Tabbed Interface**
  - Overview Tab: Quick statistics and alerts
  - Beds Tab: Detailed bed management interface
  - Equipment Tab: Equipment status and tracking

- **Interactive Charts**
  - Area charts showing trend data
  - Real-time capacity utilization graphs
  - Historical data visualization

**Data Integration:**
- Connects to backend via `useAarogyaData()` hook
- Real-time updates using React state management
- Toast notifications for user feedback

---

### 2. **Bed Allotment Management**
**Location:** `src/pages/BedAllotment.tsx`

Specialized interface for managing patient admissions and bed allocations.

#### Key Features:
- **Pending Admissions Queue**
  - Display patients waiting for admission
  - Shows source (ED - Emergency Department)
  - Waiting time and estimated admission time
  - Quick-action buttons for admission approval

- **Ward Heatmap Visualization**
  - Color-coded bed availability matrix
  - Shows occupancy status across all wards:
    - 7 South
    - 7 West
    - 6 North
    - 5 East
    - ICUs

- **Heatmap Status Indicators**
  - **Green:** Occupied beds
  - **Orange:** Anticipated/Reserved beds
  - **White/Empty:** Available beds

- **Hospital Header**
  - Hospital branding
  - Navigation controls
  - Notification bell for alerts
  - User profile access
  - Dashboard navigation

- **Quick Actions**
  - Admit patients from queue
  - Allocate specific beds
  - View ward details
  - Manage transfers

**User Interface:**
- Modern, responsive design
- Real-time updates
- Intuitive heatmap for quick visualization
- Mobile-friendly layout

---

### 3. **Billing & Payment System**
**Location:** `src/pages/BillingPage.tsx`

Comprehensive financial transaction management for patient billing.

#### Key Features:
- **Transaction Dashboard**
  - View all financial transactions
  - Receipt ID tracking (REC-XXXXX format)
  - Case reference linking
  - Transaction date and timestamp
  - Payment amount display
  - Real-time status indicators

- **Transaction Status Tracking**
  - **Success:** Completed payments (Green)
  - **Pending:** Awaiting confirmation (Yellow)
  - **Failed:** Transaction issues (Red)

- **Payment Methods Supported**
  - GPay UPI
  - Direct UPI Transfer
  - Secure Stripe Payment
  - Card Payments
  - Digital Wallets

- **Payment Processing**
  - Initiate new payments
  - Process payment dialog with:
    - QR Code generation
    - Secure payment gateway
    - Biometric authentication
    - Smartphone payment options
  - Real-time payment processing animation
  - Success confirmation display

- **Receipt Generation**
  - Digital receipt creation
  - PDF download capability
  - Receipt tracking system
  - Case-to-payment linking

- **Security Features**
  - Fingerprint authentication
  - Secure payment gateway integration
  - Shield verification indicators
  - Encrypted transaction data

- **Transaction Management**
  - Add new transactions
  - View transaction history
  - Filter and search capabilities
  - Transaction status updates
  - Analytics on payment methods

**Notifications:**
- Toast notifications for transaction confirmation
- Payment status alerts
- Error notifications

---

### 4. **Command Center - Emergency Management**
**Location:** `src/pages/CommandCenter.tsx`

AI-powered emergency response and case management system.

#### Key Features:
- **Emergency Case Queue**
  - Display incoming emergency cases
  - Real-time case updates
  - Case ID tracking
  - Patient identification
  - Symptom logging

- **Priority Classification System**
  - **Critical:** Highest priority (Red color)
  - **Moderate:** Medium priority (Orange color)
  - **Low:** Lower priority (Green color)
  - Visual color coding for quick identification

- **AI-Powered Triage Intelligence**
  - Integration with Google Generative AI (Gemini)
  - Automated triage recommendations
  - Symptom analysis
  - Medical insights generation
  - Real-time AI processing animation

- **Case Details Display**
  - Patient name and demographics
  - Symptom listing
  - Current case status
  - Assigned doctor information
  - Waiting time calculation
  - Case creation timestamp

- **Doctor Assignment System**
  - Auto-assign doctors to cases
  - Real-time assignment confirmation
  - Doctor expertise matching
  - Assignment status tracking

- **Interactive Case Management**
  - Select case for detailed view
  - View AI insights for selected case
  - Update case status
  - Assign medical personnel
  - Track case progress

- **Location-Based Services**
  - Google Maps integration
  - Real-time location mapping
  - Ambulance dispatch visualization
  - Patient location tracking

- **Search and Filter**
  - Search by patient name
  - Filter by symptoms
  - Search by case ID
  - Quick lookup functionality

- **Status Indicators**
  - New cases
  - Assigned cases
  - Completed cases
  - At-risk indicators

**Performance Monitoring:**
- Response time tracking
- AI processing latency display
- Case resolution metrics

---

### 5. **Analytics Dashboard**
**Location:** `src/pages/AnalyticsPage.tsx`

System-wide analytics and performance monitoring.

#### Key Features:
- **System Health Metrics**
  - Cloud Synchronicity: 99.98% uptime
  - AI Inference Latency: 42ms response time
  - Active Signals: 1,204 concurrent cases
  - Critical Thresholds: 24 active alerts

- **Severity Distribution Analysis**
  - Pie chart showing case severity breakdown:
    - Critical Cases: 15% (Red)
    - Moderate Cases: 45% (Orange)
    - Low Priority Cases: 40% (Green)

- **Temporal Analytics**
  - 24-hour case volume timeline
  - Hourly case distribution graph
  - Peak hour identification
  - Trend patterns across the day

- **Performance Indicators**
  - Server status monitoring
  - Network connectivity display
  - AI model performance
  - Database synchronization status

- **Real-time Metrics**
  - Active patient signals/cases
  - System load percentage
  - Resource utilization
  - Bed occupancy rates

- **Visual Representations**
  - Bar charts for timeline data
  - Pie charts for severity distribution
  - Trend graphs
  - Status indicators with color coding

- **Alert System**
  - Warning indicators for thresholds exceeded
  - Critical alerts for system issues
  - Notification badges
  - Performance warnings

**Data Display:**
- Responsive chart layouts
- Real-time data updates
- Interactive chart elements
- Export-ready analytics

---

### 6. **Staff Management Page**
**Location:** `src/pages/StaffPage.tsx`

Healthcare worker scheduling and management.

#### Features (Ready for Implementation):
- Staff roster management
- Shift scheduling
- Department assignment
- Specialization tracking
- Availability status
- Performance metrics
- Contact information

---

### 7. **Base Dashboard**
**Location:** `src/pages/BaseDashboard.tsx`

Foundation dashboard providing core navigation and system overview.

#### Features:
- Navigation hub
- Quick access to main features
- System status overview
- User access control

---

## 🖥️ Backend API Features

### 1. **Patient Management** (`/patients`)
**File:** `backend/routes/patients.py`

Patient registration and profile management.

#### Endpoints:
- **GET `/patients`** - Retrieve all patients
  - Returns list of patient objects
  - Fields: id, name, age, gender

- **POST `/patients`** - Create new patient
  - Required: `name` (string)
  - Optional: `age` (integer), `gender` (string)
  - Returns: Created patient object with ID

#### Use Cases:
- Register new patients
- Maintain patient database
- Access patient demographics
- Patient records retrieval

---

### 2. **Admission Management** (`/admissions`)
**File:** `backend/routes/admissions.py`

Hospital admission and bed assignment system.

#### Endpoints:
- **GET `/admissions`** - Retrieve all active admissions
  - Returns admission records with patient and bed details
  - Includes patient name and bed number
  - Joins: patients table, beds table

- **POST `/admissions`** - Create admission record
  - Required: `patient_id`, `bed_id`
  - Sets status to 'Active'
  - Automatically timestamps admission date
  - Updates bed status to 'Occupied'
  - Transaction-safe operations

#### Features:
- Link patients to specific beds
- Track admission date/time
- Manage admission status
- Automatic bed allocation
- Patient-Bed relationship management

#### Use Cases:
- Admit patients to hospital
- Assign beds upon admission
- Track active admissions
- Generate admission reports

---

### 3. **Bed Management** (`/beds`)
**File:** `backend/routes/beds.py`

Hospital bed inventory and status tracking.

#### Endpoints:
- **GET `/beds`** - Retrieve all beds
  - Returns bed details with ward information
  - Includes: bed_id, bed_number, status, ward_name, ward_type
  - Joins ward information for context

- **POST `/beds`** - Create new bed
  - Required: `bed_number`, `ward_id`
  - Optional: `status` (default: 'Available')
  - Returns: Created bed object with ID

- **PUT `/beds/<id>`** - Update bed status
  - Updates bed status (Available/Occupied/Maintenance)
  - Used for status transitions

#### Bed Status Types:
- **Available:** Ready for patient admission
- **Occupied:** Currently housing a patient
- **Maintenance:** Under maintenance/cleaning
- **Reserved:** Allocated but not yet occupied

#### Use Cases:
- Track bed availability
- Manage bed inventory
- Update occupancy status
- Monitor bed utilization
- Plan maintenance schedules

---

### 4. **Ward Management** (`/wards`)
**File:** `backend/routes/wards.py`

Hospital department and ward organization.

#### Features:
- Ward creation and configuration
- Department classification
- Ward status tracking
- Capacity management
- Ward-to-bed relationships

#### Ward Types:
- General Wards
- ICU (Intensive Care Unit)
- Emergency Department
- Pediatric Ward
- Surgical Ward

---

### 5. **Staff Management** (`/staff`)
**File:** `backend/routes/staff.py`

Healthcare worker database and scheduling.

#### Features (Ready for Implementation):
- Staff registration
- Department assignment
- Shift management
- Specialization tracking
- Availability status
- Contact information

---

### 6. **Appointment System** (`/appointments`)
**File:** `backend/routes/appointments.py`

Patient appointment scheduling and management.

#### Features (Framework Ready):
- Schedule appointments
- Manage appointment slots
- Doctor assignment
- Department routing
- Confirmation notifications
- Reminder system

---

### 7. **Billing System** (`/billing`)
**File:** `backend/routes/billing.py`

Financial transaction management.

#### Features (Ready for Implementation):
- Invoice generation
- Payment processing
- Receipt management
- Transaction tracking
- Financial reporting
- Insurance handling

---

### 8. **Electronic Medical Records (EMR)** (`/emr`)
**File:** `backend/routes/emr.py`

Comprehensive patient medical history.

#### Features (Ready for Implementation):
- Medical history storage
- Diagnosis tracking
- Prescription management
- Test result storage
- Medical notes
- Patient timeline

---

### 9. **Laboratory Tests** (`/lab-tests`)
**File:** `backend/routes/lab.py`

Lab test ordering and result management.

#### Features (Ready for Implementation):
- Test ordering system
- Sample tracking
- Result upload
- Test categorization
- Lab report generation
- Result notifications

---

### 10. **Pharmacy Management** (`/medicines`)
**File:** `backend/routes/pharmacy.py`

Medicine inventory and dispensing system.

#### Features (Ready for Implementation):
- Medicine inventory tracking
- Prescription fulfillment
- Stock management
- Medicine information database
- Expiry tracking
- Dispensing records

---

### 11. **Floor Management** (`/floors`)
**File:** `backend/routes/floors.py`

Hospital building structure organization.

#### Features:
- Floor-level organization
- Ward grouping
- Bed distribution
- Physical layout tracking
- Capacity management

---

## 📱 Frontend Components

### 1. **Sidebar Component**
**Location:** `src/components/Sidebar.tsx`

Main navigation sidebar with feature access.

#### Features:
- Feature menu navigation
- Dashboard links
- Collapsible menu
- Active state indication
- Quick shortcuts

---

### 2. **Topbar Component**
**Location:** `src/components/Topbar.tsx`

Top navigation bar with system controls.

#### Features:
- Hospital branding
- Search functionality
- System status display
- User profile access
- Settings menu
- Notification alerts

---

### 3. **Google Maps Integration**
**Location:** `src/components/GoogleMapsView.tsx`

Real-time location tracking and mapping.

#### Features:
- Patient location display
- Ambulance tracking
- Hospital location mapping
- Route optimization
- Geographic data visualization

---

## 🔧 Core Utilities & Hooks

### 1. **Custom Hook: useAarogyaData**
**Location:** `src/hooks/useAarogyaData.ts`

Central data management hook for hospital operations.

#### Provides:
- Patient data management
- Bed information and updates
- Ward data and operations
- Case management for emergencies
- Search query handling
- Data CRUD operations

---

### 2. **Firebase Integration**
**Location:** `src/lib/firebase.ts`

Backend services and real-time database.

#### Features:
- Authentication
- Realtime database sync
- Cloud functions
- Storage management

---

### 3. **Utility Functions**
**Location:** `src/lib/utils.ts`

Helper functions for common operations.

#### Includes:
- Date/time formatting
- Data validation
- String manipulation
- CSS class utilities (cn function)

---

### 4. **Type Definitions**
**Location:** `src/types/index.ts`

TypeScript interfaces for type safety.

#### Defined Types:
- Patient interface
- Admission interface
- Bed interface
- Ward interface
- EmergencyCase interface
- Priority type
- Various domain-specific types

---

## 🤖 AI Integration

### 1. **Gemini Service**
**Location:** `src/services/geminiService.ts`

Google Generative AI integration for medical insights.

#### Features:
- **Triage Intelligence**
  - Analyze emergency symptoms
  - Generate medical insights
  - Suggest priority levels
  - Real-time AI processing

#### Function: `getTriageInsights(symptoms, priority)`
- Input: Symptoms array, priority level
- Output: AI-generated medical recommendations
- Used in Command Center for emergency case analysis

---

## 📊 Technology Stack

### Frontend
- **React 19.2.4** - UI framework
- **TypeScript ~6.0.2** - Type safety
- **Vite 8.0.4** - Build tool
- **TailwindCSS 4.2.2** - Styling
- **Framer Motion 12.38.0** - Animations
- **Recharts 3.8.1** - Data visualization
- **Lucide React 1.8.0** - Icons
- **React Router 7.14.1** - Navigation
- **Firebase 12.12.0** - Firebase services
- **React Hot Toast 2.6.0** - Notifications
- **Google Maps API 2.0.2** - Mapping

### Backend
- **Python Flask** - Web framework
- **SQLite** - Database
- **Flask-CORS** - Cross-origin support
- **Google Generative AI** - AI services

---

## 🗄️ Database Schema

### Key Tables:
1. **patients** - Patient records
2. **wards** - Hospital departments
3. **beds** - Individual hospital beds
4. **admissions** - Patient admission records
5. **staff** - Healthcare workers
6. **appointments** - Medical appointments
7. **billing** - Financial transactions
8. **prescriptions** - Medication orders
9. **lab_tests** - Laboratory tests
10. **medical_history** - Patient medical records

---

## 🔐 Security Features

- CORS enabled for API security
- Type-safe TypeScript throughout
- SQLite with parameterized queries
- Firebase authentication support
- Secure payment gateway integration
- Biometric authentication support

---

## 📈 Key Metrics & Features

### System Monitoring:
- Real-time bed availability
- System load monitoring
- AI inference latency tracking
- Cloud synchronization status
- Critical alert thresholds

### Patient Management:
- Complete admission workflow
- Bed allocation automation
- Emergency case prioritization
- Medical record organization
- Appointment scheduling

### Financial Operations:
- Transaction tracking
- Multiple payment methods
- Receipt generation
- Financial reporting

### Emergency Response:
- AI-powered triage
- Real-time case management
- Doctor assignment
- Location-based services
- Priority-based queuing

---

## 🚀 Key Capabilities

1. **Real-time Monitoring** - Live updates across all modules
2. **AI-Powered Insights** - Gemini AI for medical analysis
3. **Location Services** - Google Maps integration
4. **Payment Processing** - Secure transaction handling
5. **Mobile Responsive** - Works on all devices
6. **Scalable Architecture** - Modular component design
7. **Type Safe** - Full TypeScript coverage
8. **Professional UI** - Modern, accessible design

---

## 📝 Notes

- Some features are framework-ready and require implementation
- Database schema initialized from `schema.sql`
- All routes use Flask blueprints for modularity
- Frontend uses context API for state management
- Real-time updates powered by React hooks

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Active Development
