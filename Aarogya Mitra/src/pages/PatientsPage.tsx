import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  User, 
  Filter, 
  Plus,
  Database,
  Loader2,
  Edit2,
  Trash2,
  LayoutGrid
} from 'lucide-react';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { toast } from 'react-hot-toast';

export const PatientsPage = () => {
  const { patients, addPatient, loading } = useAarogyaData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPatients = patients.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (p.id?.toString() || '').includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.age) return;
    
    setIsSubmitting(true);
    try {
      await addPatient({
        name: newPatient.name.toUpperCase(),
        age: parseInt(newPatient.age),
        gender: newPatient.gender,
      });
      toast.success('Patient Registered Successfully');
      setNewPatient({ name: '', age: '', gender: 'Male', phone: '' });
      setShowAddModal(false);
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (p: any) => {
    setEditingPatient(p);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Patient Registry</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Centralized Citizen Health Data Management
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Register New Patient
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border-primary/20">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <User className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black text-foreground tabular-nums">{patients.length}</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Registered</span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-2 border-indigo-500/20">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <LayoutGrid className="w-6 h-6 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-foreground">12</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Wards Covered</span>
        </div>

        <div className="md:col-span-2 glass-panel p-6 relative flex items-center">
          <Search className="absolute left-10 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="SEARCH PATIENT BY NAME OR SYSTEM ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-50"
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black text-foreground uppercase tracking-widest">Verified Citizen Logs</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sequence: AUTO</span>
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/10">
                <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Profile</th>
                <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Metrics</th>
                <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Internal UID</th>
                <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinical Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Synchronizing Registry...</span>
                  </td>
                </tr>
              ) : filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-border/30 hover:bg-secondary/20 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20 flex items-center justify-center text-primary font-black text-sm uppercase">
                        {patient.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-tight">{patient.name || 'Unknown Patient'}</div>
                        <div className="text-[9px] font-medium text-muted-foreground mt-0.5 uppercase tracking-widest">Verified Hospital Record</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-secondary text-foreground text-[9px] font-black rounded uppercase tracking-tighter border border-border">
                         {patient.gender}
                       </span>
                       <span className="text-xs font-bold text-muted-foreground">{patient.age} YRS</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-mono font-black text-primary/80 uppercase">#{String(patient.id).padStart(6, '0')}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 px-2">
                      <button onClick={() => startEdit(patient)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
                      <Database className="w-12 h-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Match in Global Hub</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(showAddModal || editingPatient) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddModal(false); setEditingPatient(null); }} className="absolute inset-0 bg-background/80" />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-lg glass-panel p-0 overflow-hidden shadow-3xl border-primary/20 bg-card">
              <div className="p-8 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3 italic">
                  <UserPlus className="text-primary" /> {editingPatient ? 'Update Profile' : 'Register New Citizen'}
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Legal data entry for medical synchronization</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all" 
                        placeholder="E.G. ADITYA KARODIWAL"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Recorded Age</label>
                        <input 
                          type="number" 
                          required
                          value={newPatient.age}
                          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 transition-all" 
                          placeholder="0-120"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Biological Gender</label>
                        <select 
                          value={newPatient.gender}
                          onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-black uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingPatient(null); }} className="flex-1 px-6 py-4 bg-secondary text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all">Abort</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Finalize Registry</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
