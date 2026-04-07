import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, LogOut, Sparkles, CreditCard, X, Globe, Clock, User, Zap, Heart, RefreshCw, Smartphone, Send, Camera, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { MatchModal } from '@/components/hasab/MatchModal';

// --- TYPES ---
interface DashboardData {
  wallet: { slots: number };
  aliases: Array<{ id: string; type: string; verified: boolean; created_at: string }>;
  active_intents_count: number;
  active_intents?: Array<{ id: string; target: string; type: string; created_at: string }>; 
  expired_intents: Array<{ id: string; target_hash: string; expires_at: string }>;
  matches: Array<{ match_id: string; matched_at: string; contact: any }>;
  blocked_connections: Array<{ block_id: string; blocked_at: string; contact: any }>;
}

// --- STARFIELD GENERATOR ---
const generateStars = (count: number) => {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${2 + Math.random() * 3}px`,
    opacity: 0.3 + Math.random() * 0.5,
    animationDelay: `${Math.random() * 10}s`,
  }));
};

const stars = generateStars(30);

// --- CELESTIAL BACKGROUND ---
const CelestialBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020208]">
    <div className="absolute w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
    <div className="absolute w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute w-[400px] h-[400px] bg-pink-900/5 rounded-full blur-[100px] left-1/4 top-3/4" />

    <div className="absolute inset-0">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${5 + Math.random() * 8}s infinite alternate ease-in-out`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>

    {/* Orbit 1 */}
    <div className="absolute left-1/2 top-1/2 w-[120vw] max-w-[1100px] aspect-square -translate-x-1/2 -translate-y-1/2">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 500, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-solid border-t-indigo-500/30 border-r-indigo-500/5 border-b-transparent border-l-transparent" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
        <div className="absolute left-1/2 top-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
      </motion.div>
    </div>

    {/* Orbit 2 */}
    <div className="absolute left-1/2 top-1/2 w-[100vw] max-w-[900px] aspect-square -translate-x-1/2 -translate-y-1/2">
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 600, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-solid border-t-transparent border-r-purple-500/20 border-b-purple-500/5 border-l-transparent" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 140, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
        <div className="absolute left-1/2 top-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      </motion.div>
    </div>

    {/* Orbit 3 */}
    <div className="absolute left-1/2 top-1/2 w-[80vw] max-w-[700px] aspect-square -translate-x-1/2 -translate-y-1/2">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 400, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-solid border-t-transparent border-r-transparent border-b-pink-500/5 border-l-pink-500/30" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
        <div className="absolute left-1/2 top-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 shadow-[0_0_12px_rgba(244,114,182,0.5)]" />
      </motion.div>
    </div>

    {/* Orbit 4 */}
    <div className="absolute left-1/2 top-1/2 w-[140vw] max-w-[1300px] aspect-square -translate-x-1/2 -translate-y-1/2">
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 800, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-solid border-t-amber-500/10 border-r-transparent border-b-transparent border-l-amber-500/5 opacity-60" />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 240, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
        <div className="absolute left-1/2 top-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400/60 to-orange-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
      </motion.div>
    </div>
  </div>
);

