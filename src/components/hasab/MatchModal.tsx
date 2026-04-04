import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

interface MatchModalProps {
  onClose: () => void;
}

export function MatchModal({ onClose }: MatchModalProps) {
  useEffect(() => {
    // 💥 UX ADDITION: Physical Haptic Feedback (Supported mobile devices only)
    // Creates a "Heartbeat" double-vibration pattern when a match is found
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative bg-[#111]/90 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] rounded-3xl p-8 max-w-sm w-full text-center space-y-8"
      >
        {/* Pulsing heart from original UI */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mx-auto w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(248,113,113,0.2)]"
        >
          <Heart className="w-12 h-12 text-red-400 fill-red-400" />
        </motion.div>

        <div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
            Mutual Intent.
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            The vault has been unlocked. Someone you feel something for feels the exact same way.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
            Check your connections list
          </p>

          {/* Upgraded Button retaining original UI classes */}
          <button
            onClick={onClose}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-white/90 gentle-animation flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10"
          >
            View Connection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}