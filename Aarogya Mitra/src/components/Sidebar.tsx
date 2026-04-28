import { 
  Hospital, 
  Activity, 
  CreditCard, 
  Users,
  ShieldCheck,
  Radio,
  Terminal,
  LayoutGrid,
  Calendar,
  UserPlus,
  Stethoscope,
  Ticket,
  Bell,
  Globe,
  Truck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAarogyaData } from '@/hooks/useAarogyaData';

interface SidebarProps {
  user?: { id: string; name: string; role: string } | null;
  onLogout?: () => void;
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { notifications } = useAarogyaData();
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const allMenuItems = [
    { icon: Terminal, label: t('nav.standard_dashboard'), path: '/dashboard', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { icon: Stethoscope, label: t('nav.clinical_hub'), path: '/clinical-hub', roles: ['Doctor'] },
    { icon: Radio, label: t('nav.signals_feed'), path: '/command-center', roles: ['Admin'] },
    { icon: Globe, label: t('nav.live_map_view'), path: '/map-view', roles: ['Admin'] },
    { icon: Bell, label: t('nav.notification'), path: '/notifications', roles: ['Admin', 'Doctor', 'Receptionist'], badge: unreadCount },
    { icon: UserPlus, label: t('nav.patient_registry'), path: '/patients', roles: ['Receptionist'] },
    { icon: Ticket, label: t('nav.registry_queue'), path: '/queue', roles: ['Receptionist'] },
    { icon: Calendar, label: t('nav.clinical_scheduler'), path: '/appointments', roles: ['Receptionist'] },
    { icon: LayoutGrid, label: t('nav.bed_allocation_requests'), path: '/bed-management', roles: ['Admin', 'Receptionist'] },
    { icon: Truck, label: 'Ambulance', path: '/ambulance', roles: ['Admin', 'Receptionist'] },
    { icon: Hospital, label: t('nav.system_infrastructure'), path: '/hms', roles: ['Admin'] },
    { icon: CreditCard, label: t('nav.billing_gateway'), path: '/billing', roles: ['Admin', 'Receptionist'] },
    { icon: Activity, label: t('nav.vitals_analytics'), path: '/analytics', roles: ['Admin'] },
    { icon: Users, label: t('nav.staff_personnel'), path: '/staff', roles: ['Admin'] },
  ];

  const menuItems = allMenuItems.filter(item => 
    !user || item.roles.some(role => role.toLowerCase() === user.role?.toLowerCase())
  );

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 shadow-inner overflow-hidden">
            <img src="/favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Aarogya</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Mitra System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-6">
          <div className="px-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-50">Authorized Modules</p>
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span className="text-[13px] font-medium tracking-tight flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-lg">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="p-6 space-y-4">

        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2"
          >
            Terminal Disconnect
          </button>
        )}

        <div className="bg-secondary p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] font-bold text-foreground tracking-tight uppercase">Identity Stack</span>
             <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
            Name: <span className="text-foreground">{user?.name}</span><br/>
            Role: <strong className="text-primary uppercase tracking-tighter">{user?.role}</strong>
          </p>
        </div>


      </div>
    </div>
  );
};
