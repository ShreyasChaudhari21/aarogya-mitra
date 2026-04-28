import { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Stethoscope, 
  ChevronRight, 
  Activity,
  BrainCircuit,
  Zap,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Bed,
  Truck
} from 'lucide-react';
import type { EmergencyCase, Priority } from '../types/index';
import { cn, formatTimestamp } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { GoogleMapsView } from '@/components/GoogleMapsView';
import { getTriageInsights } from '@/services/geminiService';
import { toast } from 'react-hot-toast';

export const CommandCenter = () => {
  const { cases, staff, updateCaseStatus, searchQuery, detailedBeds, assignBedToPatient, createNotification, ambulances, updateAmbulanceStatus } = useAarogyaData();
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>("");
  
  const availableBeds = detailedBeds.filter(b => b.status === 'Available');
  const availableAmbulances = ambulances.filter(a => a.status === 'Available');

  const filteredCases = cases.filter(c => 
    (c.status !== 'Cancelled' && c.status !== 'Completed') &&
    ((c.patientName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (c.symptoms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) || false) ||
    (c.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
  );

  // Get unique doctors from staff
  const doctors = Array.from(new Map(staff
    .filter(s => s.role === 'Doctor' || s.role === 'Doctor (HS)')
    .map(s => [s.name, s])
  ).values());

  useEffect(() => {
    if (selectedCase) {
      setAnalyzing(true);
      getTriageInsights(selectedCase.symptoms, selectedCase.priority).then(insight => {
        setAiInsight(insight);
        setAnalyzing(false);
      });
      // Reset selected items when case changes
      setSelectedDoctorName("");
      setSelectedBedId("");
      setSelectedAmbulanceId("");
    }
  }, [selectedCase?.id]);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Critical': return 'status-critical';
      case 'Moderate': return 'status-moderate';
      case 'Low': return 'status-low';
      default: return 'bg-slate-500';
    }
  };

  const assignResources = async (caseId: string) => {
    if (!selectedDoctorName) {
      toast.error("Please select a physician first");
      return;
    }

    try {
      // 1. Update Case Status & Doctor
      await updateCaseStatus(caseId, { 
        status: 'Assigned', 
        assignedDoctor: selectedDoctorName,
        ambulanceId: selectedAmbulanceId || null
      });

      // 2. Assign Bed if selected
      if (selectedBedId) {
        await assignBedToPatient(caseId, selectedBedId);
      }

      // Dispatch Ambulance if selected
      if (selectedAmbulanceId) {
        updateAmbulanceStatus(selectedAmbulanceId, 'On Route');
        await createNotification({
          role: 'Admin',
          title: 'Ambulance Dispatched',
          message: `Ambulance ${selectedAmbulanceId} dispatched for ${selectedCase?.patientName}`,
          priority: selectedCase?.priority || 'High',
          type: 'info'
        });
      }

      // 3. Notify Doctor
      await createNotification({
        role: 'Doctor',
        title: 'New Patient Assigned',
        message: `${selectedCase?.patientName} has been assigned to your Clinical Hub.`,
        priority: selectedCase?.priority || 'Medium',
        type: 'info'
      });

      if (selectedCase?.id === caseId) {
        setSelectedCase(prev => prev ? { 
          ...prev, 
          status: 'Assigned', 
          assignedDoctor: selectedDoctorName,
          bed_details: selectedBedId ? { bedNumber: detailedBeds.find(b => b.id === selectedBedId)?.bedNumber } : null,
          ambulanceId: selectedAmbulanceId || null
        } : null);
      }
      
      toast.success(`Resources Synchronized for ${selectedCase?.patientName}`);
    } catch (err) {
      toast.error("Resource synchronization failed");
    }
  };

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing patient data export...',
        success: 'Case details exported successfully as PDF',
        error: 'Export failed. Please try again.',
      },
      {
        style: {
          borderRadius: '12px',
          background: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        }
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 p-1 overflow-hidden">
      {/* Live Feed Hub */}
      <div className="flex-[0.35] flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <h2 className="text-sm font-bold text-foreground tracking-tight">Emergency Feed</h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
            {filteredCases.length} Results Found
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className={cn(
                  "p-4 glass-panel cursor-pointer transition-all duration-300 relative overflow-hidden group border-l-0",
                  selectedCase?.id === item.id ? "bg-white ring-2 ring-primary shadow-2xl shadow-primary/10" : "hover:bg-white/80 border-transparent shadow-sm hover:shadow-md"
                )}
              >
                {/* Severity Indicator Bar */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  item.priority === 'Critical' ? "bg-red-500" : 
                  item.priority === 'Moderate' ? "bg-yellow-500" : "bg-green-500"
                )} />

                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-bold uppercase", getPriorityColor(item.priority))}>
                      {item.priority}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">ID: {item.id?.substr(0, 8) || 'N/A'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate mt-2">
                  {item.patientName}
                </h3>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.symptoms.slice(0, 3).map(s => (
                    <span key={s} className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
                      {s}
                    </span>
                  ))}
                  {item.symptoms.length > 3 && <span className="text-xs text-muted-foreground/60">+{item.symptoms.length - 3} more</span>}
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.status === 'Assigned' ? (
                      <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wide">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.assignedDoctor}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wide">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting Doctor</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Deep Intelligence Panel */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {selectedCase ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 glass-panel p-8 overflow-y-auto custom-scrollbar bg-white/50 relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="flex gap-2">
                <button 
                  onClick={handleExport}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  title="Export Case Details"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] border border-primary/20 flex items-center justify-center shadow-inner">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">{selectedCase.patientName}</h2>
                  <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", getPriorityColor(selectedCase.priority))}>
                    {selectedCase.priority} Priority
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium tracking-tight flex items-center gap-2">
                  Patient ID: {selectedCase.id || 'N/A'} <span className="w-1 h-1 rounded-full bg-muted-foreground/30" /> Admission: {selectedCase.timestamp ? new Date(selectedCase.timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <section className="p-6 rounded-3xl bg-white border border-border shadow-sm">
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Diagnostic Case File</h4>
                   <div className="grid grid-cols-2 gap-3">
                      {selectedCase.symptoms.map(s => (
                        <div key={s} className="bg-secondary px-4 py-3 rounded-2xl border border-border flex items-center gap-3 group hover:border-primary/30 transition-all">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-[13px] font-semibold text-foreground tracking-tight">{s}</span>
                        </div>
                      ))}
                   </div>
                </section>

                <section className={cn(
                  "p-6 rounded-3xl border transition-all duration-500 shadow-sm",
                  analyzing ? "bg-primary/5 border-primary/20" : "bg-primary/[0.03] border-primary/10"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className={cn("w-6 h-6 text-primary", analyzing && "animate-pulse")} />
                      <h4 className="text-xs font-extrabold text-primary uppercase tracking-widest">Medical Analysis AI</h4>
                    </div>
                    {analyzing && <div className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase">Analyzing Profile...</div>}
                  </div>
                  <div className="relative">
                    <p className="text-sm text-foreground/80 leading-loose font-medium italic">
                      "{aiInsight || "Assessing medical history and current symptoms for optimal triage..."}"
                    </p>
                    <div className="mt-6 flex gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-none mb-2">Confidence Check</span>
                        <span className="text-sm font-bold text-primary">98.4% Match</span>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-none mb-2">Processing Node</span>
                        <span className="text-sm font-bold text-muted-foreground">Active Sync</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-6 rounded-3xl bg-white border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Physician Selection</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                      {doctors.length} PERSONNEL
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {doctors.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoctorName(doc.name)}
                        className={cn(
                          "px-4 py-3 rounded-2xl border text-left transition-all relative overflow-hidden group",
                          selectedDoctorName === doc.name 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-secondary border-border hover:border-primary/30 text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs",
                            selectedDoctorName === doc.name ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          )}>
                            {doc.name.split(' ')[1]?.[0] || 'D'}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold tracking-tight">{doc.name}</p>
                            <p className={cn("text-[10px] font-medium opacity-70 uppercase tracking-wider", selectedDoctorName === doc.name ? "text-white" : "text-muted-foreground")}>
                              {doc.role.replace('Doctor', 'Phy.')}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="p-6 rounded-3xl bg-white border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bed Allocation</h4>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                      {availableBeds.length} AVAILABLE
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableBeds.map(bed => (
                      <button
                        key={bed.id}
                        onClick={() => setSelectedBedId(bed.id)}
                        className={cn(
                          "py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                          selectedBedId === bed.id 
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-secondary border-border hover:border-emerald-500/30 text-foreground"
                        )}
                      >
                        <Bed className="w-4 h-4" />
                        <span className="text-[10px] font-black">{bed.bedNumber}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="p-6 rounded-3xl bg-white border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ambulance Dispatch</h4>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">
                      {availableAmbulances.length} AVAILABLE
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableAmbulances.map(amb => (
                      <button
                        key={amb.id}
                        onClick={() => setSelectedAmbulanceId(amb.id)}
                        className={cn(
                          "py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                          selectedAmbulanceId === amb.id 
                            ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                            : "bg-secondary border-border hover:border-blue-500/30 text-foreground"
                        )}
                      >
                        <Truck className="w-4 h-4" />
                        <span className="text-[10px] font-black">{amb.id}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-2 flex gap-4">
                  {selectedCase.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => assignResources(selectedCase.id)}
                        disabled={!selectedDoctorName}
                        className={cn(
                          "flex-[2] h-16 font-bold text-sm tracking-tight rounded-[1.25rem] transition-all transform flex items-center justify-center gap-3",
                          selectedDoctorName 
                            ? "bg-foreground text-background hover:bg-primary hover:text-white hover:-translate-y-1 active:scale-95 shadow-2xl shadow-foreground/10"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                        )}
                      >
                        <Stethoscope className="w-5 h-5" />
                        {selectedDoctorName ? ((selectedBedId || selectedAmbulanceId) ? `Assign Doc & Resources` : `Assign ${selectedDoctorName}`) : 'Select a Physician'}
                      </button>
                      <button 
                        onClick={() => {
                          updateCaseStatus(selectedCase.id, { status: 'Cancelled' });
                          setSelectedCase(null);
                          toast.success("Emergency Signal Rejected");
                        }}
                        className="flex-1 h-16 bg-red-50 text-red-600 border border-red-100 font-bold text-sm tracking-tight rounded-[1.25rem] hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                      >
                        Reject Signal
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-sm tracking-tight rounded-[1.25rem] flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-5 h-5" />
                      {selectedCase.status === 'Cancelled' ? 'Signal Rejected' : `Assigned to ${selectedCase.assignedDoctor}`}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 space-y-6">
                <section className="bg-white rounded-3xl p-6 border border-border shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Tracking</h4>
                      <Navigation className="w-4 h-4 text-primary animate-pulse" />
                   </div>
                   <div className="h-[220px] rounded-2xl overflow-hidden border border-border">
                      <GoogleMapsView location={selectedCase.location} />
                   </div>
                   <div className="mt-4 p-4 bg-secondary rounded-2xl border border-border flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-xs text-muted-foreground uppercase font-bold tracking-tight">ETA Arrival</span>
                         <span className="text-sm font-bold text-foreground">5 Minutes</span>
                      </div>
                      <div className="text-right flex flex-col">
                         <span className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Node Status</span>
                         <span className="text-sm font-bold text-primary">In Transit</span>
                      </div>
                   </div>
                </section>

                <section className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-3 text-emerald-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Medical Protocol</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-3 font-bold">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        SECURE AIRWAY AND ADMINISTER O2
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        PREP CARDIAC MONITORING
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        AUTO-NOTIFY CARDIOLOGY UNIT
                      </li>
                    </ul>
                </section>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 glass-panel flex flex-col items-center justify-center text-center p-8 border-dashed bg-white/30">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
              <Activity className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-muted-foreground tracking-tight">Monitoring System Active</h3>
            <p className="text-sm text-muted-foreground mt-4 max-w-[300px] font-medium leading-relaxed">
              Select a patient from the feed to view real-time diagnostics and initiate triage protocols.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
