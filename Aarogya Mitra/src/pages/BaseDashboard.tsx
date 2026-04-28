import { 
  Activity, 
  Building2, 
  Users, 
  ArrowUpRight, 
  Zap,
  TrendingUp,
  BrainCircuit,
  Radio,
  UserPlus,
  Calendar,
  CircleDollarSign,
  ChevronRight,
  CreditCard,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { useTranslation } from 'react-i18next';

export const BaseDashboard = () => {
  const { user, patients, bedRequests, detailedBeds } = useAarogyaData();
  const { t } = useTranslation();
  
  const generalBeds = detailedBeds.filter(b => b.type?.toUpperCase() === 'GENERAL' || !b.type);
  const icuBeds = detailedBeds.filter(b => b.type?.toUpperCase() === 'ICU');
  
  const genOccupied = generalBeds.filter(b => b.status === 'Occupied').length;
  const icuOccupied = icuBeds.filter(b => b.status === 'Occupied').length;
  
  const isReceptionist = user?.role === 'Receptionist';
  
  const pendingRequestsCount = bedRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 overflow-y-auto h-full">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic flex items-center gap-3">
             <Zap className="text-primary animate-pulse" /> {user?.role} {t('dashboard.overview')}
          </h1>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.3em] mt-2">
            System Synchronized • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        

      </div>

      {/* Role-Specific Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isReceptionist ? (
          <>
            <QuickStat icon={UserPlus} label="Today's Registry" value={patients.length} sub="Verified Citizens" color="text-primary" />
            <QuickStat icon={Calendar} label="Appointments" value="12" sub="Next in 15m" color="text-indigo-500" />
            <QuickStat icon={History} label="Pending Requests" value={pendingRequestsCount} sub="Awaiting Admin" color="text-amber-500" highlight={pendingRequestsCount > 0} />
            <QuickStat icon={CircleDollarSign} label="Pending Bills" value="₹4,500" sub="Revenue Queue" color="text-emerald-500" />
          </>
        ) : (
          <>
            <QuickStat icon={Users} label="Patient Inflow" value={patients.length} sub="24h Window" color="text-blue-500" />
            <QuickStat icon={Activity} label="Recovery Rate" value="92%" sub="Global Index" color="text-emerald-500" />
            <QuickStat icon={Radio} label="Signals Feed" value="03" sub="Critical Alerts" color="text-orange-500" highlight />
            <QuickStat icon={Building2} label="Bed Capacity" value="84%" sub="Total Saturation" color="text-indigo-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Intelligence Panel */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className="glass-panel p-8 min-h-[400px] border-border/50 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Global Performance Index
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Real-time throughput analysis</p>
                </div>
                <div className="flex gap-2">
                   {['7D', '1M', '1Y'].map(f => (
                      <button key={f} className="px-3 h-8 rounded-lg bg-secondary text-[10px] font-black hover:bg-primary hover:text-white transition-all">{f}</button>
                   ))}
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Quick Actions (Role Aware) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 bg-primary/5 border-primary/20 space-y-4 group hover:bg-primary/10 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
                       <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-foreground uppercase tracking-tight">Quick Registration</h4>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 italic">Bypass standard queue</p>
                    </div>
                 </div>
                 <button className="w-full py-3 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                    Initialize Registry <ChevronRight className="w-4 h-4" />
                 </button>
              </div>

              <div className="glass-panel p-6 bg-indigo-500/5 border-indigo-500/20 space-y-4 group hover:bg-indigo-500/10 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                       <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-foreground uppercase tracking-tight">Settlement Rapid</h4>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 italic">Emergency billing node</p>
                    </div>
                 </div>
                 <button className="w-full py-3 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2">
                    Access Ledger <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* AI Signal Feed Teaser */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="glass-panel p-8 space-y-6 border-border/50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                 </div>
                 <h4 className="text-xs font-black text-foreground uppercase tracking-widest">Protocol Signal Feed</h4>
              </div>
              
              <div className="space-y-4">
                 <SignalItem title="Bed Allocation Approved" time="2m ago" level="Normal" />
                 <SignalItem title="Shift Handover Complete" time="15m ago" level="Normal" />
                 <SignalItem title="Critical Vitals: Ward 2" time="1h ago" level="Critical" />
              </div>

              <div className="pt-6 border-t border-border/50">
                 <button className="w-full py-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 rounded-xl transition-all flex items-center justify-center gap-2">
                    View System Alerts <ArrowUpRight className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="glass-panel p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 shadow-xl">
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.25em] mb-4">Ward Occupation</h4>
              <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-muted-foreground">General Inventory</span>
                       <span className="text-foreground">{genOccupied} / {generalBeds.length || 30}</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${(genOccupied / (generalBeds.length || 30)) * 100}%` }} />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-muted-foreground">Critical Care Hub</span>
                       <span className="text-foreground">{icuOccupied} / {icuBeds.length || 10}</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                       <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" style={{ width: `${(icuOccupied / (icuBeds.length || 10)) * 100}%` }} />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ icon: Icon, label, value, sub, color, highlight }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={cn(
      "glass-panel p-6 border-border/50 hover:border-primary/30 transition-all cursor-default relative overflow-hidden",
      highlight && "bg-primary/5 border-primary/20"
    )}
  >
     {highlight && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8 animate-pulse" />}
     <div className="flex items-center gap-4 mb-3">
        <div className={cn("p-2.5 rounded-xl bg-secondary border border-border shadow-sm", color)}>
           <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-tight">{label}</span>
     </div>
     <h3 className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{value}</h3>
     <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2 tracking-widest opacity-60 flex items-center gap-2">
        <div className={cn("w-1 h-1 rounded-full", highlight ? "bg-primary animate-ping" : "bg-muted-foreground/30")} />
        {sub}
     </p>
  </motion.div>
);

const SignalItem = ({ title, time, level }: any) => (
  <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
     <div className={cn(
       "w-2 h-2 rounded-full mt-1.5",
       level === 'Critical' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
     )} />
     <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-tighter">{title}</p>
        <p className="text-[9px] font-black text-muted-foreground uppercase opacity-60 tracking-widest mt-0.5">{time}</p>
     </div>
  </div>
);

const chartData = [
  { name: '08:00', value: 45 },
  { name: '10:00', value: 68 },
  { name: '12:00', value: 52 },
  { name: '14:00', value: 89 },
  { name: '16:00', value: 74 },
  { name: '18:00', value: 92 },
  { name: '20:00', value: 81 }
];
