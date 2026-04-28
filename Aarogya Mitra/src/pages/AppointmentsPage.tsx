import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Search, 
  User, 
  Filter,
  MoreHorizontal,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useAarogyaData } from '@/hooks/useAarogyaData';

export const AppointmentsPage = () => {
  const { patients } = useAarogyaData();
  const [showBookModal, setShowBookModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const doctors = [
    { id: 'D01', name: 'Dr. Aditi Sharma', specialty: 'Cardiology' },
    { id: 'D02', name: 'Dr. Vivek Kapur', specialty: 'Neurology' },
    { id: 'D03', name: 'Dr. Neha Patel', specialty: 'General Physician' },
    { id: 'D04', name: 'Dr. Rajesh Khanna', specialty: 'Pediatrics' },
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const [appointments, setAppointments] = useState([
    { id: 'APT-1092', patient: 'RAHUL VERMA', doctor: 'Dr. Aditi Sharma', time: '10:30 AM', date: 'TODAY', status: 'Confirmed', type: 'Consultation' },
    { id: 'APT-1093', patient: 'ANANYA IYER', doctor: 'Dr. Neha Patel', time: '11:15 AM', date: 'TODAY', status: 'Pending', type: 'Follow-up' },
    { id: 'APT-1094', patient: 'ADITI RAO', doctor: 'Dr. Vivek Kapur', time: '02:00 PM', date: 'TOMORROW', status: 'Confirmed', type: 'Check-up' },
  ]);

  const [booking, setBooking] = useState({
    patientId: '',
    doctorId: 'D01',
    time: '09:00 AM',
    date: new Date().toISOString().split('T')[0]
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.patientId) return toast.error('Please select a patient');

    // Simulate double booking check
    const isBooked = appointments.some(a => a.doctor === doctors.find(d => d.id === booking.doctorId)?.name && a.time === booking.time && a.date === 'TODAY');
    if (isBooked) {
      return toast.error('Time slot already allocated for this clinician', {
        icon: '⚠️',
        style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }
      });
    }

    const patient = patients.find(p => p.id === booking.patientId) || { name: 'Direct Inquiry' };
    const doctor = doctors.find(d => d.id === booking.doctorId);

    const newApt = {
      id: `APT-${Math.floor(Math.random() * 10000)}`,
      patient: patient.name.toUpperCase(),
      doctor: doctor?.name || 'Assigned Resident',
      time: booking.time,
      date: 'TODAY',
      status: 'Confirmed' as const,
      type: 'Consultation'
    };

    setAppointments([newApt, ...appointments]);
    setShowBookModal(false);
    toast.success('Clinical Slot Reserved', {
      style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
    });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Chronos Scheduler</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Real-time Clinical Appointment Synchronization
          </p>
        </div>
        <button 
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" /> Initialize Booking
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 border-primary/20 bg-primary/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-primary/20 rounded-xl">
                  <Clock className="w-5 h-5 text-primary" />
               </div>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Service Healthy</span>
            </div>
            <h3 className="text-2xl font-black text-foreground tabular-nums">08</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Active Checkins</p>
         </div>

         <div className="glass-panel p-6 border-indigo-500/20 bg-indigo-500/5">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Activity className="w-5 h-5 text-indigo-500" />
               </div>
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinic Load</span>
            </div>
            <h3 className="text-2xl font-black text-foreground tabular-nums">72%</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Resource Utilization</p>
         </div>

         <div className="glass-panel p-0 overflow-hidden flex flex-col justify-center px-6">
            <div className="relative">
               <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <input 
                  type="text" 
                  placeholder="FILTER BY PATIENT / CLINICIAN / UUID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-4 pl-8 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none placeholder:opacity-50"
               />
            </div>
         </div>
      </div>

      <div className="glass-panel border-border/50 shadow-2xl overflow-hidden">
         <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_currentColor]" />
               <h2 className="text-xs font-black text-foreground uppercase tracking-widest">Clinical Sequence Hub</h2>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-r border-border pr-4">Global Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
               <Filter className="w-4 h-4 text-muted-foreground" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-border/50 bg-secondary/10">
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sequence Target</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Medical Clinician</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Allocated Window</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                     <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {appointments.filter(a => a.patient.includes(searchQuery.toUpperCase()) || a.doctor.includes(searchQuery)).map(apt => (
                     <tr key={apt.id} className="border-b border-border/30 hover:bg-secondary/20 transition-all group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="p-2 bg-secondary rounded-xl border border-border shadow-sm group-hover:border-primary/30 transition-all">
                                 <User className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-foreground uppercase tracking-tight">{apt.patient}</div>
                                 <div className="text-[9px] font-black text-primary uppercase tracking-widest opacity-70">{apt.type}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-xs font-bold text-foreground uppercase tracking-tight">{apt.doctor}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <div className="inline-flex flex-col items-center">
                              <span className="text-xs font-black text-foreground tabular-nums">{apt.time}</span>
                              <span className="text-[9px] font-black text-muted-foreground uppercase opacity-50 tracking-widest">{apt.date}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={cn(
                              "px-3 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] border",
                              apt.status === 'Confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                           )}>
                              {apt.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="p-2 hover:bg-secondary rounded-xl transition-all group/btn">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
         {showBookModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookModal(false)} className="absolute inset-0 bg-background/80" />
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-lg glass-panel p-0 overflow-hidden shadow-3xl border-primary/20 bg-card">
                  <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                     <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3 italic">
                        <Calendar className="text-primary" /> Reserve Clinical Slot
                     </h2>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Synchronization of patient-clinician window</p>
                  </div>

                  <form onSubmit={handleBook} className="p-8 space-y-6">
                     <div className="space-y-5">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Target Patient Profile</label>
                           <select 
                             value={booking.patientId}
                             onChange={(e) => setBooking({...booking, patientId: e.target.value})}
                             className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                           >
                              <option value="">Select Witnessed Member</option>
                              {patients.map(p => (
                                 <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
                              ))}
                           </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Primary Clinician</label>
                              <select 
                                value={booking.doctorId}
                                onChange={(e) => setBooking({...booking, doctorId: e.target.value})}
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50"
                              >
                                 {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Window Selection</label>
                              <select 
                                value={booking.time}
                                onChange={(e) => setBooking({...booking, time: e.target.value})}
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50"
                              >
                                 {timeSlots.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/20 flex items-start gap-4">
                        <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed">
                           Aarogya IQ: Double-booking prevention protocol is currently ACTIVE. System will auto-reject conflicting clinical signals.
                        </p>
                     </div>

                     <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={() => setShowBookModal(false)} className="flex-1 px-6 py-4 bg-secondary text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all">Abort</button>
                        <button type="submit" className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Reserve Slot</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};
