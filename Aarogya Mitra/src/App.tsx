import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { PlusCircle, X } from 'lucide-react';
import { CommandCenter } from './pages/CommandCenter';
import { HMSDashboard } from './pages/HMSDashboard';
import { BillingPage } from './pages/BillingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BaseDashboard } from './pages/BaseDashboard';
import { StaffPage } from './pages/StaffPage';
import { BedAllotment } from './pages/BedAllotment';
import { AmbulancePage } from './pages/AmbulancePage';
import { PatientsPage } from './pages/PatientsPage';
import { QueueSystem } from './pages/QueueSystem';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { DoctorClinicalHub } from './pages/DoctorClinicalHub';
import { MapView } from './pages/MapView';
import { NotificationsPage } from './pages/NotificationsPage';
import { Toaster, toast } from 'react-hot-toast';
import { useAarogyaData } from './hooks/useAarogyaData';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import type { Priority } from './types';

function App() {
  const { addEmergencyCase, user, setUser } = useAarogyaData();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [admissionForm, setAdmissionForm] = useState({
    name: '',
    symptoms: '',
    priority: 'Moderate' as Priority
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleManualAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionForm.name) return;

    const newCase = {
      patientName: admissionForm.name.toUpperCase(),
      symptoms: admissionForm.symptoms.split(',').map(s => s.trim()).filter(s => s !== ''),
      priority: admissionForm.priority,
      location: { 
        lat: 19.0760, 
        lng: 72.8777,
        address: 'In-Hospital Direct Admission'
      }
    };

    await addEmergencyCase(newCase);
    setShowAdmissionModal(false);
    setAdmissionForm({ name: '', symptoms: '', priority: 'Moderate' });
    
    toast.success('PATIENT ADMITTED TO COMMAND FEED', {
      style: {
        background: '#0a0a0a',
        color: '#fff',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        fontSize: '10px',
        fontWeight: '900',
        letterSpacing: '0.1em'
      },
      icon: '📋'
    });
  };
  
  if (!user) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <Toaster position="top-right" />
        <LoginPage onLogin={setUser} />
      </div>
    );
  }

  return (
    <Router>
      <div className={cn(
        "flex min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300",
        isDarkMode ? "dark bg-black text-slate-400" : "bg-slate-50 text-slate-900"
      )}>
        <Sidebar user={user} onLogout={() => setUser(null)} />
        
        <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
          <Topbar onAddCase={() => setShowAdmissionModal(true)} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          
          <div className="flex-1 overflow-y-auto bg-transparent relative">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 🏥 Shared Dashboard */}
                <Route path="/dashboard" element={<BaseDashboard />} />
                
                {/* 🚨 Clinical Only */}
                <Route path="/clinical-hub" element={
                  <ProtectedRoute allowedRoles={['Doctor']}>
                    <DoctorClinicalHub />
                  </ProtectedRoute>
                } />
                
                <Route path="/command-center" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <CommandCenter />
                  </ProtectedRoute>
                } />

                <Route path="/map-view" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <MapView />
                  </ProtectedRoute>
                } />

                <Route path="/notifications" element={
                  <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Receptionist']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                
                {/* 👥 Patient & Front Desk Management */}
                <Route path="/patients" element={
                  <ProtectedRoute allowedRoles={['Receptionist']}>
                    <PatientsPage />
                  </ProtectedRoute>
                } />

                <Route path="/queue" element={
                  <ProtectedRoute allowedRoles={['Receptionist']}>
                    <QueueSystem />
                  </ProtectedRoute>
                } />
                
                <Route path="/appointments" element={
                  <ProtectedRoute allowedRoles={['Receptionist']}>
                    <AppointmentsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/bed-management" element={
                  <ProtectedRoute allowedRoles={['Admin', 'Receptionist']}>
                    <BedAllotment />
                  </ProtectedRoute>
                } />

                <Route path="/ambulance" element={
                  <ProtectedRoute allowedRoles={['Admin', 'Receptionist']}>
                    <AmbulancePage />
                  </ProtectedRoute>
                } />

                {/* 🔐 Admin Exclusive - Infrastructure & Controls */}
                <Route path="/hms" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <HMSDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/staff" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <StaffPage />
                  </ProtectedRoute>
                } />

                {/* 💳 Logistics & Shared Operations */}
                <Route path="/billing" element={
                  <ProtectedRoute allowedRoles={['Admin', 'Receptionist']}>
                    <BillingPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
        
        <AnimatePresence>
          {showAdmissionModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAdmissionModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg glass-panel p-0 overflow-hidden bg-card border-primary/20 shadow-2xl"
              >
                <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3 italic">
                      <PlusCircle className="text-primary" /> System Admission
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Manual node registration for clinical feed</p>
                  </div>
                  <button onClick={() => setShowAdmissionModal(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleManualAdmission} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Patient Identity</label>
                      <input 
                        required
                        value={admissionForm.name}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="ENTER FULL NAME..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Clinical Symptoms (Comma Separated)</label>
                      <textarea 
                        required
                        value={admissionForm.symptoms}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, symptoms: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
                        placeholder="E.G. FEVER, CHEST PAIN, COUGH..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Triage Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Low', 'Moderate', 'Critical'] as const).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setAdmissionForm({ ...admissionForm, priority: p })}
                            className={cn(
                              "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              admissionForm.priority === p 
                                ? (p === 'Critical' ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20" : 
                                   p === 'Moderate' ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" :
                                   "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20")
                                : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowAdmissionModal(false)} className="flex-1 py-4 bg-secondary text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all">Abort Protocol</button>
                    <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Admit to Command Center</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
