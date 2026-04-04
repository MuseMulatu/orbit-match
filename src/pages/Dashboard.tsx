import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, LogOut, Sparkles, CreditCard, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { MatchModal } from '@/components/hasab/MatchModal';

// --- TYPES ---
interface DashboardData {
  wallet: { intent_slots: number; alias_slots: number };
  aliases: Array<{ id: string; type: string; verified: boolean; created_at: string }>;
  active_intents_count: number;
  matches: Array<{ match_id: string; matched_at: string; contact: any }>;
}

export default function Dashboard() {
  const { logout } = useApp();
  const navigate = useNavigate();

  // --- 1. GLOBAL DASHBOARD STATE ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // --- 2. INTENT SUBMISSION STATE ---
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [intentType, setIntentType] = useState<'phone' | 'telegram' | 'instagram'>('phone');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // --- 3. MODAL TRIGGERS ---
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  // --- 🔌 INITIAL DATA FETCH ---
  const fetchDashboard = async () => {
    try {
      const response = await api.get<{ success: boolean; data: DashboardData }>('/api/intent/dashboard');
      setData(response.data);
    } catch (error: any) {
      setFetchError('Failed to establish secure connection to Orbit Engine.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- 💘 HANDLER: ADD INTENT ---
  const handleAddIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIdentifier) return;

    setIsEncrypting(true);

    try {
      const response = await api.post<{ success: boolean; matchFound: boolean }>('/api/intent/add', {
        targetIdentifier,
        type: intentType
      });

      // Clear input on successful request
      setTargetIdentifier('');

      if (response.matchFound) {
        // 💥 UX ADDITION: Suspense Delay before Match Reveal
        setTimeout(() => {
          setShowMatchModal(true);
          fetchDashboard(); // Refresh to show new match in the list
        }, 400); 
      } else {
        // 🛡️ UX ADDITION: Beautiful Toast for unrequited intents
        toast({ 
          title: 'Locked in', 
          description: 'They’ll never know unless it’s mutual.',
        });
        fetchDashboard(); // Refresh to update active intents count and slots
      }
    } catch (error: any) {
      if (error.message.includes('Payment Required') || error.message.includes('slots')) {
        // 🚨 402 ERROR: Instantly trigger monetization
        setShowPaymentModal(true);
      } else {
        // 🚨 400 ERROR: Trigger destructive toast
        toast({ 
          title: 'Encryption Failed', 
          description: error.message || 'Failed to encrypt intent.', 
          variant: 'destructive' 
        });
      }
    } finally {
      setIsEncrypting(false);
    }
  };

  // --- 💰 HANDLER: PAYMENT TRIGGER (ARIFPAY) ---
  const handleBuySlots = async (packageType: 'basic' | 'premium') => {
    setIsInitializingPayment(true);
    try {
      const response = await api.post<{ success: boolean; checkoutUrl: string }>('/api/payment/initialize', { packageType });
      // Redirect strictly to the ArifPay gateway
      window.location.href = response.checkoutUrl;
    } catch (error: any) {
      toast({ 
        title: 'Gateway Error', 
        description: error.message || 'Payment initialization failed. Please try again.', 
        variant: 'destructive' 
      });
      setIsInitializingPayment(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50 gentle-animation">Syncing Orbit...</div>;
  if (fetchError) return <div className="min-h-screen bg-black flex items-center justify-center text-red-400">{fetchError}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Your Hasab</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white/40 text-sm">Private Mode Active</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="glass-effect p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 gentle-animation cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>

        {/* 🛡️ GLOBAL UX ADDITION: Trust Signal */}
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-center text-xs text-white/40 uppercase tracking-widest"
        >
          Your privacy is protected
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* --- LEFT COLUMN: INTENT ENGINE & STATS --- */}
          <div className="md:col-span-2 space-y-6">
            
            {/* ADD INTENT GLASS PANEL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6 relative overflow-hidden"
            >
              <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-white/60" />
                Add to Vault
              </h3>
              <p className="text-sm text-white/50 mb-6">No profiles. No browsing. Just raw intent.</p>

              <form onSubmit={handleAddIntent} className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={intentType} 
                    onChange={(e) => setIntentType(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 gentle-animation appearance-none cursor-pointer sm:w-1/3"
                  >
                    <option value="phone" className="text-black">Phone</option>
                    <option value="telegram" className="text-black">Telegram</option>
                    <option value="instagram" className="text-black">Instagram</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder={`Their ${intentType}...`}
                    value={targetIdentifier}
                    onChange={(e) => setTargetIdentifier(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 gentle-animation"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isEncrypting || !targetIdentifier.trim()}
                  className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                >
                  {isEncrypting ? (
                    <span className="animate-pulse">Encrypting...</span>
                  ) : (
                    <>Lock Intent <Lock className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </motion.div>

            {/* VAULT STATUS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-4">Active Orbit</h3>
              
              {data.active_intents_count > 0 ? (
                 <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                   <p className="text-indigo-200/80 text-sm leading-relaxed">
                     Your intents are locked in the vault. Waiting for a mutual connection... <span className="font-bold text-indigo-300">({data.active_intents_count} active)</span>
                   </p>
                 </div>
              ) : (
                 <div className="p-4 border border-white/5 bg-white/5 rounded-xl text-white/40 text-sm italic text-center">
                   Add someone you already feel something for.
                 </div>
              )}
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: WALLET & MATCHES --- */}
          <div className="space-y-6">
            
            {/* WALLET */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Orbit Slots
                </span>
              </div>
              
              <div className="text-5xl font-light text-white mb-2">{data.wallet.intent_slots}</div>
              
              {data.wallet.intent_slots <= 1 && (
                <p className="text-xs text-amber-400 mb-4 animate-pulse flex items-center gap-1">
                  ⚠️ Down to your last slot
                </p>
              )}

              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-4 bg-white/10 border border-white/20 text-white font-medium py-2.5 rounded-xl hover:bg-white/20 gentle-animation cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Reload Slots
              </button>
            </motion.div>

            {/* MATCHES */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-4">Connections</h3>
              
              {data.matches.length > 0 ? (
                <ul className="space-y-3">
                  {data.matches.map((match, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-1"
                    >
                      <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                        Mutual Match 💖
                      </p>
                      <p className="text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded w-fit mt-1">
                        {match.contact.phone || match.contact.telegram_chat_id}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/30 italic text-center py-6 border border-dashed border-white/10 rounded-xl">
                  Matches only happen when it’s mutual. Stay patient.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      <AnimatePresence>
        {showMatchModal && <MatchModal onClose={() => setShowMatchModal(false)} />}
        
        {/* ENHANCED GLASSMORPHISM PAYMENT MODAL */}
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-effect border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white gentle-animation cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Out of Orbit Slots</h2>
              <p className="text-white/60 text-sm mb-8">Someone might already be waiting. Reload your slots to find out.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleBuySlots('basic')}
                  disabled={isInitializingPayment}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 gentle-animation flex justify-between items-center text-left cursor-pointer group"
                >
                  <div>
                    <p className="text-white font-semibold group-hover:text-white gentle-animation">3 Slots</p>
                    <p className="text-xs text-white/40 mt-1">Use only when it matters</p>
                  </div>
                  <p className="text-white font-mono bg-white/10 px-3 py-1.5 rounded-lg text-sm">50 ETB</p>
                </button>
                
                <button 
                  onClick={() => handleBuySlots('premium')}
                  disabled={isInitializingPayment}
                  className="w-full bg-white text-black p-4 rounded-2xl hover:bg-white/90 gentle-animation flex justify-between items-center text-left cursor-pointer shadow-lg shadow-white/10"
                >
                  <div>
                    <p className="font-bold">10 Slots</p>
                    <p className="text-xs text-black/60 mt-1">No guessing. Only real intent.</p>
                  </div>
                  <p className="font-mono bg-black/10 px-3 py-1.5 rounded-lg text-sm font-semibold">120 ETB</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}