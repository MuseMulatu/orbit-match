import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Lock } from 'lucide-react';
import { api } from '@/lib/api';

export function PricingSection() {
  // --- 1. PAYMENT STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePackage, setActivePackage] = useState<'basic' | 'premium' | null>(null);

  // --- 2. 🔌 API HANDLER: INITIALIZE ARIFPAY ---
  const handlePayment = async (packageType: 'basic' | 'premium') => {
    setIsProcessing(true);
    setActivePackage(packageType);

    try {
      // Calls the highly secure Node.js endpoint built in Module 5
      const response = await api.post<{ success: boolean; checkoutUrl: string }>('/api/payment/initialize', { 
        packageType 
      });
      
      // 🚀 Redirect to ArifPay Secure Gateway
      window.location.href = response.checkoutUrl;
      
    } catch (error: any) {
      // Revert loading state if the backend rejects it or network drops
      alert(error.message || 'Gateway connection failed. Please try again.');
      setIsProcessing(false);
      setActivePackage(null);
    }
  };

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden" id="pricing">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- HEADER ANIMATIONS --- */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Protect Your Intent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-md mx-auto"
          >
            Every slot represents a real connection. No endless swiping.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* --- TIER 1: BASIC --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8 flex flex-col relative group transition-transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-white/80 mb-2">Basic Orbit</h3>
            <div className="text-4xl font-black text-white mb-6">
              50 <span className="text-lg font-normal text-white/50">ETB</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <Check className="w-4 h-4 text-emerald-400" /> 
                3 Intent Slots
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <Check className="w-4 h-4 text-emerald-400" /> 
                Double-blind matching
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <Check className="w-4 h-4 text-emerald-400" /> 
                90-day intent lock
              </li>
            </ul>

            {/* 💰 UX OPTIMIZATION */}
            <p className="text-xs text-center text-white/40 mb-4 italic">
              "Use only when it matters"
            </p>

            <button 
              disabled={isProcessing}
              onClick={() => handlePayment('basic')}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3.5 rounded-xl hover:bg-white/20 gentle-animation disabled:opacity-50 cursor-pointer"
            >
              {isProcessing && activePackage === 'basic' ? 'Connecting Gateway...' : 'Purchase 3 Slots'}
            </button>
          </motion.div>

          {/* --- TIER 2: PREMIUM --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-effect border-white/20 rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Sparkles Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Recommended
            </div>

            <h3 className="text-xl font-semibold text-white/80 mb-2">Deep Orbit</h3>
            <div className="text-4xl font-black text-white mb-6">
              120 <span className="text-lg font-normal text-white/50">ETB</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 
                10 Intent Slots
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 
                Double-blind matching
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check className="w-4 h-4 text-emerald-400" /> 
                Priority notification engine
              </li>
            </ul>

            {/* 💰 UX OPTIMIZATION */}
            <p className="text-xs text-center text-white/50 mb-4 italic">
              "No guessing. Only real intent."
            </p>

            <button 
              disabled={isProcessing}
              onClick={() => handlePayment('premium')}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-50 cursor-pointer shadow-lg shadow-white/10"
            >
              {isProcessing && activePackage === 'premium' ? 'Connecting Gateway...' : 'Purchase 10 Slots'}
            </button>
          </motion.div>

        </div>
        
        {/* 🛡️ UX ADDITION: Global Trust Signal for Pricing */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-white/30 uppercase tracking-widest flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Secured by ArifPay Enterprise
          </p>
        </motion.div>

      </div>
    </section>
  );
}