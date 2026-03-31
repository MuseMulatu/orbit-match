import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function PricingSection() {
  const { setShowAuthModal } = useApp();

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-4"
        >
          Simple Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/40 text-center mb-16 max-w-md mx-auto"
        >
          We never sell hints or reveal one-sided interest. Your secret is safe, always.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold text-white/60 mb-2">Free</h3>
            <div className="text-4xl font-black text-white mb-6">$0<span className="text-lg font-normal text-white/40">/mo</span></div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white/40" />
                2 Active Crush Slots
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white/40" />
                Double-blind matching
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white/40" />
                End-to-end encryption
              </li>
            </ul>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full mt-8 border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/5 gentle-animation cursor-pointer"
            >
              Get Started
            </button>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-effect rounded-2xl p-8 border-white/20 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-xs text-white/70">
              <Sparkles className="w-3 h-3" /> Popular
            </div>
            <h3 className="text-lg font-semibold text-white/60 mb-2">Premium</h3>
            <div className="text-4xl font-black text-white mb-6">$4.99<span className="text-lg font-normal text-white/40">/mo</span></div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white" />
                5 Active Crush Slots
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white" />
                Read receipts after a match
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white" />
                Priority match processing
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Check className="w-4 h-4 text-white" />
                Everything in Free
              </li>
            </ul>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full mt-8 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 gentle-animation cursor-pointer"
            >
              Upgrade
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
