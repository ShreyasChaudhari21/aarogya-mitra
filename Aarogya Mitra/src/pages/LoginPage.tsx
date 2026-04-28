import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Stethoscope, 
  Users, 
  Activity, 
  AlertCircle, 
  Mail, 
  ChevronRight,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Zap,
  Info,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth, db, doc, googleProvider, signInWithPopup } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { initializeFirebaseUsers } from '../scripts/initFirebase';

export const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [activeRole, setActiveRole] = useState<'Admin' | 'Doctor' | 'Receptionist'>('Admin');
  const [selectedDoctor, setSelectedDoctor] = useState<'Aditi' | 'Khanna'>('Aditi');
  const [email, setEmail] = useState('admin@aarogya.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    switch(activeRole) {
      case 'Admin':
        setEmail('admin@aarogya.com');
        setPassword('admin123');
        break;
      case 'Doctor':
        if (selectedDoctor === 'Aditi') {
          setEmail('aditi@aarogya.com');
          setPassword('doctor123');
        } else {
          setEmail('khanna@aarogya.com');
          setPassword('khanna123');
        }
        break;
      case 'Receptionist':
        setEmail('reception@aarogya.com');
        setPassword('reception123');
        break;
    }
  }, [activeRole, selectedDoctor]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      let userData: any;
      let uid: string;

      if (isSignUp) {
        if (!name.trim()) throw new Error("Full name is required for registration.");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        userData = {
          name: name.trim(),
          role: activeRole,
          email: email,
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", uid), userData);
        toast.success(`Account Created: ${userData.name}`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) throw new Error("Security profile not found.");
        
        userData = userDoc.data();
        if (userData.role.toLowerCase() !== activeRole.toLowerCase()) {
          throw new Error(`Profile mismatch: You are not registered as ${activeRole}`);
        }
        toast.success(`Welcome back, ${userData.name}`);
      }
      
      onLogin({ ...userData, id: uid });
    } catch (err: any) {
      toast.error(err.message || 'Verification failed.', { icon: '🔐' });
      setIsAuthenticating(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      
      if (!userDoc.exists()) {
        throw new Error("Security profile not found for this Google account.");
      }
      
      const userData = userDoc.data();
      if (userData.role.toLowerCase() !== activeRole.toLowerCase()) {
        throw new Error(`Profile mismatch: You are not registered as ${activeRole}`);
      }
      
      toast.success(`Welcome back, ${userData.name}`);
      onLogin({ ...userData, id: uid });
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.', { icon: '🌐' });
      setIsAuthenticating(false);
    }
  };

  const adminFeatures = [
    "Emergency Command Center (3-column live view)",
    "Live Google Maps + Ambulance Dispatch",
    "Bed Management System",
    "Gemini AI Triage Insights",
    "Regional Language Support (Hindi, Marathi)"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-6 lg:px-12 font-outfit overflow-y-auto">
      {/* Background elements for depth */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="flex flex-col items-center mb-16 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <img src="/favicon.png" alt="Aarogya Mitra Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Aarogya <span className="text-primary">Mitra</span></h1>
        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">AI-Powered Emergency Coordination</p>
        <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Google Solution Challenge 2025</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-7xl space-y-12 relative z-10">
        
        {/* Evaluator Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/90 backdrop-blur-md border border-amber-200/60 rounded-[2rem] p-8 shadow-sm flex gap-6"
        >
          <div className="p-3 bg-amber-100 rounded-2xl h-fit">
            <div className="w-8 h-8 bg-amber-600/10 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-[0.15em] flex items-center gap-2">
              Instructions for Evaluators
            </h4>
            <ol className="text-sm text-amber-800/90 font-medium space-y-2 list-decimal pl-5">
              <li><strong className="text-amber-900">Open both simultaneously:</strong> Open the Admin Panel (this page, login as Admin) and the User App side by side to see real-time 2-way coordination.</li>
              <li>The <strong className="text-amber-900">Doctor and Receptionist</strong> accounts are optional — the core evaluation is Admin + User App.</li>
              <li>When a user sends an emergency from the app, it appears <strong className="text-amber-900">instantly in the Admin Command Center</strong> — that's the key feature to watch.</li>
            </ol>
          </div>
        </motion.div>

        {/* Login Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Account Selection (5 cols) */}
          <section className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3 mb-6 px-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Demo Account</h3>
            </div>

            <div className="space-y-4">
              {/* Main Roles Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4" /> Priority — Open Both Together
                </p>
                
                <RoleCard 
                  isActive={activeRole === 'Admin'} 
                  onClick={() => setActiveRole('Admin')}
                  icon={Shield}
                  title="Admin Panel"
                  subtitle="Full hospital command & emergency coordination"
                  badge="MAIN"
                  color="blue"
                />

                <div 
                  className="group flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-3xl cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                  onClick={() => window.open('https://aarogyamitra-app.web.app/app.html', '_blank')}
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">User App</span>
                        <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded uppercase">MAIN</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Patient-facing emergency request app</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[11px] font-black rounded-xl uppercase shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                    Open <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Optional Roles */}
              <div className="space-y-4 pt-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-4">
                  <Users className="w-4 h-4" /> Optional Roles
                </p>
                
                <RoleCard 
                  isActive={activeRole === 'Doctor'} 
                  onClick={() => setActiveRole('Doctor')}
                  icon={Stethoscope}
                  title="Doctor"
                  subtitle="Clinical hub for doctors — optional to view"
                  badge="OPTIONAL"
                  color="purple"
                />

                <RoleCard 
                  isActive={activeRole === 'Receptionist'} 
                  onClick={() => setActiveRole('Receptionist')}
                  icon={Users}
                  title="Receptionist"
                  subtitle="Front-desk patient intake — optional to view"
                  badge="OPTIONAL"
                  color="indigo"
                />
              </div>
            </div>
          </section>

          {/* Right Column: Login Form (7 cols) */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex items-center gap-6 mb-12">
              <div className={cn(
                "p-4 rounded-3xl shadow-md border",
                activeRole === 'Admin' ? "bg-blue-50 text-blue-600 border-blue-100" :
                activeRole === 'Doctor' ? "bg-purple-50 text-purple-600 border-purple-100" :
                "bg-indigo-50 text-indigo-600 border-indigo-100"
              )}>
                {activeRole === 'Admin' ? <Shield className="w-8 h-8" /> :
                 activeRole === 'Doctor' ? <Stethoscope className="w-8 h-8" /> :
                 <Users className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{isSignUp ? 'Create New Profile' : `${activeRole} Terminal Access`}</h2>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.15em] mt-2">
                  {isSignUp ? 'Register for the Medical Command Center' : 'Security protocols active • pre-filled for demo'}
                </p>
              </div>
            </div>

            {/* Doctor Selection Toggle */}
            <AnimatePresence mode="wait">
              {activeRole === 'Doctor' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-4 mb-10"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor('Aditi')}
                    className={cn(
                      "flex-1 py-4 px-6 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-300",
                      selectedDoctor === 'Aditi' 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" 
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-500/50 hover:bg-emerald-50/50"
                    )}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Dr. Aditi</span>
                    {selectedDoctor === 'Aditi' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor('Khanna')}
                    className={cn(
                      "flex-1 py-4 px-6 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-300",
                      selectedDoctor === 'Khanna' 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" 
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-500/50 hover:bg-emerald-50/50"
                    )}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Dr. Khanna</span>
                    {selectedDoctor === 'Khanna' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-8">
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-6 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm" 
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Authorized Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-6 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Security Key (Password)</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-6 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm" 
                  />
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/10 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-primary/10">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-primary uppercase tracking-widest">Authentication Bypass Ready</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">Credentials synchronized with cloud registry.</p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isAuthenticating}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.25em] py-5 rounded-[1.5rem] shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
              >
                {isAuthenticating ? (
                  <Activity className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    {isSignUp ? 'REGISTER PROFILE' : `LOGIN AS ${activeRole.toUpperCase()} PANEL`}
                  </>
                )}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleAuth}
                disabled={isAuthenticating}
                className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-black text-sm uppercase tracking-[0.25em] py-5 rounded-[1.5rem] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                {isSignUp ? 'SIGN UP WITH GOOGLE' : 'CONTINUE WITH GOOGLE'}
              </button>

              <p className="text-center text-sm font-black uppercase tracking-widest text-slate-400 mt-10">
                {isSignUp ? 'Already have a profile?' : 'Need access to the terminal?'} 
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-primary hover:underline decoration-2 underline-offset-4"
                >
                  {isSignUp ? 'Back to Login' : 'Create Account'}
                </button>
              </p>
            </form>

            {/* Key Features for Admin */}
            {activeRole === 'Admin' && (
              <div className="mt-12 pt-10 border-t border-slate-100">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">System Intelligence Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {adminFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-10 flex justify-center">
              <button 
                onClick={async () => {
                   const loadingToast = toast.loading("Syncing Identity Stack...");
                   await initializeFirebaseUsers();
                   toast.dismiss(loadingToast);
                   toast.success("Identity Stack Live");
                }}
                className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-3 group"
              >
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                Run System Identity Setup
              </button>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-6 pt-12 pb-8 border-t border-slate-200/50">
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-500" /> Authorized Link
            </span>
            <span>•</span>
            <span>Zero-Trust Architecture</span>
            <span>•</span>
            <span>© 2025 Aarogya Mitra</span>
          </div>
          <p className="text-[9px] text-slate-300 font-medium text-center max-w-2xl uppercase tracking-widest">
            This system is a submission for the Google Solution Challenge 2025. All data shown is for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ isActive, onClick, icon: Icon, title, subtitle, badge, color }: any) => {
  const colorMap = {
    blue: "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30",
    purple: "bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-500/30",
    indigo: "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30"
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-6 rounded-[1.75rem] cursor-pointer transition-all border duration-300",
        isActive 
          ? colorMap[color as keyof typeof colorMap] + " -translate-y-1 scale-[1.02]" 
          : "bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-5">
        <div className={cn(
          "p-3.5 rounded-2xl transition-all duration-300 shadow-sm",
          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold tracking-tight", isActive ? "text-white" : "text-slate-900")}>{title}</span>
            <span className={cn(
              "px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-widest",
              isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            )}>{badge}</span>
          </div>
          <p className={cn("text-xs font-medium", isActive ? "text-white/70" : "text-slate-500")}>{subtitle}</p>
        </div>
      </div>
      {isActive && (
        <motion.div 
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
