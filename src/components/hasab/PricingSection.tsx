import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export function PricingSection() {
  const { setShowAuthModal } = useApp();

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
        >
          Don’t wait for gravity.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10"
        >
          You can keep wondering forever…  
          or find out if it’s mutual — without risking anything.
        </motion.p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAuthModal(true)}
          className="bg-white text-black font-bold px-12 py-4 rounded-xl text-lg hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.25)] gentle-animation cursor-pointer transition-all"
        >
          Try it now
        </motion.button>

        {/* Soft trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/30 text-sm mt-6"
        >
          No pressure. Just clarity.
        </motion.p>

      </div>
    </section>
  );
}