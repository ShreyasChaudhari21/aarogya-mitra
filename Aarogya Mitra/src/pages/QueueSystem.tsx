import { useState } from 'react';
import { 
  Clock, 
  UserPlus, 
  Search, 
  Play,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Stethoscope,
  Activity,
  Flame,
  LayoutGrid,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const QueueSystem = () => {
  const { queue, addQueueToken, updateQueueStatus, removeQueueToken, patients } = useAarogyaData();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Clinical');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let patientName = newName;
    let pId: any = null;

    if (selectedPatientId) {
       const p = patients.find(p => p.id === selectedPatientId);
       if (p) {
          patientName = p.name;
          pId = p.id;
       }
    }
    if (!patientName) return;

    try {
      await addQueueToken(patientName, newType, pId);
      setNewName('');
      setSelectedPatientId('');
      setIsAdding(false);
      toast.success('Token Generated Successfully');
    } catch (err) {
      toast.error('Failed to generate token');
    }
  };

  // Only show active queue items (Exclude admitted patients from this view as requested)
  const activeQueue = queue.filter((item: any) => 
    item.status !== 'Completed' && 
    item.status !== 'Removed' && 
    item.status !== 'Admitted' && 
    item.status !== 'Discharged'
  );

  const filteredQueue = activeQueue.filter((item: any) => 
    String(item.patient_name || '').toLowerCase().includes(String(searchQuery || '').toLowerCase()) ||
    String(item.token_number || '').includes(String(searchQuery || ''))
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Patient Registry Queue</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Live Stream & Priority Orchestration Node
          </p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Issue Ticket
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Queue Management */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="glass-panel overflow-hidden border-border/50 shadow-xl">
              <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
                 <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="SEARCH TOKEN OR NAME..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/50"
                    />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-primary animate-pulse" />
                       <span className="text-[10px] font-black text-foreground uppercase tracking-widest tabular-nums">LIVE_SYNC: {activeQueue.length}</span>
                    </div>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-border/50 bg-secondary/10">
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Token</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subscriber</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stream Type</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Protocol State</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       <AnimatePresence mode="popLayout">
                          {filteredQueue.map((item: any) => (
                             <motion.tr layout key={item.id} className="hover:bg-secondary/20 transition-all group">
                                <td className="px-8 py-6">
                                   <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs tabular-nums shadow-inner">
                                      #{item.token_number}
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="text-sm font-bold text-foreground uppercase tracking-tight">{item.patient_name}</div>
                                   <div className="text-[9px] font-black text-muted-foreground uppercase mt-0.5 tracking-widest opacity-60 italic">
                                      {item.patient_id ? `ID: P-${item.patient_id}` : 'Walk-in Subscriber'}
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-2">
                                      {(item.type === 'Emergency' || item.priority === 'Critical') ? (
                                        <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                                      ) : item.type === 'Lab' ? (
                                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                      ) : (
                                        <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                                      )}
                                      <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        (item.type === 'Emergency' || item.priority === 'Critical') ? "text-red-500" : item.type === 'Lab' ? "text-indigo-500" : "text-emerald-500"
                                      )}>{(item.type === 'Emergency' || item.priority === 'Critical') ? 'CRITICAL' : item.type}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                   <span className={cn(
                                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                      item.status === 'Waiting' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                                      item.status === 'In Progress' ? "bg-primary/10 text-primary border-primary/20 animate-pulse" : 
                                      item.status === 'Bed Requested' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]" :
                                      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                   )}>
                                      {item.status}
                                   </span>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center justify-end gap-2">
                                      {item.status === 'Waiting' && (
                                        <button 
                                          onClick={() => updateQueueStatus(item.id, 'In Progress')}
                                          className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                          title="Begin Consultation"
                                        >
                                           <Play className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => removeQueueToken(item.id)}
                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                        title="Expunge Record"
                                      >
                                         <Trash2 className="w-4 h-4" />
                                      </button>
                                   </div>
                                </td>
                             </motion.tr>
                          ))}
                          {filteredQueue.length === 0 && (
                            <tr>
                               <td colSpan={5} className="py-24 text-center opacity-30 grayscale">
                                  <LayoutGrid className="w-16 h-16 mx-auto mb-4" />
                                  <p className="text-[12px] font-black uppercase tracking-[0.4em]">Queue Registry Initialized • Static State</p>
                               </td>
                            </tr>
                          )}
                       </AnimatePresence>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Sidebar Analytics/Add */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           {isAdding ? (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 border-primary/20 bg-primary/5 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">New Protocol Entry</h3>
                   <button onClick={() => setIsAdding(false)}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleAddToken} className="space-y-5">
                   <div>
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Select Registered Patient</label>
                      <select 
                         value={selectedPatientId}
                         onChange={(e) => {
                            setSelectedPatientId(e.target.value);
                            const p = patients.find(p => p.id === e.target.value);
                            if (p) setNewName(p.name);
                         }}
                         className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50"
                      >
                         <option value="">-- Choose Patient (Optional) --</option>
                         {patients?.map(p => (
                            <option key={p.id} value={p.id}>{p.name || 'Unknown Patient'} (#{p.id?.substr(0, 6) || '??'})</option>
                         ))}
                      </select>
                   </div>

                   <div className="relative flex items-center gap-4">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-[8px] font-black text-muted-foreground uppercase">OR</span>
                      <div className="h-px bg-border flex-1" />
                   </div>

                   <div>
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Full Subscriber Name</label>
                      <input 
                        required={!selectedPatientId}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50"
                        placeholder="ENTER PATIENT NAME..."
                      />
                   </div>
                   <div>
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Stream Type</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['Clinical', 'Lab', 'Emergency'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewType(type)}
                            className={cn(
                              "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex justify-between items-center",
                              newType === type ? "bg-primary border-primary text-white shadow-lg" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            )}
                          >
                             {type}
                             {newType === type && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      GENERATE SIGNAL
                   </button>
                </form>
             </motion.div>
           ) : (
             <div className="space-y-6">
                <div className="glass-panel p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 space-y-6">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Network Saturation</h3>
                      <Activity className="w-4 h-4 text-primary animate-pulse" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                         <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">WAITING</span>
                         <p className="text-2xl font-black text-amber-500 tabular-nums">{activeQueue.filter((i:any) => i.status === 'Waiting').length}</p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                         <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">IN CLINIC</span>
                         <p className="text-2xl font-black text-primary tabular-nums">{activeQueue.filter((i:any) => i.status === 'In Progress').length}</p>
                      </div>
                   </div>
                </div>

                <div className="glass-panel p-6 border-indigo-500/20 bg-indigo-500/5">
                   <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Priority Mapping</h4>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                      Emergency protocols bypass local synchronization nodes and are automatically moved to the clinical staging area (Position 1).
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
