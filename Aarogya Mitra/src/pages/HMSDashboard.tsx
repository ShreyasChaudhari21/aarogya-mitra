import { useState } from 'react';
import { 
  Bed, 
  Users, 
  Building, 
  TrendingUp, 
  Activity,
  BrainCircuit,
  Zap,
  Package,
  Plus,
  Microscope,
  Power,
  Search,
  X,
  User,
  RefreshCw,
  Shield,
  History
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const HMSDashboard = () => {
  const { 
    detailedBeds, 
    wards, 
    addBed, 
    updateBed, 
    deleteBed,
    addWard,
    updateWard,
    deleteWard,
    patients,
    user,
    initializeSystem,
    syncStatus
  } = useAarogyaData();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'beds' | 'equipment' | 'audit'>('beds');
  const [filterType, setFilterType] = useState('All');
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [isManagingWards, setIsManagingWards] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  const fetchAuditLogs = async () => {
    setIsLoadingAudit(true);
    // Cloud Audit Logs Integration Pending
    setAuditLogs([]);
    setIsLoadingAudit(false);
  };

  const isAdmin = user?.role === 'Admin';

  const stats = [
    { label: 'Total Capacity', value: detailedBeds.length, sub: `${detailedBeds.filter(b => b.status === 'Available').length} Avail`, color: 'blue', icon: Building },
    { label: 'Critical Care (ICU)', value: detailedBeds.filter(b => b.type === 'ICU' && b.status === 'Available').length, sub: `${detailedBeds.filter(b => b.type === 'ICU').length} Max`, color: 'red', icon: BrainCircuit },
    { label: 'Signals Personnel', value: '124', sub: '12 Stby', color: 'emerald', icon: Users },
    { label: 'System Load', value: '78%', sub: 'NOMINAL', color: 'purple', icon: Activity },
  ];

  const inventory = [
    { name: 'Ventilators', count: 12, status: 'Optimal', demand: 'Normal' },
    { name: 'O2 Concentrators', count: 45, status: 'Optimal', demand: 'Normal' },
    { name: 'Defibrillators', count: 8, status: 'Low', demand: 'Urgent' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-widest leading-none">Resource Center</h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-xs text-muted-foreground font-semibold tracking-wide">Inventory & Capacity Management</p>
            {isAdmin && (
               <div className="flex items-center gap-2 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                  <Shield className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Admin Privileges</span>
               </div>
            )}
          </div>
        </div>
        <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border transition-colors">
          {['Overview', 'Beds', 'Equipment', 'Audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                const t = tab.toLowerCase() as any;
                setActiveTab(t);
                if (t === 'audit') fetchAuditLogs();
              }}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab.toLowerCase() 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
         <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between overflow-hidden"
         >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <h4 className="text-xs font-black text-primary uppercase">Serverless Infrastructure Active</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Your system is now fully powered by Google Firebase. Zero-latency sync is live.</p>
               </div>
            </div>
            <button 
               onClick={() => initializeSystem()}
               disabled={syncStatus === 'PENDING'}
               className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
               {syncStatus === 'PENDING' ? `Initializing...` : 'Seed Cloud Registry'}
            </button>
         </motion.div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-6 border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <stat.icon className="w-12 h-12" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="text-4xl font-bold text-foreground tracking-tighter">{stat.value}</h3>
                    <div className="flex items-center gap-1 text-xs text-primary font-bold">
                       <TrendingUp className="w-3.5 h-3.5" />
                       {stat.sub}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                     <div 
                       className={cn(
                         "h-full rounded-full transition-all duration-1000",
                         stat.color === 'blue' ? "bg-blue-500" :
                         stat.color === 'red' ? "bg-red-500" :
                         stat.color === 'emerald' ? "bg-emerald-500" : "bg-purple-500"
                       )} 
                       style={{ width: '75%' }}
                     />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 glass-panel p-8">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-lg font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" /> Admission Trends
                   </h3>
                   <div className="flex gap-2">
                      <button className="text-xs font-bold px-3 py-1.5 bg-secondary rounded-lg border border-border">Hourly</button>
                      <button className="text-xs font-bold px-3 py-1.5 bg-primary text-white rounded-lg">Daily</button>
                   </div>
                </div>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 glass-panel p-8">
                 <h4 className="text-md font-bold text-foreground uppercase tracking-widest mb-6">Inventory Status</h4>
                 <div className="space-y-4">
                    {inventory.map((item) => (
                      <div key={item.name} className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between group cursor-crosshair">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-foreground">{item.name}</p>
                                <div className="flex gap-2 mt-2">
                                  <button 
                                    onClick={() => toast.success(`Generating census for ${item.name}`)}
                                    className="px-4 py-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold uppercase transition-all border border-border"
                                  >
                                    Census
                                  </button>
                                  <button 
                                    onClick={() => toast.success(`Restock request sent for ${item.name}`)}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                  >
                                    Restock
                                  </button>
                                </div>
                             </div>
                          </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl">
                    Order New Supplies
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'beds' && (
          <motion.div 
            key="beds"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             {/* Admin Controls */}
             <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between glass-panel p-6">
                <div className="flex flex-wrap gap-2">
                   {['All', 'ICU', 'General', 'Emergency', 'Private'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                          filterType === type 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                        )}
                      >
                         {type}
                      </button>
                   ))}
                </div>
                <div className="flex gap-3">
                   <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="SEARCH BED..." 
                        className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                      />
                   </div>
                   <button 
                     onClick={() => setIsAddingBed(true)}
                     className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                   >
                      <Plus className="w-4 h-4" /> Add Bed
                   </button>
                   <button 
                     onClick={() => setIsManagingWards(true)}
                     className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-xs font-bold uppercase rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 transition-all"
                   >
                      <Building className="w-4 h-4" /> Wards
                   </button>
                </div>
             </div>

             {/* Ward Groups */}
             <div className="space-y-10">
                {[...wards]
                  .sort((a, b) => {
                    const getFloorVal = (f: string | undefined | null) => {
                      if (!f) return 999;
                      const str = String(f).toUpperCase().replace(/FL\.?/g, '').replace(/FLOOR/g, '').trim();
                      if (str === 'G' || str === 'GROUND') return 0;
                      return parseInt(str) || 999;
                    };
                    return getFloorVal(a.floor) - getFloorVal(b.floor);
                  })
                  .filter(w => {
                    if (filterType === 'All') return true;
                    const target = String(filterType).toUpperCase();
                    return String(w.name).toUpperCase().includes(target);
                  })
                  .map(ward => {
                  const wardBeds = detailedBeds.filter(b => b.wardId === ward.id);
                  

                  return (
                    <div key={ward.id} className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-3">
                             <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 tracking-tighter">
                                Floor {ward.floor}
                             </div>
                             <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">{ward.name}</h3>
                             <span className="text-[10px] text-muted-foreground font-bold">({wardBeds.length} UNITS)</span>
                          </div>
                          <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Expand View</button>
                       </div>
                       
                       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                          {wardBeds.map((bed) => (
                            <motion.div 
                               key={bed.id}
                               whileHover={{ y: -4 }}
                               onClick={() => {
                                 if (isAdmin && bed.status === 'Occupied') {
                                    const patient = patients.find(p => p.id === bed.patientId);
                                    setSelectedBed({ ...bed, patientDetails: patient });
                                    setShowPatientModal(true);
                                 }
                               }}
                               className={cn(
                                 "aspect-square rounded-2xl border p-4 flex flex-col items-center justify-between transition-all duration-300 relative group cursor-pointer",
                                 bed.status === 'Occupied' ? "bg-red-500/5 border-red-500/20 text-red-500" :
                                 bed.status === 'Maintenance' ? "bg-amber-500/5 border-amber-500/20 text-amber-500" :
                                 bed.status === 'Reserved' ? "bg-blue-500/5 border-blue-500/20 text-blue-500" :
                                 "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:border-emerald-500/40",
                                 isAdmin && bed.status === 'Occupied' && "hover:border-red-500/40 hover:shadow-lg"
                               )}
                            >
                               <div className="w-full flex justify-between items-start">
                                  <span className="text-[10px] font-black opacity-60 tracking-tighter">#{bed.bedNumber}</span>
                                  {bed.type === 'ICU' && <Zap className="w-3 h-3 fill-current" />}
                               </div>

                               <Bed className={cn("w-7 h-7", bed.status === 'Occupied' ? "animate-pulse" : "")} />
                               
                               <div className="text-center">
                                  <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{bed.status}</p>
                                  {bed.patientName && (
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase truncate w-16 mx-auto">
                                      {bed.patientName}
                                    </p>
                                  )}
                               </div>

                               {/* Action Overlay */}
                               <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex flex-col items-center justify-center gap-2 p-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBed(bed.id, { status: bed.status === 'Available' ? 'Occupied' : 'Available' });
                                      toast.success(`BED ${bed.bedNumber} STATUS UPDATED`);
                                    }}
                                    className="w-full py-1.5 bg-primary text-white text-[9px] font-bold uppercase rounded-lg shadow-sm"
                                  >
                                    Set {bed.status === 'Available' ? 'Occupied' : 'Available'}
                                  </button>
                                  <div className="flex gap-1 w-full">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateBed(bed.id, { status: 'Maintenance' });
                                        toast.success(`BED ${bed.bedNumber} IN MAINTENANCE`);
                                      }}
                                      className="flex-1 py-1.5 bg-secondary border border-border text-[9px] font-bold uppercase rounded-lg"
                                    >
                                      Maint
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteBed(bed.id);
                                        toast.error(`BED ${bed.bedNumber} REMOVED`);
                                      }}
                                      className="flex-1 py-1.5 bg-destructive/10 text-destructive text-[9px] font-bold uppercase rounded-lg border border-destructive/20"
                                    >
                                      Delete
                                    </button>
                                  </div>
                               </div>
                            </motion.div>
                          ))}
                          
                          {/* Quick Add Placeholder */}
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            onClick={() => addBed({ wardId: ward.id, bedNumber: `${Math.floor(Math.random() * 900) + 100}`, type: ward.type === 'ICU' ? 'ICU' : 'General' })}
                            className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-all group"
                          >
                             <Plus className="w-6 h-6 mb-1 group-hover:rotate-90 transition-transform" />
                             <span className="text-[10px] font-bold uppercase">Quick Add</span>
                          </motion.button>
                       </div>
                    </div>
                  );
                })}
             </div>
          </motion.div>
        )}

        {activeTab === 'equipment' && (
          <motion.div 
            key="equipment"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
             {inventory.map((item) => (
               <div key={item.name} className="glass-panel p-8 group hover:border-primary/30 transition-all bg-card/40">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                        <Microscope className="w-7 h-7 text-primary" />
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Efficiency</span>
                        <span className="text-xs font-black text-blue-500">99.8%</span>
                     </div>
                  </div>
                  <h4 className="text-xl font-bold text-foreground uppercase tracking-widest mb-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase mb-8">Model: PRO-OS-001</p>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>Calibration Status</span>
                        <span className="text-emerald-500 flex items-center gap-1"><Power className="w-3 h-3" /> Ready</span>
                     </div>
                     <div className="w-full h-1 bg-secondary rounded-full">
                        <div className="h-full bg-primary w-4/5" />
                     </div>
                  </div>

                  <button 
                    onClick={() => toast.success(`Initiating ${item.name} protocol`, { icon: '🚀' })}
                    className="w-full py-4 bg-secondary border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 active:scale-95"
                  >
                     Deploy to Ward
                  </button>
               </div>
             ))}
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div 
             key="audit"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="space-y-6"
          >
             <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-foreground uppercase tracking-widest flex items-center gap-2 italic">
                   <History className="w-5 h-5 text-primary" /> Centralized Audit Trail
                </h3>
                <button 
                  onClick={fetchAuditLogs}
                  className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-all"
                >
                  <RefreshCw className={cn("w-4 h-4", isLoadingAudit && 'animate-spin')} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refresh Logs</span>
                </button>
             </div>
             
             <div className="glass-panel overflow-hidden bg-card/40">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                         <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Seq ID</th>
                         <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Signal</th>
                         <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entity Target</th>
                         <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Authorized Personnel</th>
                         <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Details</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                      {auditLogs.length > 0 ? auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                           <td className="px-6 py-4 font-mono text-[9px] text-muted-foreground uppercase">
                              #{log.id.toString().padStart(4, '0')}
                           </td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border",
                                log.action.includes('CONFLICT') ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              )}>
                                 {log.action}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">{log.entity} <span className="text-primary">UID {log.entity_id}</span></span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center border border-border group-hover:border-primary/30 transition-all">
                                    <User className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                                 </div>
                                 <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{log.user_name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-[10px] text-muted-foreground group-hover:text-foreground font-medium uppercase tracking-tight">
                              {log.details}
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="py-20 text-center">
                              {isLoadingAudit ? (
                                <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                              ) : (
                                <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
                              )}
                              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No activity sequences recorded in local registry</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Bed Modal */}
      <AnimatePresence>
        {isAddingBed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-md rounded-[2rem] border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/50">
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Add New Bed</h3>
                <button onClick={() => setIsAddingBed(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
              <form 
                className="p-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addBed({
                    bedNumber: formData.get('bedNumber') as string,
                    wardId: formData.get('wardId') as string,
                    type: (wards.find(w => w.id === formData.get('wardId'))?.type || 'General') as 'ICU' | 'General'
                  });
                  toast.success('Bed successfully added! ✅');
                  setIsAddingBed(false);
                }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bed Identifier</label>
                  <input required name="bedNumber" type="text" placeholder="e.g. B-101" className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assign to Ward</label>
                  <select required name="wardId" className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                    <option value="" disabled selected>Select a ward</option>
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>{w.name} (Floor {w.floor})</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddingBed(false)} className="flex-1 py-3 bg-secondary text-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/70 transition-all border border-border">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Confirm Add
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Wards Modal */}
      <AnimatePresence>
        {isManagingWards && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-2xl rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/50 shrink-0">
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" /> Manage Wards
                </h3>
                <button onClick={() => setIsManagingWards(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid gap-3">
                  {[...wards].sort((a, b) => {
                    const getFloorVal = (f: string | undefined | null) => {
                      if (!f) return 999;
                      const str = String(f).toUpperCase().replace(/FL\.?/g, '').replace(/FLOOR/g, '').trim();
                      if (str === 'G' || str === 'GROUND') return 0;
                      return parseInt(str) || 999;
                    };
                    return getFloorVal(a.floor) - getFloorVal(b.floor);
                  }).map(w => (
                    <div key={w.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-secondary border border-border rounded-xl gap-4">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 tracking-tighter">
                          FL {w.floor}
                        </div>
                        <div>
                          <span className="text-sm font-bold block">{w.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{w.type} TYPE</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => {
                            const newName = prompt('Enter new ward name:', w.name);
                            if (newName && newName !== w.name) {
                              updateWard(w.id, { name: newName });
                              toast.success('Ward updated');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-background border border-border text-xs font-bold uppercase rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          Rename
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this ward? This might orphan existing beds.')) {
                              deleteWard(w.id);
                              toast.error('Ward deleted');
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-destructive/10 text-destructive text-xs font-bold uppercase rounded-lg border border-destructive/20 hover:bg-destructive hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Add New Ward</h4>
                  <form 
                    className="flex flex-col md:flex-row gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      addWard({
                        name: formData.get('wardName') as string,
                        type: (formData.get('wardType') as 'ICU' | 'General' | 'Emergency' | 'Private') || 'General',
                        floor: formData.get('floor') as string
                      });
                      e.currentTarget.reset();
                      toast.success('New ward configured successfully! ✅');
                    }}
                  >
                    <input required name="wardName" type="text" placeholder="Ward Name (e.g. Neo-Natal)" className="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <select name="wardType" className="px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                      <option value="General">General</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Private">Private</option>
                    </select>
                    <select name="floor" className="w-24 px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                      <option value="1">Fl. 1</option>
                      <option value="2">Fl. 2</option>
                      <option value="3">Fl. 3</option>
                      <option value="4">Fl. 4</option>
                      <option value="G">Fl. G</option>
                    </select>
                    <button type="submit" className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
                      Add Ward
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Patient Details Modal */}
      <AnimatePresence>
        {showPatientModal && selectedBed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPatientModal(false)} className="absolute inset-0 bg-background/80" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-sm glass-panel p-0 overflow-hidden shadow-3xl border-red-500/20 bg-card text-left">
               <div className="p-6 border-b border-border bg-gradient-to-r from-red-500/10 to-transparent flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/20 rounded-lg">
                        <User className="text-red-500 w-4 h-4" />
                     </div>
                     <div>
                        <h2 className="text-sm font-black text-foreground uppercase tracking-tight italic">Patient Details</h2>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Bed #{selectedBed.bedNumber}</p>
                     </div>
                  </div>
                  <button onClick={() => setShowPatientModal(false)} className="p-2 hover:bg-secondary rounded-lg transition-all"><X className="w-4 h-4" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-3">
                     <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Full Name</span>
                        <span className="text-xs font-black text-foreground uppercase">{selectedBed.patientName || 'Unknown Patient'}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Age</span>
                           <span className="text-xs font-black text-foreground">{selectedBed.patientDetails?.age || 'N/A'} YRS</span>
                        </div>
                        <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Gender</span>
                           <span className="text-xs font-black text-foreground uppercase">{selectedBed.patientDetails?.gender || 'N/A'}</span>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => setShowPatientModal(false)}
                     className="w-full py-3 bg-primary text-white text-[9px] font-black uppercase rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                     Dismiss Details
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const chartData = [
  { name: '00:00', admissions: 12 },
  { name: '04:00', admissions: 5 },
  { name: '08:00', admissions: 25 },
  { name: '12:00', admissions: 18 },
  { name: '16:00', admissions: 35 },
  { name: '20:00', admissions: 42 },
  { name: '23:59', admissions: 20 },
];
