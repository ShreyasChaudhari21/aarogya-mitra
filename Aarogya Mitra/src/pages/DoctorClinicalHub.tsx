import { useState } from 'react';
import { 
  Stethoscope, 
  FileText, 
  FlaskConical, 
  ClipboardCheck,
  ArrowRight,
  Brain,
  Activity,
  Heart,
  Timer
} from 'lucide-react';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const DoctorClinicalHub = () => {
  const { queue, updateQueueStatus, user, updateAmbulanceStatus } = useAarogyaData();
  const [activeTab, setActiveTab] = useState('Active Assignments');
  
  // Filter by current doctor's assignments
  const myCases = queue.filter((i: any) => i.assignedDoctor === user?.name);

  const activePatients = myCases.filter((i: any) => i.status === 'In Progress' || i.status === 'Assigned' || i.status === 'Admitted');
  const waitingPatients = queue.filter((i: any) => i.status === 'Waiting' && !i.assignedDoctor);

  const handleFinishConsultation = async (id: string) => {
    try {
      await updateQueueStatus(id, 'Completed');
      toast.success('Consultation Finalized & Synchronized');
    } catch (err) {
      toast.error('Sync failure');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Clinical Command Hub</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Real-time Medical Intelligence & Live Patient Staging
          </p>
        </div>
        <div className="flex bg-secondary/30 p-1.5 rounded-2xl border border-border">
           {['Active Assignments', 'Waiting Room', 'Medical Records'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                )}
              >
                 {tab}
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main Content Area */}
         <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="glass-panel p-0 overflow-hidden border-border/50 shadow-xl">
               <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/10">
                  <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                     <Stethoscope className="w-4 h-4 text-primary" /> {activeTab.toUpperCase()} Registry
                  </h2>
               </div>
               
               <div className="divide-y divide-border/30 max-h-[400px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {(activeTab === 'Active Assignments' ? activePatients : activeTab === 'Waiting Room' ? waitingPatients : []).map((p: any) => (
                       <motion.div 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={p.id} 
                          className="p-6 flex items-center justify-between hover:bg-primary/5 transition-all group cursor-pointer relative"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-black text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                {p.patient_name.charAt(0)}
                             </div>
                             <div>
                                <h3 className="text-base font-bold text-foreground uppercase tracking-tight flex items-center gap-2">
                                    {p.patient_name}
                                    {p.type === 'Emergency' && (
                                       <span className="bg-red-500 text-[8px] text-white px-1.5 py-0.5 rounded-md animate-pulse">CRITICAL</span>
                                    )}
                                 </h3>
                                 <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                                    Token: #{p.token_number} • Protocol: {p.type.toUpperCase()}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-right flex flex-col items-end mr-4">
                                 <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                                    (p.status === 'In Progress' || p.status === 'Assigned') ? "text-emerald-500" : "text-amber-500"
                                 )}>
                                    {(p.status === 'In Progress' || p.status === 'Assigned') ? <Activity className="w-3 h-3 animate-pulse" /> : <Timer className="w-3 h-3" />}
                                    {p.status === 'Assigned' ? 'READY' : p.status}
                                 </span>
                                 <span className={cn(
                                    "text-[9px] font-bold uppercase",
                                    p.priority === 'Critical' ? "text-red-500" : "text-muted-foreground"
                                 )}>
                                    Triage: {p.priority || 'Normal'}
                                 </span>
                              </div>
                              
                              {p.status === 'Assigned' ? (
                                <button 
                                  onClick={async () => {
                                    await updateQueueStatus(p.id.toString(), 'In Progress');
                                    if (p.ambulanceId) {
                                      updateAmbulanceStatus(p.ambulanceId, 'Available');
                                      toast.success(`Ambulance ${p.ambulanceId} is now Available.`);
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                >
                                  ACCEPT
                                </button>
                              ) : p.status === 'In Progress' ? (
                                 <button 
                                    onClick={() => handleFinishConsultation(p.id.toString())}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                                 >
                                    FINALIZE
                                 </button>
                             ) : (
                                <button 
                                   onClick={async () => {
                                     await updateQueueStatus(p.id.toString(), 'In Progress');
                                     if (p.ambulanceId) {
                                       updateAmbulanceStatus(p.ambulanceId, 'Available');
                                       toast.success(`Ambulance ${p.ambulanceId} is now Available.`);
                                     }
                                   }}
                                   className="p-3 bg-secondary rounded-xl hover:bg-primary hover:text-white transition-all group/btn"
                                >
                                   <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                             )}
                          </div>
                       </motion.div>
                    ))}

                    {((activeTab === 'Active Assignments' && activePatients.length === 0) || (activeTab === 'Waiting Room' && waitingPatients.length === 0)) && (
                       <div className="py-20 text-center opacity-30 grayscale">
                          <Heart className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Signals in this Registry</p>
                       </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-panel p-6 border-indigo-500/20 bg-indigo-500/5 group hover:border-indigo-500 transition-all cursor-pointer">
                  <FileText className="w-6 h-6 text-indigo-500 mb-4" />
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Update EMR Records</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-widest">Formalize Diagnosis & Prescription</p>
               </div>
               <div className="glass-panel p-6 border-emerald-500/20 bg-emerald-500/5 group hover:border-emerald-500 transition-all cursor-pointer">
                  <FlaskConical className="w-6 h-6 text-emerald-500 mb-4" />
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Laboratory Analysis</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-widest">Execute Pathology Protocol</p>
               </div>
            </div>
         </div>

         {/* Sidebar Insight Panel */}
         <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 space-y-6 border-primary/20 bg-primary/5">
               <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-primary" />
                  <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest italic">Clinical Intelligence</h4>
               </div>
               <div className="space-y-4">
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">
                     "System detected {waitingPatients.length} patients awaiting consultation. Recommend accelerating triage protocols for Emergency signals."
                  </p>
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                     <span className="text-[10px] font-black text-primary uppercase">Node Saturation</span>
                     <span className="text-xs font-black text-foreground tabular-nums">{(activePatients.length + waitingPatients.length) * 10}%</span>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-6 bg-secondary/20 border-border/40">
               <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Recent History
               </h4>
               <div className="space-y-3">
                  {queue.filter((i:any) => i.status === 'Completed').slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-card/50 rounded-xl border border-border/50">
                       <div>
                          <p className="text-xs font-bold text-foreground uppercase">{item.patient_name}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">SUCCESSFULLY CONSULTED</p>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <ClipboardCheck className="w-3 h-3 text-emerald-500" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