export default function Dashboard() {
  const { logout } = useApp();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [intentType, setIntentType] = useState<'phone' | 'telegram' | 'instagram'>('phone');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  // 🚨 NEW: Payment Redirect Handler
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentStatus = searchParams.get('payment');

    if (paymentStatus) {
      if (paymentStatus === 'success') {
        toast({ 
          title: 'Transaction Complete 🚀', 
          description: 'Your slots have been added. Welcome back to Orbit.',
        });
      } else if (paymentStatus === 'cancelled') {
        toast({ 
          title: 'Payment Cancelled', 
          description: 'You cancelled the transaction. No slots were added.',
          variant: 'destructive'
        });
      } else if (paymentStatus === 'error') {
        toast({ 
          title: 'Gateway Error', 
          description: 'Payment timed out or failed. Please try again.',
          variant: 'destructive'
        });
      }

      // Clean the URL so the toast doesn't pop up again if they refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Run once on component mount

  const handleRevokeIntent = async (id: string) => {
    if (window.confirm("Removing this intent will permanently break the connection. (Consumed slots are not refunded). Continue?")) {
      try {
        await api.post(`/api/intent/${id}/revoke`);
        toast({ title: 'Intent Revoked', description: 'Your intent has been permanently removed.' });
        fetchDashboard();
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    }
  };

  const handleBlockMatch = async (matchId: string) => {
    if (window.confirm("This will permanently remove this match. Are you sure? They won't be notified of the removal.")) {
      try {
        await api.post('/api/match/block', { matchId });
        toast({ title: 'Match removed', description: 'User has been blocked.' });
        fetchDashboard();
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      }
    }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      await api.post('/api/match/unblock', { blockId });
      toast({ title: 'User Unblocked', description: 'They can now be matched again if you both submit intents.' });
      fetchDashboard();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

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
    const token = localStorage.getItem('zabiya_token');
    if (!token) {
      navigate('/');
    } else {
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIdentifier) return;
    setIsEncrypting(true);
    try {
      const response = await api.post<{ success: boolean; matchFound: boolean }>('/api/intent/add', {
        targetIdentifier,
        type: intentType
      });
      setTargetIdentifier('');
      if (response.matchFound) {
        setTimeout(() => {
          setShowMatchModal(true);
          fetchDashboard(); 
        }, 400); 
      } else {
        toast({ 
          title: 'Saved privately', 
          description: 'They’ll only know if they feel the same.',
        });
        fetchDashboard(); 
      }
    } catch (error: any) {
      if (error.message?.includes('Payment Required') || error.message?.includes('slots')) {
        setShowPaymentModal(true);
      } else {
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

  const handleBuySlots = async (packageType: 'basic' | 'premium') => {
    setIsInitializingPayment(true);
    try {
      const response = await api.post<{ success: boolean; checkoutUrl: string }>('/api/payment/initialize', { packageType });
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

  const handleAction = (actionName: string) => {
    if (window.confirm(`Are you sure you want to ${actionName.toLowerCase()} this user? This action is permanent and anonymous.`)) {
      toast({
        title: `User ${actionName}ed`,
        description: `This connection has been securely removed from your orbit.`,
      });
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#030305] flex items-center justify-center text-indigo-400/50 uppercase tracking-[0.2em] text-xs font-bold">Aligning Orbits...</div>;
  if (fetchError) return <div className="min-h-screen bg-[#030305] flex items-center justify-center text-red-500/80">{fetchError}</div>;
  if (!data) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-slate-200 font-sans">
      <CelestialBackground />

      <div className="relative z-10 px-4 py-8 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* --- HEADER --- */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-light tracking-wide text-white drop-shadow-md">
                Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Orbit</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]" />
                <span className="text-indigo-300/60 text-xs tracking-[0.2em] font-bold uppercase">Private & Encrypted</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-[#0a0a0f] border-2 border-[#1c1c26] text-white/40 hover:text-white hover:border-[#2d2d3d] hover:bg-[#11111a] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN */}
            <div className="md:col-span-2 space-y-6">
              
              {/* --- LOCK INTENT OBSIDIAN SLAB --- */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-[#08080c] border-2 border-[#1a1a24] rounded-[2rem] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-[#28283a]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-[#12121c] border border-[#2a2a3a] rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Lock className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-wide">Add Intent</h3>
                  </div>
                  <p className="text-sm text-indigo-200/40 mb-8 font-light tracking-wide pl-1">
                    Add someone you’re thinking about. They’ll only know if the feeling is mutual.
                  </p>

                  <form onSubmit={handleAddIntent} className="flex flex-col space-y-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative sm:w-1/3">
                        <select 
                          value={intentType} 
                          onChange={(e) => setIntentType(e.target.value as any)}
                          className="w-full bg-[#040406] border-2 border-[#1c1c28] rounded-2xl px-5 py-4 text-indigo-100 focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] font-medium"
                        >
                          <option value="phone" className="bg-[#0a0a0f]">📱 Phone</option>
                          <option value="telegram" className="bg-[#0a0a0f]">✈️ Telegram</option>
                          <option value="instagram" className="bg-[#0a0a0f]">📸 Instagram</option>
                        </select>
                      </div>
                      <input 
                        type="text" 
                        placeholder={`Enter their ${intentType}...`}
                        value={targetIdentifier}
                        onChange={(e) => setTargetIdentifier(e.target.value)}
                        className="flex-1 bg-[#040406] border-2 border-[#1c1c28] rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] font-medium"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isEncrypting || !targetIdentifier.trim()}
                      className="relative overflow-hidden group/btn w-full bg-[#11111a] border-2 border-[#2a2a3a] text-white font-semibold py-4 rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:grayscale cursor-pointer flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                    >
                      {isEncrypting ? (
                        <span className="animate-pulse tracking-widest text-sm text-indigo-300">Sending...</span>
                      ) : (
                        <>
                          <span className="tracking-wide">Send into Orbit</span>
                          <Sparkles className="w-4 h-4 text-indigo-400 group-hover/btn:text-white transition-colors" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* --- ORBIT STATUS EMERALD SLAB --- */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-[#050808] border-2 border-[#0f1f1f] rounded-[2rem] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-[#1a3a3a]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="p-2 bg-[#0a1414] border border-[#142e2e] rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-white/90 font-semibold tracking-wide">Current Orbit Status</h3>
                </div>
                
                {/* ACTIVE INTENTS LIST */}
                {data?.active_intents && data.active_intents.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4 bg-[#081212] border border-[#122b2b] rounded-xl p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                      <p className="text-emerald-100/70 text-xs font-light">
                        Waiting to see if it’s mutual...
                      </p>
                      <p className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                        {data.active_intents_count} ACTIVE
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {data.active_intents.map((intent) => (
                        <motion.li 
                          key={intent.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between items-center bg-[#050808] p-3 rounded-xl border border-[#142e2e] hover:border-[#1e4545] transition-all group/intent shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0a1414] rounded-lg border border-[#142e2e] text-emerald-500/70">
                              {intent.type === 'phone' && <Smartphone className="w-3 h-3" />}
                              {intent.type === 'telegram' && <Send className="w-3 h-3" />}
                              {intent.type === 'instagram' && <Camera className="w-3 h-3" />}
                            </div>
                            <div>
                              <p className="text-xs font-mono font-medium text-emerald-100/90 tracking-wide">
                                {intent.target}
                              </p>
                              <p className="text-[9px] text-emerald-500/50 uppercase tracking-widest mt-0.5">
                                {intent.type} • Added {new Date(intent.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                            <button 
                              onClick={() => handleRevokeIntent(intent.id)}
                              className="p-2 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] text-red-500/40 hover:text-red-400 hover:border-red-900/50 hover:bg-[#1a0a0a] transition-all cursor-pointer opacity-0 group-hover/intent:opacity-100"
                              title="Revoke Intent"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : data?.active_intents_count !== undefined && data.active_intents_count > 0 ? (
                  <div className="bg-[#081212] border-2 border-[#122b2b] rounded-2xl p-5 flex items-start gap-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                    <div className="p-2 bg-[#102424] rounded-full border border-[#1a3a3a]">
                      <Globe className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-100/70 text-sm leading-relaxed font-light">
                        Your additions are saved privately. Waiting to see if there’s a match.
                      </p>
                      <p className="text-emerald-400 text-xs mt-2 font-mono font-bold tracking-widest uppercase">
                        {data.active_intents_count} ACTIVE
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#142e2e] rounded-2xl bg-[#030606]">
                    <div className="w-12 h-12 mb-3 rounded-full bg-[#0a1414] flex items-center justify-center border border-[#142e2e]">
                      <Zap className="w-5 h-5 text-emerald-900" />
                    </div>
                    <p className="text-emerald-900/50 text-sm font-semibold tracking-wide text-center uppercase">
                      Nothing here yet.<br />Add someone to get started.
                    </p>
                  </div>
                )}

                {/* EXPIRED INTENTS */}
                {data?.expired_intents && data.expired_intents.length > 0 && (
                  <div className="mt-8 pt-6 border-t-2 border-[#0f1f1f] relative">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <h3 className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-bold">Expired Additions</h3>
                    </div>
                    <ul className="space-y-3">
                      {data.expired_intents.map((intent) => (
                        <li key={intent.id} className="flex justify-between items-center bg-[#0a0a0a] p-4 rounded-2xl border-2 border-[#1c1a15] hover:border-amber-900/50 transition-all group/expired shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
                          <span className="text-xs text-white/40 flex items-center gap-3 font-mono font-medium">
                            <Lock className="w-3 h-3 text-amber-700" /> 
                            {intent.target_hash.substring(0, 10)}...
                          </span>
                          <button 
                            onClick={() => toast({ title: 'Cosmic Renewal', description: 'Intent renewal will be available shortly.' })}
                            className="text-[10px] uppercase font-bold tracking-widest bg-[#14120a] border border-[#2e2614] hover:bg-amber-900/40 text-amber-500/80 hover:text-amber-400 px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                          >
                            <RefreshCw className="w-3 h-3" /> Renew
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* --- MISSED MATCH PREVENTION SLAB --- */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="group relative bg-[#140a04] border-2 border-[#3d1c09] rounded-[2rem] p-7 shadow-2xl overflow-hidden transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-[40px]" />
                
                <h3 className="text-white font-bold tracking-wide mb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Don’t Miss a Match
                </h3>
                
                <p className="text-orange-200/80 text-sm leading-relaxed mb-6 font-medium">
                  If they used your different number or username than the one you added, you won’t see each other — even if you both liked each other.
                </p>
                
                <button 
                  onClick={() => alert("Wire this to your addAlias modal/flow!")}
                  className="w-full bg-[#1a0c04] border border-[#3d1c09] text-orange-400 font-bold py-3.5 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                >
                  <ShieldCheck className="w-4 h-4" /> Add Your Another Contacts (2 Slots)
                </button>
              </motion.div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* --- ENERGY REACTOR SLAB --- */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden bg-[#0a0602] border-2 border-[#2b1604] rounded-[2rem] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-[#4a2608]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-600/10 rounded-full blur-[60px]" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-orange-500/80 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Available Slots
                    </span>
                    <div className="p-1.5 bg-[#1a0c04] border border-[#3d1c09] rounded-lg">
                      <CreditCard className="w-4 h-4 text-orange-700" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-6xl font-light text-white tracking-tighter flex items-baseline gap-2 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                      {data?.wallet?.slots || 0}
                      <span className="text-sm font-bold tracking-widest text-orange-900 uppercase">
                        Slots Left
                      </span>
                    </div>
                    
                    <div className="w-full h-2.5 bg-[#050301] border border-[#1a0c04] rounded-full mt-5 overflow-hidden p-[1px]">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                        style={{ width: `${Math.min(100, ((data?.wallet?.slots || 0) / 6) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {data?.wallet?.slots !== undefined && data.wallet.slots <= 1 && (
                    <p className="text-[11px] text-red-400 font-semibold tracking-wide flex items-start gap-2 mt-4 bg-red-950/30 p-3 rounded-lg border border-red-900/50 leading-snug">
                      <span className="w-2 h-2 mt-1 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
                      You’re down to your last chance. If they use a different number or account, you won’t appear to each other.
                    </p>
                  )}

                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full mt-6 bg-[#140a04] border-2 border-[#3d1c09] text-orange-200 font-bold tracking-wide py-3.5 rounded-2xl hover:bg-orange-600 hover:border-orange-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                  >
                    <Sparkles className="w-4 h-4" /> Get More Slots
                  </button>
                </div>
              </motion.div>

              {/* --- MUTUAL GRAVITY (MATCHES) SLAB --- */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative bg-[#0a0508] border-2 border-[#2b101e] rounded-[2rem] p-7 min-h-[320px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-[#4a1c34]"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="p-2 bg-[#1a0a12] border border-[#3d162a] rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Heart className="w-4 h-4 text-pink-500" />
                  </div>
                  <h3 className="text-white/90 font-semibold tracking-wide">Mutual Gravity</h3>
                  {data?.matches && data.matches.length > 0 && (
                    <span className="text-[10px] font-bold bg-[#3d162a] border border-[#5c2240] text-pink-400 px-2 py-1 rounded-md ml-auto">
                      {data.matches.length}
                    </span>
                  )}
                </div>
                
                {data?.matches && data.matches.length > 0 ? (
                  <ul className="space-y-4">
                    {data.matches.map((match, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="group/match relative bg-[#0e070c] p-5 rounded-2xl border-2 border-[#241019] hover:border-[#4a1e34] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
                      >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-500 rounded-r-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                        
                        <div className="flex items-start gap-4 pl-2">
                          <div className="w-10 h-10 rounded-xl bg-[#1c0d15] border border-[#3a1b2d] flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-pink-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-pink-400/80 uppercase tracking-widest flex items-center justify-between">
                              Match
                              <span className="text-[9px] text-[#4a1e34]">
                                {new Date(match.matched_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </p>
                            <p className="text-base text-white/90 font-mono mt-1 font-medium tracking-wider">
                              {match.contact.phone || match.contact.telegram_chat_id || match.contact.instagram_username}
                            </p>
                            <div className="flex gap-3 mt-4 pt-3 border-t-2 border-[#241019] opacity-0 group-hover/match:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleBlockMatch(match.match_id)} 
                              className="text-[9px] font-bold uppercase tracking-[0.2em] bg-[#14080c] border border-[#2b101a] px-3 py-1.5 rounded-lg text-white/30 hover:text-red-500 hover:border-red-900/50 transition-colors cursor-pointer"
                            >
                              Block
                            </button>
                              <button onClick={() => handleAction('Report')} className="text-[9px] font-bold uppercase tracking-[0.2em] bg-[#14080c] border border-[#2b101a] px-3 py-1.5 rounded-lg text-white/30 hover:text-red-500 hover:border-red-900/50 transition-colors cursor-pointer">
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center bg-[#050204] border-2 border-dashed border-[#241019] rounded-2xl">
                    <div className="relative w-12 h-12 mb-5">
                      <div className="absolute inset-0 border-2 border-dashed border-[#4a1e34] rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-2 border-2 border-[#241019] rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-pink-900 rounded-full" />
                      </div>
                    </div>
                    <p className="text-[10px] text-pink-700 font-bold uppercase tracking-[0.2em] max-w-[150px]">
                      No Matches Yet
                    </p>
                  </div>
                )}
              </motion.div>
              {/* --- BLOCKED CONNECTIONS SLAB --- */}
              {data?.blocked_connections && data.blocked_connections.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-[#050204] border border-[#2b101e]/50 rounded-2xl p-5 mt-6"
                >
                  <h3 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                    <X className="w-3 h-3" /> Blocked Users
                  </h3>
                  <ul className="space-y-2">
                    {data.blocked_connections.map((block) => (
                      <li key={block.block_id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-xs text-white/30 font-mono">
                          {block.contact.phone || block.contact.telegram_chat_id || 'Unknown'}
                        </span>
                        <button 
                          onClick={() => handleUnblock(block.block_id)}
                          className="text-[9px] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Unblock
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <AnimatePresence>
          {showMatchModal && <MatchModal onClose={() => setShowMatchModal(false)} />}
          
          {showPaymentModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="absolute inset-0 bg-[#030305]/95 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0a0602] border-2 border-[#3d1c09] rounded-[2.5rem] p-10 max-w-sm w-full shadow-[0_0_80px_rgba(249,115,22,0.15)] overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
                
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors cursor-pointer bg-[#140a04] border border-[#3d1c09] rounded-xl p-2"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-2xl bg-[#1a0c04] border border-[#3d1c09] flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>

                <h2 className="text-2xl font-semibold text-white mb-2">Add More <span className="text-orange-500">Slots</span></h2>
                <p className="text-orange-200/60 text-sm mb-8 font-medium tracking-wide">Add more slots to keep making additions.</p>
                
                <div className="space-y-4">
                  {/* STARTER PACKAGE */}
                  <button 
                    onClick={() => handleBuySlots('basic')}
                    disabled={isInitializingPayment}
                    className="w-full bg-[#050301] border-2 border-[#1a0c04] p-5 rounded-2xl hover:border-orange-900/50 hover:bg-[#0a0602] transition-all flex justify-between items-center text-left cursor-pointer group"
                  >
                    <div>
                      <p className="text-white/70 font-semibold group-hover:text-white transition">Starter</p>
                      <p className="text-[10px] text-orange-900/50 uppercase tracking-widest font-bold mt-1">3 Slots</p>
                    </div>
                    <p className="text-orange-500 font-mono bg-[#140a04] border border-[#3d1c09] px-3 py-1.5 rounded-xl text-xs font-bold">149 ETB</p>
                  </button>
                  
                  {/* BEST VALUE PACKAGE */}
                  <button 
                    onClick={() => handleBuySlots('premium')}
                    disabled={isInitializingPayment}
                    className="relative w-full bg-[#11111a] border-2 border-[#2a2a3a] text-white p-5 rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 transition-all flex justify-between items-center text-left cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                  >
                    {/* Value Badge */}
                    <div className="absolute -top-3 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Best Value
                    </div>

                    <div>
                      <p className="font-semibold text-indigo-100">Deep Space Pack</p>
                      <p className="text-[10px] text-indigo-300/80 uppercase tracking-widest font-bold mt-1">6 Slots (Double Output)</p>
                    </div>
                    <p className="font-mono bg-[#0a0a0f] border border-[#1c1c28] text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-inner">199 ETB</p>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}