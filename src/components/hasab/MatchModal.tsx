import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function MatchModal() {
  const { matchState, dismissMatch } = useApp();

  return (
    <AnimatePresence>
      {matchState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative text-center space-y-8 max-w-sm"
          >
            {/* Pulsing heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mx-auto w-24 h-24 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Heart className="w-12 h-12 text-red-400 fill-red-400" />
            </motion.div>

            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">
                It's Mutual.
              </h2>
              <p className="text-white/50 text-lg">
                The feeling goes both ways.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={dismissMatch}
                className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 gentle-animation flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Open Chat
              </button>
              <button
                onClick={dismissMatch}
                className="w-full border border-white/20 text-white/70 font-medium py-3 rounded-xl hover:bg-white/5 gentle-animation flex items-center justify-center gap-2 cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
                Keep it private
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
