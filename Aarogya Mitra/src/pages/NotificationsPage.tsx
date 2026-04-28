import { useMemo, useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  MoreHorizontal,
  Filter,
  Search,
  CheckCheck,
  Radio,
  Phone,
  Trash2,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { toast } from 'react-hot-toast';
import { Send, X, Navigation, Map as MapIcon, Globe } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '@/firebase';
import { GoogleMapsView } from '@/components/GoogleMapsView';

export const NotificationsPage = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    user,
    createNotification,
    deleteNotification,
    cases
  } = useAarogyaData();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<'HS' | 'AR'>('AR');
  const [showSendModal, setShowSendModal] = useState(false);
  const [trackedLocation, setTrackedLocation] = useState<{lat: number, lng: number, name?: string} | null>(null);
  const [selectedNotifForDetails, setSelectedNotifForDetails] = useState<any | null>(null);
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  
  // Auto-clear read status when viewing the logs
  useEffect(() => {
    if (notifications.some(n => !n.is_read)) {
      markAllNotificationsRead();
    }
  }, [notifications.length]); // Re-run when new signals arrive while on the page

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesRead = filter === 'all' || !n.is_read;
      const matchesPriority = priorityFilter === 'all' || n.type === priorityFilter;

      // Admin sees everything (filtered by tab/category), others see their role-specific signals
      const userRole = user?.role?.toLowerCase();
      const notifRole = n.role?.toLowerCase();
      const matchesRole = isAdmin || (notifRole === userRole || notifRole === 'all');
      
      const matchesCategory = !isAdmin || n.category === activeCategory;
      
      return matchesRead && matchesPriority && matchesRole && matchesCategory;
    });
  }, [notifications, filter, priorityFilter, activeCategory, isAdmin, user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'urgent': return <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success('All notifications marked as read');
  };

  const calculateDistanceAndTime = (loc: {lat: number, lng: number} | null) => {
    if (!loc) return { dist: '0 km', time: '0 min' };
    
    // Hospital fixed location (Anand Nagar Center for this demo)
    const center = {
      lat: 19.8671,
      lng: 75.3444
    };
    
    // Haversine-ish approximate distance
    const dy = 111.32 * (loc.lat - center.lat);
    const dx = 111.32 * Math.cos(center.lat * (Math.PI / 180)) * (loc.lng - center.lng);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // ETA based on 40km/h ambulance speed + 2 min prep
    const eta = Math.round((distance / 40) * 60) + 2;
    
    return {
      dist: distance.toFixed(1) + ' km',
      time: eta + ' min'
    };
  };

  const stats = calculateDistanceAndTime(trackedLocation);

  const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const target = formData.get('target') as string;
    const title = formData.get('title') as string;
    const message = formData.get('message') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;

    if (!title || !message) {
      toast.error('Signal Title and Payload are required');
      return;
    }

    // Attempt propagation
    try {
      await createNotification({
        role: target,
        title,
        message,
        type,
        category
      });
      // Close modal on success
      setShowSendModal(false);
    } catch (err: any) {
      // Errors are handled by the context/toast, but we keep modal open for correction if needed
      console.warn("Signal UI flow interrupted", err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-widest leading-none">Notifications</h2>
          <p className="text-xs text-muted-foreground font-semibold tracking-wide mt-2">
            Stay updated with real-time hospital activities.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {isAdmin && (
            <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border transition-colors">
              {[
                { id: 'HS', label: 'HS Notify' },
                { id: 'AR', label: 'AR Notify' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeCategory === tab.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === 'all' ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                filter === 'unread' ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>
          
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-[10px] font-bold uppercase rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 transition-all"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>

          {isAdmin && (
            <button 
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="w-4 h-4" /> Send Signal
            </button>
          )}
          <button 
            onClick={async () => {
              try {
                const testRef = await addDoc(collection(db, 'notifications'), {
                  title: 'CONNECTION HANDSHAKE',
                  message: 'Realtime Link Established.',
                  role: 'All',
                  type: 'success',
                  category: 'HS',
                  timestamp: serverTimestamp()
                });
                toast.success('Firebase Link Verified');
                console.log("Test signal sent, ID:", testRef.id);
              } catch (e: any) {
                console.error("FIREBASE FAIL:", e.message);
                toast.error("Firebase Error: See Console");
              }
            }}
            className="p-2 bg-secondary rounded-lg border border-border"
            title="Force Signal Sync"
          >
            <Radio className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-panel p-0 overflow-hidden border-white/5">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !notif.is_read && markNotificationRead(notif.id)}
                  className={cn(
                    "p-6 flex gap-4 hover:bg-secondary/30 transition-all cursor-pointer group relative",
                    !notif.is_read ? "bg-primary/5" : ""
                  )}
                >
                  <div className="shrink-0 mt-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                      !notif.is_read ? "bg-card shadow-sm border-primary/20" : "bg-secondary/50 border-border"
                    )}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={cn(
                        "text-sm font-bold uppercase tracking-tight",
                        !notif.is_read ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {notif.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed",
                      !notif.is_read ? "text-slate-300" : "text-slate-500"
                    )}>
                      {notif.message}
                    </p>
                    
                    {!notif.is_read && (
                      <div className="absolute top-6 right-6 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotifForDetails(notif);
                        }}
                        className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-[2rem] bg-secondary flex items-center justify-center border border-dashed border-border">
                <Bell className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-widest">No Notifications Found</h4>
                <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-tight">You're all caught up for today!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AR Live Tracking Map (Only for AR Notify tab) */}
      <AnimatePresence>
        {isAdmin && activeCategory === 'AR' && (
          <motion.div
            id="tracking-map-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                     <MapIcon className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">Aarogya Response Tracking</h3>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg border border-border">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{cases.length} Live Signals</span>
               </div>
            </div>
            
            <div className="glass-panel p-2 h-[600px] border-white/5 bg-slate-950/50 relative">
               <GoogleMapsView 
                markers={trackedLocation ? [{ lat: trackedLocation.lat, lng: trackedLocation.lng, id: 'tracked-node' }] : 
                        (cases.filter(c => c.location).length > 0 ? 
                          [{ lat: cases.filter(c => c.location)[0].location!.lat, lng: cases.filter(c => c.location)[0].location!.lng, id: 'latest-node' }] : 
                          [])} 
                initialCenter={trackedLocation ? { lat: trackedLocation.lat, lng: trackedLocation.lng } : undefined}
                label={trackedLocation ? `TRACKING: ${trackedLocation.name}` : undefined}
               />
               
               {/* Overlay Stats */}
               <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4 pointer-events-none">
                  {[
                    { label: 'Active Alerts', val: cases.length, icon: Globe },
                    { label: 'Avg ETA', val: stats.time, icon: Clock },
                    { label: 'Distance', val: stats.dist, icon: Navigation }
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                       <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-xs font-black text-white uppercase">{stat.val}</p>
                       </div>
                       <stat.icon className="w-4 h-4 text-primary opacity-50" />
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Signal Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-md rounded-[2rem] border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/50">
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
                   <Send className="w-5 h-5 text-primary" /> Broadcast Signal
                </h3>
                <button onClick={() => setShowSendModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form className="p-6 space-y-4" onSubmit={handleSendNotification}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Broadcast Channel</label>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { id: 'HS', label: 'Hospital System (HS)' },
                       { id: 'AR', label: 'Aarogya Response (AR)' }
                     ].map(cat => (
                       <label key={cat.id} className="relative group cursor-pointer">
                          <input type="radio" name="category" value={cat.id} defaultChecked={cat.id === 'AR'} className="peer sr-only" />
                          <div className="p-3 border border-border rounded-xl text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:border-primary/30">
                            <span className="text-[10px] font-bold uppercase tracking-tight">{cat.label}</span>
                          </div>
                       </label>
                     ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Node(s)</label>
                  <select name="target" required className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                    <option value="Doctor">Clinical Staff (Doctor)</option>
                    <option value="Receptionist">Front Desk (Receptionist)</option>
                    <option value="All">All Authorized Terminals</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signal Title</label>
                  <input name="title" required type="text" placeholder="e.g. MAINTENANCE ALERT" className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message Payload</label>
                  <textarea name="message" required rows={3} placeholder="Enter broadcast details..." className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Signal Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'info', label: 'Info', color: 'bg-blue-500' },
                      { val: 'warning', label: 'Warn', color: 'bg-amber-500' },
                      { val: 'urgent', label: 'Urgent', color: 'bg-red-500' }
                    ].map(type => (
                      <label key={type.val} className="relative group cursor-pointer">
                        <input type="radio" name="type" value={type.val} defaultChecked={type.val === 'info'} className="peer sr-only" />
                        <div className="p-2 border border-border rounded-xl text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:border-primary/30">
                          <span className="text-[10px] font-bold uppercase tracking-tight">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowSendModal(false)} className="flex-1 py-3 bg-secondary text-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/70 transition-all border border-border">
                    Abort
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Propagate Signal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest">System Filters</h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mb-6 uppercase tracking-tight">
            Enable or disable specific notification categories for your terminal.
          </p>
          <div className="space-y-3">
             {[
               { id: 'all', label: 'All Signals', type: 'all' },
               { id: 'urgent', label: 'Emergency (Urgent)', type: 'urgent' },
               { id: 'warning', label: 'System Alerts (Warn)', type: 'warning' },
               { id: 'info', label: 'General Info', type: 'info' }
             ].map(item => (
               <div 
                 key={item.id} 
                 onClick={() => setPriorityFilter(item.type)}
                 className={cn(
                   "flex items-center justify-between p-3 bg-card border rounded-xl cursor-pointer transition-all",
                   priorityFilter === item.type ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                 )}
               >
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter",
                    priorityFilter === item.type ? "text-primary" : "text-muted-foreground"
                  )}>{item.label}</span>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-all",
                    priorityFilter === item.type ? "bg-primary" : "bg-secondary"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                      priorityFilter === item.type ? "right-1" : "left-1"
                    )} />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel p-6 border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Search className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Global Archives</h3>
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mb-6 uppercase tracking-tight">
              Access the complete history of system broadcasts and individual logs.
            </p>
          </div>
          <button className="w-full py-4 bg-secondary border border-border text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-foreground hover:text-background transition-all">
            View Full Archives
          </button>
        </div>
      </div>
      {/* Notification Details Modal */}
      <AnimatePresence>
        {selectedNotifForDetails && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                    <AlertCircle className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-foreground">Critical Intelligence</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Handled by: Aarogya Response</p>
                  </div>
                </div>
                <button onClick={() => setSelectedNotifForDetails(null)} className="p-2 text-muted-foreground hover:text-foreground bg-secondary/50 rounded-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Patient Profile Snapshot */}
                <div className="glass-panel p-6 bg-slate-900/40 border-white/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">
                           {selectedNotifForDetails.title?.includes('ADITYA') || selectedNotifForDetails.message?.includes('Aditya') ? 'Aditya Karodiwal' : 'Emergency Patient'}
                        </h4>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">ID: {selectedNotifForDetails.patient_id || 'AM-RE-9102'}</p>
                      </div>
                    </div>
                    {selectedNotifForDetails.patient_phone && (
                      <a 
                        href={`tel:${selectedNotifForDetails.patient_phone}`}
                        className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                      >
                         <Phone className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Blood', val: selectedNotifForDetails.blood_group || 'O+' },
                        { label: 'Age', val: selectedNotifForDetails.age || '24' },
                        { label: 'Weight', val: selectedNotifForDetails.weight || '72kg' },
                        { label: 'Height', val: selectedNotifForDetails.height || '180cm' }
                      ].map(stat => (
                        <div key={stat.label} className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center">
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                           <p className="text-[10px] font-black text-slate-900 uppercase">{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Signal Payload</p>
                      <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                        "{selectedNotifForDetails.message}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Health Pulse</p>
                         <p className="text-xs font-bold text-slate-900 truncate">{selectedNotifForDetails.health_summary?.split(',')[0] || 'Heart Rate: Normal'}</p>
                      </div>
                      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Level</p>
                         <p className="text-xs font-black text-red-600 uppercase tracking-tighter">Extreme Critical</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedNotifForDetails(null)}
                    className="flex-1 py-4 bg-secondary text-foreground text-xs font-black uppercase tracking-widest rounded-2xl border border-border hover:bg-white/5 transition-all"
                  >
                    Close Log
                  </button>
                  {selectedNotifForDetails.location && (
                    <button 
                      onClick={() => {
                        setActiveCategory('AR');
                        const pName = selectedNotifForDetails.title?.includes('ADITYA') || selectedNotifForDetails.message?.includes('Aditya') ? 'Aditya Karodiwal' : 'Emergency Patient';
                        setTrackedLocation({ ...selectedNotifForDetails.location, name: pName });
                        setSelectedNotifForDetails(null);
                        toast.success("Initializing tracking sequence...");
                        setTimeout(() => {
                          document.getElementById('tracking-map-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex-[2] py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                    >
                      <Navigation className="w-4 h-4" /> Start Live Tracking
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
