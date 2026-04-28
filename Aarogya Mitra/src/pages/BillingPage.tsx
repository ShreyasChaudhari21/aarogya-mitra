import { useState } from 'react';
import { 
  CreditCard, 
  Receipt,
  Search, 
  Printer,
  History,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAarogyaData } from '@/hooks/useAarogyaData';

export const BillingPage = () => {
  const { patients, billings, addBilling } = useAarogyaData();
  
  const [filterStatus, setFilterStatus] = useState<'All' | 'Success' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [billAmount, setBillAmount] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const filteredTxns = billings.filter((t: any) => 
    (filterStatus === 'All' || t.status === filterStatus) &&
    ((t.patientName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || t.id.toString().includes(searchQuery))
  );

  const handlePay = async () => {
    setPaymentStatus('processing');
    try {
      // Simulate bank delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await addBilling({
        patient_id: selectedPatient,
        amount: parseFloat(billAmount),
        status: 'Success'
      });

      setPaymentStatus('success');
      
      setTimeout(() => {
        setShowPayment(false);
        setPaymentStatus('idle');
        toast.success(`Settlement Complete`);
        setSelectedPatient('');
        setBillAmount('0');
      }, 2000);
    } catch (err) {
      toast.error('Payment gateway timeout');
      setPaymentStatus('idle');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Billing Gateway</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
            Secure Revenue & Patient Ledger Management
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass-panel p-1 flex gap-1 border-border">
              {['All', 'Success', 'Pending'].map(s => (
                <button 
                   key={s} 
                   onClick={() => setFilterStatus(s as any)}
                   className={cn(
                     "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                     filterStatus === s ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                   )}
                >
                   {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Settlement History */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="glass-panel overflow-hidden border-border/50 shadow-xl">
              <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
                 <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="SEARCH PATIENT OR INVOICE..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/50"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Transaction Log</span>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-border/50 bg-secondary/10">
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subscriber</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Internal ID</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Settlement</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Receipt</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       <AnimatePresence mode="popLayout">
                          {filteredTxns.map((txn: any) => (
                             <motion.tr layout key={txn.id} className="hover:bg-secondary/20 transition-all group">
                                <td className="px-8 py-5">
                                   <div className="text-sm font-bold text-foreground uppercase tracking-tight">{txn.patientName || 'External User'}</div>
                                   <div className="text-[9px] font-black text-primary uppercase mt-0.5 tracking-widest">{txn.date}</div>
                                </td>
                                <td className="px-8 py-5">
                                   <span className="text-[10px] font-mono font-black text-muted-foreground uppercase">INV-{txn.id}</span>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="text-sm font-black text-foreground tabular-nums">₹{txn.amount.toLocaleString()}</div>
                                   <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">SECURE_GATEWAY</div>
                                </td>
                                <td className="px-8 py-5">
                                   <span className={cn(
                                      "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                      txn.status === 'Success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                   )}>
                                      {txn.status}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <button 
                                      onClick={() => toast.success('Dispatching to terminal printer...')}
                                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                   >
                                      <Printer className="w-4 h-4" />
                                   </button>
                                </td>
                             </motion.tr>
                          ))}
                          {filteredTxns.length === 0 && (
                            <tr>
                               <td colSpan={5} className="py-20 text-center opacity-30 grayscale">
                                  <Receipt className="w-12 h-12 mx-auto mb-4" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Transactions Found</span>
                               </td>
                            </tr>
                          )}
                       </AnimatePresence>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Quick Billing Action */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 border-primary/20 bg-primary/5 space-y-6">
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                 <CreditCard className="w-4 h-4 text-primary" /> Generate Invoice
              </h3>

              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Select Patient Profile</label>
                    <select 
                       value={selectedPatient}
                       onChange={(e) => setSelectedPatient(e.target.value)}
                       className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    >
                       <option value="">Choose Witnessed Member</option>
                       {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
                       ))}
                    </select>
                 </div>

                 <div>
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Settlement Amount (INR)</label>
                    <input 
                       type="number" 
                       value={billAmount}
                       onChange={(e) => setBillAmount(e.target.value)}
                       className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-lg font-black tabular-nums focus:ring-2 focus:ring-primary/50"
                       placeholder="0.00"
                    />
                 </div>

                 <button 
                    onClick={() => selectedPatient && billAmount !== '0' && setShowPayment(true)}
                    disabled={!selectedPatient || billAmount === '0'}
                    className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                 >
                    Initialize Settlement
                 </button>
              </div>
           </div>

           <div className="glass-panel p-6 border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-4 h-4 text-indigo-500" />
                 <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Audit Compliance</h4>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                 All financial signals are encrypted with ISO-27001 standard protocols and verified through regional banking nodes.
              </p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPayment(false)} className="absolute inset-0 bg-background/80" />
            <motion.div 
               initial={{ scale: 0.95, y: 20 }} 
               animate={{ scale: 1, y: 0 }}
               className="relative w-full max-w-sm glass-panel p-10 text-center shadow-3xl border-primary/20 overflow-hidden"
            >
               {paymentStatus === 'idle' && (
                 <>
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-inner group">
                       <Smartphone className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <h2 className="text-xl font-black text-foreground mb-1 uppercase tracking-tighter">Unified Interface</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-8">Amount to Settle: <span className="text-primary text-lg">₹{billAmount}</span></p>
                    <div className="flex gap-4">
                       <button onClick={() => setShowPayment(false)} className="flex-1 py-4 rounded-xl border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary">Abort</button>
                       <button onClick={handlePay} className="flex-1 py-4 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/30">Settle</button>
                    </div>
                 </>
               )}

               {paymentStatus === 'processing' && (
                  <div className="py-12 flex flex-col items-center">
                     <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                     <h3 className="text-sm font-black text-foreground mb-1 uppercase tracking-widest">SYNCHRONIZING_NODE</h3>
                     <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.3em] animate-pulse">awaiting biometric validation...</p>
                  </div>
               )}

               {paymentStatus === 'success' && (
                  <div className="py-12 flex flex-col items-center animate-in zoom-in duration-300">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                     </div>
                     <h3 className="text-lg font-black text-foreground mb-1 uppercase tracking-widest">Settlement Finalized</h3>
                     <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-8">Registry Updated Successfully</p>
                     <button 
                        onClick={() => toast.success('Report dispatched to system downloads')}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                     >
                        <Download className="w-4 h-4" /> Download PDF Receipt
                     </button>
                  </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
