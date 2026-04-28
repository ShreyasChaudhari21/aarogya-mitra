import { useState } from 'react';
import { Search, Bell, UserCircle, PlusCircle, Sun, Moon, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAarogyaData } from '@/hooks/useAarogyaData';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

interface TopbarProps {
  onAddCase: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Topbar = ({ onAddCase, isDarkMode, onToggleTheme }: TopbarProps) => {
  const { searchQuery, setSearchQuery, user, setUser, notifications, syncStatus } = useAarogyaData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi / हिंदी', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi / मराठी', native: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil / தமிழ்', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada / ಕನ್ನಡ', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam / മലയാളം', native: 'മലയാളം', flag: '🇮🇳' }
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangMenu(false);
  };
  const unreadNotifications = notifications.filter(n => !n.is_read).slice(0, 5);


  return (
    <div className="h-20 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-40 px-10 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <div className="flex items-center gap-3">
           <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain" />
           <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-r border-border pr-8 whitespace-nowrap">Centralized Node</span>
        </div>
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('topbar.search_placeholder')} 
            className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">


        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-3 bg-secondary rounded-xl border border-border text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
          >
            <span className="text-sm">{languages.find(l => l.code === i18n.language)?.flag || '🌐'}</span>
            <span>{i18n.language?.toUpperCase()}</span>
          </button>
          
          <AnimatePresence>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowLangMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-card border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-2 z-[100] backdrop-blur-2xl"
                >
                  <div className="px-3 py-2 mb-1 border-b border-border/50">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Select Terminal Language</p>
                  </div>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all mb-0.5",
                        i18n.language === lang.code 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center justify-center w-6 h-6 bg-secondary/50 rounded-lg text-xs">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.name}</span>
                      {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={onToggleTheme}
          className="p-3 bg-secondary rounded-xl border border-border text-muted-foreground hover:text-foreground transition-all hover:bg-secondary/80"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>

        <div className="flex items-center gap-6 border-x border-border px-6 mx-2">
           <div className="flex flex-col items-start">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Cloud Network Status</span>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                      syncStatus === 'SYNCED' ? "bg-emerald-500" : 
                      syncStatus === 'PENDING' ? "bg-amber-500 animate-pulse" : "bg-red-500"
                    )} />
                    <span className="text-[10px] font-black text-foreground tracking-tighter uppercase">Firebase Live</span>
                 </div>
              </div>
           </div>

        </div>

        {location.pathname === '/command-center' && (
          <button 
            onClick={onAddCase}
            className="h-11 flex items-center gap-2 bg-foreground text-background px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-xl hover:bg-primary hover:text-white active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            {t('topbar.new_admission')}
          </button>
        )}

        <div className="w-px h-8 bg-border mx-2" />

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-secondary rounded-xl border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.is_read) && (
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                   className="absolute top-full right-0 mt-4 w-80 glass-panel p-4 shadow-3xl bg-card border-primary/20"
                >
                   <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5" /> High Priority Feed
                   </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {unreadNotifications.length > 0 ? (
                        unreadNotifications.map(n => (
                          <div key={n.id} className="p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all group cursor-pointer">
                             <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">{n.title}</span>
                                <div className={cn("w-1.5 h-1.5 rounded-full mt-1", n.type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-primary')} />
                             </div>
                             <p className="text-[9px] text-muted-foreground font-medium italic truncate">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase">No new signals</p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/notifications");
                      }}
                      className="w-full mt-4 py-2 text-[8px] font-black uppercase text-primary border-t border-border pt-4 text-center hover:underline"
                    >
                      View All Notifications
                    </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 pl-4 group border-l border-border">
            <div className="text-right flex flex-col items-end">
              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tighter uppercase">{user?.name || 'Authorized Personnel'}</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{user?.role || 'Restricted Access'}</p>
            </div>
            <div className="relative w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center border border-border shadow-md group-hover:border-primary/50 transition-all group/p">
              <UserCircle className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
              <div 
                onClick={() => setUser(null)}
                className="absolute inset-0 bg-red-500 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover/p:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
              >
                 <LogOut className="w-5 h-5 text-white" />
                 <span className="text-[8px] font-black text-white uppercase mt-1">Exit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
