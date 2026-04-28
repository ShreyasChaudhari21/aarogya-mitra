import { useState } from 'react';
import { 
  Check, 
  Clock, 
  Bed as BedIcon, 
  User,
  LayoutGrid,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
  ShieldCheck,
  Zap,
  Building,
  Layers,
  MousePointer2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const BedAllotment = () => {
  const { user, bedRequests, patients, detailedBeds, wards, addBedRequest, updateBedRequestStatus, assignBedToPatient, dischargePatient } = useAarogyaData();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showManualAllotModal, setShowManualAllotModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  
  const [newRequest, setNewRequest] = useState({
    patient_id: '',
    ward_type: 'General',
    reason: '',
    priority: 'Normal'
  });

  const isAdmin = user?.role === 'Admin';
  const filters = ['ALL', 'ICU', 'GENERAL', 'EMERGENCY', 'PRIVATE'];

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.patient_id) return toast.error('Please select a patient');
    
    setIsSubmitting(true);
    try {
      // 1. ATTEMPT AUTO-ALLOCATION (Receptionist Level)
      const normalizedReqType = newRequest.ward_type.trim().toUpperCase();
      
      const targetBed = detailedBeds.find(b => {
        const bType = b.type?.trim().toUpperCase() || 'GENERAL';
        return b.status === 'Available' && bType === normalizedReqType;
      });

      const fallbackBed = !targetBed ? detailedBeds.find(b => {
        const wardName = wards.find(w => w.id === b.wardId)?.name.toUpperCase() || '';
        return b.status === 'Available' && wardName.includes(normalizedReqType);
      }) : null;

      const finalBed = targetBed || fallbackBed;

        if (finalBed) {
          // SUCCESS: Auto-Allot immediately
          await addBedRequest({ ...newRequest, status: 'Approved' });
          await assignBedToPatient(newRequest.patient_id, finalBed.id);
        
        toast.success(`AUTO-ALLOTMENT SECURED: Bed #${finalBed.bedNumber} is locked for patient.`, {
           icon: '⚡',
           duration: 5000
        });
        setShowRequestModal(false);
      } else {
        // FAIL: Escalate to Admin
        await addBedRequest({ ...newRequest, status: 'Pending' });
        toast.success('NO VACANCY: Escalated to Bed Command Center (Pending Admin Approval)', {
           icon: '⏳',
           duration: 6000
        });
        setShowRequestModal(false);
      }
      
      setNewRequest({ patient_id: '', ward_type: 'General', reason: '', priority: 'Normal' });
    } catch (err) {
      toast.error('Failed to process clinical handshake.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAllot = async (bedId: string, bedNumber: string) => {
    if (!selectedRequest) return;
    
    const loadingToast = toast.loading(`Committing Manual Allotment...`);
     try {
        await updateBedRequestStatus(selectedRequest.id, 'Approved');
        await assignBedToPatient(selectedRequest.patient_id, bedId);
       
       toast.dismiss(loadingToast);
       toast.success(`STRATEGIC ALLOTMENT COMPLETE: Bed #${bedNumber} Assigned.`, {
         icon: '🛡️',
         duration: 4000
       });
       setShowManualAllotModal(false);
       setSelectedRequest(null);
    } catch (err) {
       toast.dismiss(loadingToast);
       toast.error('System synchronization failure.');
    }
  };

  const handleUpdateStatus = async (id: string, status: string, wardType: string, patientId: string) => {
    if (status === 'Approved') {
      // 1. PRE-CHECK: Check for bed availability BEFORE approving
      const normalizedReqType = wardType.trim().toUpperCase();
      
      const targetBed = detailedBeds.find(b => {
        const bType = b.type?.trim().toUpperCase() || 'GENERAL';
        return b.status === 'Available' && bType === normalizedReqType;
      });

      const fallbackBed = !targetBed ? detailedBeds.find(b => {
        const wardName = wards.find(w => w.id === b.wardId)?.name.toUpperCase() || '';
        return b.status === 'Available' && wardName.includes(normalizedReqType);
      }) : null;

      if (!targetBed && !fallbackBed) {
        toast.error(`ALLOTMENT BLOCKED: No available beds detected in ${normalizedReqType} sector.`, {
          icon: '🚫',
          duration: 5000,
          style: { background: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', fontWeight: 'bold' }
        });
        // NEW: Let the Admin enter Manual Selection mode anyway if they want to override
        return; 
      }


      const loadingToast = toast.loading(`Synchronizing Clinical State...`);
      try {
        await updateBedRequestStatus(id, status);
        const finalBed = targetBed || fallbackBed;
        if (finalBed) {
          await assignBedToPatient(patientId, finalBed.id);
          toast.dismiss(loadingToast);
          toast.success(`SUCCESS: Bed #${finalBed.bedNumber} Locked & Occupied`, {
            icon: '🏩',
            duration: 5000
          });
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error('Clinical Handshake Failure.');
      }
    } else {
      await updateBedRequestStatus(id, status);
      toast.success(`Request ${status} successfully.`);
    }
  };

  const getWardName = (wardId: string) => {
    const ward = wards.find(w => w.id === wardId);
    return ward ? ward.name.toUpperCase() : 'GENERAL WARD';
  };

  const getWardType = (wardId: string) => {
    const ward = wards.find(w => w.id === wardId);
    return ward ? ward.type.toUpperCase() : 'GENERAL';
  };

  const filteredBeds = activeFilter === 'ALL' 
    ? detailedBeds 
    : detailedBeds.filter(b => getWardType(b.wardId) === activeFilter);

  const bedGroups = filteredBeds.reduce((acc: any, bed) => {
    const key = getWardName(bed.wardId);
    if (!acc[key]) acc[key] = [];
    acc[key].push(bed);
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">{isAdmin ? 'Bed Command Center' : 'Bed Allocation Requests'}</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Real-time Resource Queue & Clinical Staging
          </p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" /> Initialize Allocation
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className="glass-panel overflow-hidden border-border/50 shadow-xl">
              <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary animate-pulse" />
                    <h2 className="text-xs font-black text-foreground uppercase tracking-widest">Active Request Log</h2>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-r border-border pr-4">Total: {bedRequests.length}</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Feed</span>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-border/50 bg-secondary/10">
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Patient Details</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Ward/Bed</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Priority</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Process State</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       {bedRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-secondary/20 transition-all group">
                             <td className="px-8 py-5">
                                <div className="text-sm font-bold text-foreground uppercase tracking-tight">{req.patient_name}</div>
                                <div className="text-[9px] font-black text-muted-foreground uppercase mt-0.5 tracking-tighter opacity-60 italic truncate max-w-[200px]">
                                   {req.reason || 'Standard Clinical Entry'}
                                </div>
                             </td>
                             <td className="px-8 py-5 text-center">
                                <div className="flex flex-col items-center gap-1">
                                   {req.status === 'Admitted' && req.bed_details ? (
                                     <div className="flex flex-col items-center">
                                       <span className="text-[10px] font-black text-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded border border-border">BED {req.bed_details.bedNumber}</span>
                                       <span className="text-[8px] font-bold text-primary uppercase mt-1 tracking-tighter">{req.bed_details.ward}</span>
                                     </div>
                                   ) : (
                                     <span className={cn(
                                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border",
                                        req.ward_type === 'ICU' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                                     )}>
                                        {req.ward_type}
                                     </span>
                                   )}
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-1.5">
                                   <div className={cn(
                                      "w-1.5 h-1.5 rounded-full", 
                                      req.priority === 'Urgent' || req.priority === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                                   )} />
                                   <span className={cn(
                                      "text-[10px] font-black uppercase tracking-widest",
                                      req.priority === 'Urgent' || req.priority === 'Critical' ? 'text-red-500' : 'text-emerald-500'
                                   )}>{req.priority}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                      "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest",
                                      req.status === 'Pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                                      req.status === 'Admitted' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                      req.status === 'Approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                   )}>
                                      {req.status}
                                   </div>
                                   {req.status === 'Admitted' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
                                   {req.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                                </div>
                             </td>
                             <td className="px-8 py-5 text-right">
                                {isAdmin ? (
                                   <div className="flex items-center justify-end gap-2 px-1">
                                      {req.status === 'Pending' && (
                                         <>
                                            <button 
                                               onClick={() => { setSelectedRequest(req); setShowManualAllotModal(true); }}
                                               className="p-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm group/btn relative"
                                               title="Strategic Assign"
                                            >
                                               <MousePointer2 className="w-4 h-4" />
                                               <div className="absolute -top-8 right-0 bg-indigo-500 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">Assign Bed</div>
                                            </button>
                                            <button 
                                               onClick={() => handleUpdateStatus(req.id, 'Approved', req.ward_type, req.patient_id)}
                                               className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"
                                               title="Auto-Assign"
                                            >
                                               <Check className="w-4 h-4" />
                                            </button>
                                            <button 
                                               onClick={() => handleUpdateStatus(req.id, 'Rejected', req.ward_type, req.patient_id)}
                                               className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                            >
                                               <XCircle className="w-4 h-4" />
                                            </button>
                                         </>
                                      )}
                                      {req.status === 'Admitted' && (
                                         <button 
                                            onClick={async () => {
                                               const bed = detailedBeds.find(b => String(b.patientId) === String(req.id));



                                                dischargePatient(req.id, bed?.id || '');

                                            }}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[8px] font-black uppercase rounded-lg transition-all"
                                         >
                                            Discharge
                                         </button>
                                      )}
                                   </div>
                                ) : (
                                   <div className="flex items-center justify-end opacity-20">
                                      <Zap className="w-4 h-4 text-muted-foreground" />
                                   </div>
                                )}
                             </td>
                          </tr>
                       ))}
                       {bedRequests.length === 0 && (
                          <tr>
                             <td colSpan={5} className="py-20 text-center opacity-30 grayscale">
                                <LayoutGrid className="w-12 h-12 mx-auto mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Synchronized • No Pending Actions</span>
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">Global Ward Infrastructure</h3>
                 </div>
                 
                 <div className="flex bg-secondary p-1 rounded-xl border border-border">
                    {filters.map(f => (
                       <button 
                          key={f} 
                          onClick={() => setActiveFilter(f)}
                          className={cn(
                            "px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all",
                            activeFilter === f ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                          )}
                       >
                          {f}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-10">
                 {Object.entries(bedGroups).length > 0 ? Object.entries(bedGroups).map(([groupName, beds]: [any, any]) => (
                    <div key={groupName} className="space-y-4">
                       <div className="flex items-center gap-4 group">
                          <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">{groupName}</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase tabular-nums">{beds.length} BEDS ALLOCATED</span>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {beds.map((bed: any) => (
                             <motion.div 
                                layout
                                key={bed.id} 
                                onClick={() => {
                                   if (isAdmin && bed.status === 'Occupied') {
                                       const patient = patients.find(p => String(p.id) === String(bed.patientId));
                                      setSelectedBed({ ...bed, patientDetails: patient });
                                      setShowPatientModal(true);
                                   }
                                }}
                                className={cn(
                                "p-5 rounded-2xl border border-border flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group/bed shadow-sm hover:shadow-xl",
                                bed.status === 'Available' ? "bg-emerald-500/5 hover:border-emerald-500/30" : bed.status === 'Occupied' ? "bg-red-500/5 border-red-500/20" : "bg-orange-500/5 hover:border-orange-500/30",
                                bed.status === 'Occupied' && "grayscale-[0.5]",
                                isAdmin && bed.status === 'Occupied' && "cursor-pointer hover:border-red-500/40"
                             )}>
                                <div className={cn(
                                   "absolute top-0 right-0 w-8 h-8 rounded-bl-2xl flex items-center justify-center",
                                   bed.status === 'Available' ? "bg-emerald-500/10" : "bg-red-500/10"
                                )}>
                                   <Zap className={cn("w-3 h-3", bed.status === 'Available' ? "text-emerald-500" : "text-red-500")} />
                                </div>
                                <BedIcon className={cn(
                                   "w-6 h-6 transition-transform group-hover/bed:scale-110",
                                   bed.status === 'Available' ? "text-emerald-500" : "text-red-500"
                                )} />
                                <span className="text-[11px] font-black text-foreground tabular-nums">#{bed.bedNumber}</span>
                                <span className={cn(
                                   "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                   bed.status === 'Available' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                )}>
                                   {bed.status}
                                </span>
                             </motion.div>
                          ))}
                       </div>
                    </div>
                 )) : (
                    <div className="py-20 text-center opacity-30 grayscale glass-panel">
                       <Layers className="w-12 h-12 mx-auto mb-4" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Wards Detected in this Category</span>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 space-y-6 shadow-2xl sticky top-24">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Global Capacity</h3>
                 <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4 pt-5">
                    <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                       <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">ICU VACANT</span>
                       <p className="text-2xl font-black text-red-500 tabular-nums">
                          {detailedBeds.filter(b => b.status === 'Available' && getWardType(b.wardId) === 'ICU').length}
                       </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                       <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">GEN VACANT</span>
                       <p className="text-2xl font-black text-emerald-500 tabular-nums">
                          {detailedBeds.filter(b => b.status === 'Available' && getWardType(b.wardId) === 'GENERAL').length}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-border">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">In-Patient Registry</h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-tighter">Live</span>
                 </div>
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {detailedBeds.filter(b => b.status === 'Occupied').length > 0 ? (
                       detailedBeds.filter(b => b.status === 'Occupied').map(bed => (
                          <div key={bed.id} className="p-4 bg-secondary/20 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-primary font-mono lowercase tracking-tighter">#{bed.patientId}</span>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-0.5 rounded border border-border">Bed {bed.bedNumber}</span>
                             </div>
                             <h4 className="text-xs font-black text-foreground uppercase tracking-tight truncate">{bed.patientName}</h4>
                             <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{getWardName(bed.wardId)}</p>
                          </div>
                       ))
                    ) : (
                       <div className="py-10 text-center opacity-20">
                          <User className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-[9px] font-black uppercase tracking-widest">No Occupants Detected</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRequestModal(false)} className="absolute inset-0 bg-background/80" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-lg glass-panel p-0 overflow-hidden shadow-3xl border-primary/20 bg-card">
               <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                  <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-2 flex items-center gap-3 italic">
                     <LayoutGrid className="text-primary w-6 h-6" /> Initialize Allotment
                  </h2>
               </div>
               <form onSubmit={handleCreateRequest} className="p-8 space-y-6">
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Select Target Patient</label>
                        <select 
                           value={newRequest.patient_id}
                           onChange={(e) => setNewRequest({ ...newRequest, patient_id: e.target.value })}
                           className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                           required
                        >
                           <option value="">Choose Verified Member</option>
                           {patients.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
                           ))}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Ward Category</label>
                           <select 
                              value={newRequest.ward_type}
                              onChange={(e) => setNewRequest({ ...newRequest, ward_type: e.target.value })}
                              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-black uppercase focus:ring-2 focus:ring-primary/50 transition-all"
                           >
                              <option>General</option>
                              <option>ICU</option>
                              <option>Emergency</option>
                              <option>NICU</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Signal Priority</label>
                           <select 
                              value={newRequest.priority}
                              onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-black uppercase focus:ring-2 focus:ring-primary/50 transition-all"
                           >
                              <option>Normal</option>
                              <option>Urgent</option>
                              <option>Critical</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button type="button" onClick={() => setShowRequestModal(false)} className="flex-1 py-4 bg-secondary text-foreground text-[10px] font-black uppercase rounded-2xl hover:bg-border transition-all">Abort</button>
                     <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Broadcast Pulse</>}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}

        {showManualAllotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowManualAllotModal(false)} className="absolute inset-0 bg-background/90" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-4xl glass-panel p-10 shadow-3xl border-primary/20 bg-card overflow-hidden">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Strategic Manual Override</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase mt-1 tracking-widest">Subscriber: {selectedRequest?.patient_name} • Requested: {selectedRequest?.ward_type}</p>
                  </div>
                  <button onClick={() => setShowManualAllotModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-6 h-6" /></button>
               </div>

               <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  {Object.entries(bedGroups).map(([wardName, beds]: [any, any]) => (
                    <div key={wardName} className="space-y-4">
                       <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-3">
                          <Building className="w-3 h-3" /> {wardName}
                       </h3>
                       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {beds.map((bed: any) => (
                             <button
                                key={bed.id}
                                disabled={bed.status !== 'Available'}
                                onClick={() => handleManualAllot(bed.id, bed.bedNumber)}
                                className={cn(
                                   "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all relative group/m",
                                   bed.status === 'Available' ? "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500 hover:scale-105" : "bg-red-500/5 border-red-500/10 grayscale opacity-40 cursor-not-allowed"
                                )}
                             >
                                <BedIcon className={cn("w-4 h-4", bed.status === 'Available' ? "text-emerald-500" : "text-red-500")} />
                                <span className="text-[10px] font-black text-foreground tabular-nums">#{bed.bedNumber}</span>
                                {bed.status === 'Available' && <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center opacity-0 group-hover/m:opacity-100 transition-opacity rounded-xl text-[8px] font-black text-white">SELECT</div>}
                             </button>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
        {showPatientModal && selectedBed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPatientModal(false)} className="absolute inset-0 bg-background/80" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-md glass-panel p-0 overflow-hidden shadow-3xl border-red-500/20 bg-card">
               <div className="p-8 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/20 rounded-lg">
                        <User className="text-red-500 w-5 h-5" />
                     </div>
                     <div>
                        <h2 className="text-lg font-black text-foreground uppercase tracking-tight italic">Occupant Details</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Bed #{selectedBed.bedNumber} • {getWardName(selectedBed.wardId)}</p>
                     </div>
                  </div>
                  <button onClick={() => setShowPatientModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-2xl border border-border">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Name</span>
                        <span className="text-sm font-black text-foreground uppercase">{selectedBed.patientName || 'Unknown Patient'}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Age</span>
                           <span className="text-sm font-black text-foreground">{selectedBed.patientDetails?.age || 'N/A'} YEARS</span>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Gender</span>
                           <span className="text-sm font-black text-foreground uppercase">{selectedBed.patientDetails?.gender || 'N/A'}</span>
                        </div>
                     </div>

                     <div className="p-4 bg-secondary/50 rounded-2xl border border-border">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Patient ID</span>
                        <span className="text-xs font-mono font-bold text-primary">#{selectedBed.patientId || 'N/A'}</span>
                     </div>
                  </div>

                  <div className="pt-4">
                     <button 
                        onClick={() => setShowPatientModal(false)}
                        className="w-full py-4 bg-secondary text-foreground text-[10px] font-black uppercase rounded-2xl hover:bg-border transition-all border border-border"
                     >
                        Close Registry
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
