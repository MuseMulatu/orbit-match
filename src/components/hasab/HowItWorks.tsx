import { motion } from 'framer-motion';
import { Lock, EyeOff, Heart } from 'lucide-react';

const steps = [
  {
    icon: Lock,
    title: 'Lock them in',
    text: "Add the phone number of your crush. It's securely encrypted.",
    delay: 0,
  },
  {
    icon: EyeOff,
    title: 'Total Silence',
    text: 'They are never notified. Your secret stays safe.',
    delay: 0.15,
  },
  {
    icon: Heart,
    title: 'The Match',
    text: 'Only if they add you too, the connection is revealed.',
    delay: 0.3,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay, duration: 0.6 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
