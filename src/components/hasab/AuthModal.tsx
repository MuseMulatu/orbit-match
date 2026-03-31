import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useApp();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!phone || phone.replace(/[\s\-\(\)]/g, '').length < 7) {
      setError('Enter a valid phone number.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('otp');
  };

  const handleVerify = async () => {
    if (otp !== '1234') {
      setError('Invalid code. Try 1234.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    login(phone);
    // Reset for next time
    setStep('phone');
    setPhone('');
    setOtp('');
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass-effect rounded-2xl p-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white gentle-animation cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                {step === 'phone' ? (
                  <Phone className="w-7 h-7 text-white" />
                ) : (
                  <Shield className="w-7 h-7 text-white" />
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {step === 'phone' ? 'Enter Your Number' : 'Verify Code'}
            </h2>
            <p className="text-white/60 text-center text-sm mb-8">
              {step === 'phone'
                ? 'Your number is encrypted and never shared.'
                : 'Enter the code sent to your phone.'}
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-4 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {step === 'phone' ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 gentle-animation"
                  autoFocus
                />
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/30 placeholder:tracking-[0.5em] focus:outline-none focus:border-white/30 gentle-animation"
                  autoFocus
                />
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="w-full text-white/40 text-sm hover:text-white/60 gentle-animation cursor-pointer"
                >
                  Use a different number
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
