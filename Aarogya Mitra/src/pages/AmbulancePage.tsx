import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CheckCircle, Clock, MapPin, Phone, X, Navigation, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import type { Ambulance } from '@/context/AarogyaContext';
import { GoogleMapsView } from '@/components/GoogleMapsView';

export const AmbulancePage = () => {
  const { ambulances, updateAmbulanceStatus } = useAarogyaData();
  const [activeSection, setActiveSection] = useState<string>('Main Gate');
  const [deployModalId, setDeployModalId] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  const [deployDetails, setDeployDetails] = useState({
    destination: '',
    patientName: '',
    priority: 'High'
  });

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (deployModalId) {
      updateAmbulanceStatus(deployModalId, 'On Route');
      toast.success(`Ambulance ${deployModalId} deployed to ${deployDetails.destination}`);
      setDeployModalId(null);
      setDeployDetails({ destination: '', patientName: '', priority: 'High' });
    }
  };

  const sections = ['Main Gate', 'Emergency Entrance', 'Rear Gate'].map(name => ({
    name,
    ambulances: ambulances.filter(a => a.section === name)
  }));

  const currentSection = sections.find(s => s.name === activeSection);

  const getStatusColor = (status: Ambulance['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'On Route': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Maintenance': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: Ambulance['status']) => {
    switch (status) {
      case 'Available': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'On Route': return <MapPin className="w-3.5 h-3.5" />;
      case 'Maintenance': return <Clock className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 pb-32 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Ambulance Fleet
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Real-time status and deployment of emergency vehicles.</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {sections.map((section) => (
          <button
            key={section.name}
            onClick={() => setActiveSection(section.name)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300",
              activeSection === section.name
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground"
            )}
          >
            {section.name}
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-foreground/10">
              {section.ambulances.length}
            </span>
          </button>
        ))}
      </div>

      {/* Ambulance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSection?.ambulances.map((amb, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={amb.id}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-primary/30 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div className={cn("px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5", getStatusColor(amb.status))}>
                {getStatusIcon(amb.status)}
                {amb.status}
              </div>
            </div>

            <div className="mb-6 space-y-1">
              <h3 className="text-xl font-black text-foreground tracking-tight">{amb.id}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Reg: {amb.regNumber}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <span className="text-xs font-black">{amb.driverName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Driver</p>
                  <p className="text-sm font-bold text-foreground">{amb.driverName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contact</p>
                  <p className="text-sm font-bold text-foreground">{amb.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <span className="text-xs font-black">🏥</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</p>
                  <p className="text-sm font-bold text-foreground">{amb.type} Ambulance</p>
                </div>
              </div>
            </div>

            {amb.status === 'Available' && (
              <button 
                onClick={() => setDeployModalId(amb.id)}
                className="w-full mt-6 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 group-hover:shadow-lg transition-all"
              >
                Deploy Now <Truck className="w-3.5 h-3.5" />
              </button>
            )}

            {amb.status === 'On Route' && (
              <button 
                onClick={() => {
                  updateAmbulanceStatus(amb.id, 'Available');
                  toast.success(`Ambulance ${amb.id} has been recalled.`);
                }}
                className="w-full mt-6 py-3 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 group-hover:shadow-lg transition-all"
              >
                Call Back <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
      {/* Deploy Modal */}
      <AnimatePresence>
        {deployModalId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeployModalId(null)}
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
                    <Navigation className="text-primary" /> Dispatch Protocol
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Deploying {deployModalId}</p>
                </div>
                <button onClick={() => setDeployModalId(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleDeploy} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Target Destination</label>
                    <button 
                      type="button"
                      onClick={() => {
                        setTempLocation(deployDetails.destination);
                        setShowMapModal(true);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight transition-all",
                        deployDetails.destination 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      <span className="truncate">{deployDetails.destination || "SELECT TARGET ON MAP..."}</span>
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Patient Name (Optional)</label>
                    <input 
                      value={deployDetails.patientName}
                      onChange={(e) => setDeployDetails({ ...deployDetails, patientName: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="ENTER PATIENT NAME..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Priority Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setDeployDetails({ ...deployDetails, priority: p })}
                          className={cn(
                            "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            deployDetails.priority === p 
                              ? (p === 'High' ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20" : 
                                 p === 'Medium' ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" :
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
                  <button type="button" onClick={() => setDeployModalId(null)} className="flex-1 py-4 bg-secondary text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Confirm Dispatch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMapModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-4xl h-[80vh] flex flex-col glass-panel p-0 overflow-hidden bg-card border-primary/20 shadow-2xl"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-card z-10 relative">
                <div className="flex-1 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Interactive Route Map</h2>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {tempLocation ? "Target Acquired" : "Awaiting Coordinates..."}
                     </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMapModal(false)} className="px-4 py-3 bg-secondary text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all">Cancel</button>
                  <button 
                    onClick={() => {
                      if (!tempLocation) {
                        toast.error("Please search and select a location on the map first");
                        return;
                      }
                      setDeployDetails({ ...deployDetails, destination: tempLocation });
                      setShowMapModal(false);
                      toast.success("Location Locked");
                    }} 
                    className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative bg-slate-900">
                <GoogleMapsView 
                   label="Deploy Target Setup" 
                   enableSearch 
                   onLocationSelect={(address) => setTempLocation(address)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
