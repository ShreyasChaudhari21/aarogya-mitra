import { useState } from 'react';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { GoogleMapsView } from '@/components/GoogleMapsView';
import { motion } from 'framer-motion';
import { Navigation, Globe, Activity, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MapView = () => {
  const { cases } = useAarogyaData();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const activeCases = cases.filter(c => c.status !== 'Completed' && c.status !== 'Cancelled' && c.location);
  
  const mapMarkers = activeCases.map(c => ({
      lat: c.location!.lat,
      lng: c.location!.lng,
      id: c.id
    }));

  const activeCount = activeCases.length;
  
  const selectedCase = activeCases.find(c => c.id === selectedCaseId);
  const routeTo = selectedCase?.location ? { lat: selectedCase.location.lat, lng: selectedCase.location.lng } : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 p-1 overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
             <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest leading-none">Global Satellite Tracking</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60 italic">Real-time geospatial health orchestration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase">{activeCount} ACTIVE SIGNALS</span>
           </div>
           <div className="px-4 py-2 bg-secondary border border-border rounded-xl flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">NODE_SYNC: LIVE</span>
           </div>
        </div>
      </div>

      <div className="flex-1 relative glass-panel p-2 overflow-hidden border-white/5 bg-slate-950/50 group">
         <GoogleMapsView markers={mapMarkers} label="Aarogya Mitra Global Node Network" routeTo={routeTo} />
         
         {/* Overlay Hud */}
         <div className="absolute top-6 left-6 max-w-xs space-y-4 pointer-events-none group-hover:pointer-events-auto">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto"
            >
               <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Network Intelligence
               </h3>
               <div className="space-y-3">
                  {activeCases.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCaseId(c.id === selectedCaseId ? null : c.id)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                        c.id === selectedCaseId 
                          ? "bg-primary/20 border-primary" 
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      )}
                    >
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {c.id.substr(0, 8)}
                          </p>
                          <p className="text-[11px] font-bold text-white uppercase">{c.patientName}</p>
                       </div>
                       <div className={cn(
                         "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                         c.priority === 'Critical' ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                       )}>
                         {c.priority}
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
         </div>

         <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-none">
            {[
               { label: 'Cloud Latency', val: '1.2ms', icon: Clock, color: 'text-emerald-500' },
               { label: 'Active Personnel', val: '24 Units', icon: Activity, color: 'text-primary' },
               { label: 'Node Saturation', val: '14.2%', icon: Globe, color: 'text-indigo-500' },
               { label: 'Safety Index', val: 'OPTIMAL', icon: ShieldCheck, color: 'text-emerald-400' }
            ].map((stat, i) => (
               <motion.div 
                 key={stat.label}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center justify-between"
               >
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                     <p className={cn("text-xs font-black uppercase", stat.color)}>{stat.val}</p>
                  </div>
                  <stat.icon className={cn("w-4 h-4 opacity-30", stat.color)} />
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};
