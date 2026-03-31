import { motion } from 'framer-motion';
import { BellOff, UserX, Handshake, ShieldCheck } from 'lucide-react';

const promises = [
  { icon: BellOff, text: 'No notifications. Ever.' },
  { icon: UserX, text: 'No profiles. No browsing.' },
  { icon: Handshake, text: 'Mutual or nothing.' },
  { icon: ShieldCheck, text: 'Your data is encrypted and private.' },
];

export function TrustSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Built on Trust
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/40 mb-16 text-lg"
        >
          Privacy isn't a feature — it's the foundation.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {promises.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-effect rounded-xl px-6 py-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-white/80" />
              </div>
              <span className="text-white/80 font-medium text-left">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
