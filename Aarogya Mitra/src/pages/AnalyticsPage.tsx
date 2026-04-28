import { cn } from '@/lib/utils';
import { 
  Users, 
  TriangleAlert,
  Server,
  BrainCircuit,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const severityData = [
  { name: 'Critical', value: 15, color: '#ef4444' },
  { name: 'Moderate', value: 45, color: '#f59e0b' },
  { name: 'Low', value: 40, color: '#10b981' },
];

const timelineData = [
  { hour: '00', cases: 5 },
  { hour: '04', cases: 2 },
  { hour: '08', cases: 12 },
  { hour: '12', cases: 18 },
  { hour: '16', cases: 25 },
  { hour: '20', cases: 30 },
  { hour: '23', cases: 22 },
];

const healthStats = [
  { label: 'Cloud Synchronicity', value: '99.98%', status: 'STABLE', icon: Server },
  { label: 'AI Inference Latency', value: '42ms', status: 'OPTIMAL', icon: BrainCircuit },
  { label: 'Active Signals', value: '1,204', status: '+12%', icon: Users },
  { label: 'Critical Thresholds', value: '24', status: 'WARN', icon: TriangleAlert },
];

export const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat) => (
          <div key={stat.label} className="glass-panel p-6 border-white/5 bg-slate-950/40">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <stat.icon className="w-5 h-5 text-blue-500" />
               </div>
                <span className={cn(
                  "text-xs font-bold px-3 py-1 rounded-lg tracking-widest",
                  stat.status === 'OPTIMAL' || stat.status === 'STABLE' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                )}>
                   {stat.status}
                </span>
             </div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-10 bg-secondary/20">
            <div className="flex items-center gap-3 mb-10">
               <PieIcon className="w-5 h-5 text-primary" />
               <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Case Distribution</h3>
            </div>
           <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={severityData}
                       cx="50%"
                       cy="50%"
                       innerRadius={70}
                       outerRadius={110}
                       paddingAngle={8}
                       dataKey="value"
                       stroke="none"
                    >
                       {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
               <div className="space-y-4 w-48">
                  {severityData.map((s) => (
                     <div key={s.name} className="flex items-center gap-4 group cursor-help">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: s.color, backgroundColor: s.color }} />
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{s.name}</span>
                           <span className="text-sm font-bold text-foreground">{s.value}% Load</span>
                        </div>
                     </div>
                  ))}
               </div>
           </div>
        </div>

        <div className="glass-panel p-10 bg-secondary/20">
            <div className="flex items-center gap-3 mb-10">
               <BarIcon className="w-5 h-5 text-primary" />
               <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Admissions Density</h3>
            </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="hour" stroke="#334155" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#334155" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                       cursor={{ fill: '#ffffff05' }}
                       contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Bar dataKey="cases" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} >
                       {timelineData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fillOpacity={0.4 + (index / 10)} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/10 flex items-center gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <RadioIcon className="w-32 h-32 text-blue-500" />
         </div>
         <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <TriangleAlert className="w-7 h-7 text-blue-400" />
         </div>
          <div className="flex-1">
             <p className="text-sm font-bold text-foreground uppercase tracking-widest">Advanced Predictive Intelligence</p>
             <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-2 leading-relaxed">
                BigQuery integration complete. Predictive analysis for incoming cases active. 
                Current surge probability: <span className="text-primary">14.2%</span>
             </p>
          </div>
          <button 
            onClick={() => toast.success('Running full dataset analysis...')}
            className="px-8 py-4 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-2xl shadow-primary/20"
          >
             Run Analysis
          </button>
      </div>
    </div>
  );
};

const RadioIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);
