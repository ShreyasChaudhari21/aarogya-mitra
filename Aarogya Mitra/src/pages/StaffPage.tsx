import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ShieldCheck,
  Stethoscope,
  Activity,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAarogyaData } from '@/hooks/useAarogyaData';

export const StaffPage = () => {
  const { searchQuery, setSearchQuery, staff, addStaff } = useAarogyaData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Doctor');
  const [newDept, setNewDept] = useState('General medicine');

  const addNode = async () => {
    if (!newName) return;
    await addStaff({
      name: newName,
      role: newRole,
      dept: newDept,
      status: 'ON_DUTY'
    });
    setNewName('');
    setShowAddForm(false);
  };

  const filteredStaff = staff.filter(s => 
    String(s.name || '').toLowerCase().includes(String(searchQuery || '').toLowerCase()) || 
    String(s.dept || s.department || '').toLowerCase().includes(String(searchQuery || '').toLowerCase()) ||
    String(s.role || '').toLowerCase().includes(String(searchQuery || '').toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground leading-none">Staff Management</h2>
          <p className="text-xs text-muted-foreground font-semibold mt-2">Manage medical personnel and duties</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold tracking-tight text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Personnel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Personnel', value: staff.filter(s => s.status === 'ON_DUTY' || s.status === 'Active').length, icon: Users, color: 'blue' },
          { label: 'Duty Coverage', value: '94%', icon: Activity, color: 'emerald' },
          { label: 'On Standby', value: '12', icon: Clock, color: 'amber' },
          { label: 'Security Level', value: 'Authorized', icon: ShieldCheck, color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden border-border bg-slate-950/20">
        <div className="overflow-x-auto text-foreground">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Personnel</th>
                <th className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Role & Dept</th>
                <th className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Duty Status</th>
                <th className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence mode="popLayout">
                {filteredStaff.map((person) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={person.id} 
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary font-bold shadow-lg uppercase">
                          {(person.name || 'S').split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">{person.name || 'Staff Member'}</p>
                          <p className="text-xs text-muted-foreground font-semibold mt-0.5">{person.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold uppercase tracking-tight">{person.role || 'Personnel'}</p>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                         <Stethoscope className="w-3.5 h-3.5" /> {person.dept || 'Standard'}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border",
                          person.status === 'ON_DUTY' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          person.status === 'ON_BREAK' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-slate-500/10 text-muted-foreground border-slate-500/20"
                        )}>
                        {(person.status || 'ON_DUTY').toString().replace('_', ' ')}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold tabular-nums text-muted-foreground">{person.phone || ''}</span>
                          <span className="text-xs font-bold text-muted-foreground">{person.email || ''}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toast.success(`Managing directives for ${person.name}`)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-md glass-panel p-8"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold text-foreground uppercase tracking-widest">Add Personnel</h3>
                   <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter staff name..."
                        className="w-full bg-secondary border border-border rounded-xl p-4 text-sm font-bold tracking-tight text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Designation</label>
                      <select 
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl p-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      >
                         <option value="Doctor">Doctor</option>
                         <option value="Nurse">Nurse</option>
                         <option value="Receptionist">Receptionist</option>
                         <option value="Admin">Admin</option>
                         <option value="Paramedic">Paramedic</option>
                         <option value="Specialist">Specialist</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Department</label>
                      <select 
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl p-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      >
                         <option>General medicine</option>
                         <option>Cardiology</option>
                         <option>Neurology</option>
                         <option>Orthopedics</option>
                         <option>Pediatrics</option>
                         <option>Radiology</option>
                      </select>
                   </div>
                   <button 
                     onClick={addNode}
                     className="w-full py-4 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-primary/90 transition-all active:scale-95"
                   >
                     Complete Registration
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
