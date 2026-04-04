import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

// Define standard types based on our backend response
interface AuthResponse {
  success: boolean;
  token: string;
  user: { id: string; requires_demographics: boolean };
}

export function AuthModal() {
  // Use existing AppContext for modal visibility and auth state
  const { showAuthModal, setShowAuthModal, setAuth } = useApp(); 
  
  // UX States
  const [step, setStep] = useState<'telegram' | 'demographics'>('telegram');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Demographics State
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  // ------------------------------------------------------------------
  // 🔌 HANDLER: TELEGRAM WEBHOOK AUTH
  // ------------------------------------------------------------------
  const handleTelegramLogin = async (telegramPayload: any = {}) => {
    setIsLoading(true);
    setError('');
    
    try {
      // POST to our Module 2 backend endpoint
      const response = await api.post<AuthResponse>('/api/auth/telegram/webhook', telegramPayload);
      
      // Store JWT securely
      localStorage.setItem('zabiya_token', response.token);
      
      if (response.user.requires_demographics) {
        setStep('demographics'); // Trigger secondary UI smoothly
      } else {
        // if setAuth is in your context: setAuth(true, response.user);
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 🔌 HANDLER: SUBMIT DEMOGRAPHICS
  // ------------------------------------------------------------------
  const handleDemographicsSubmit = async () => {
    if (!gender || !birthDate) {
      setError('Please provide both gender and birth date to continue.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // POST to our Module 2 demographics endpoint (auto-attaches JWT)
      await api.post('/api/auth/user/demographics', { gender, birth_date: birthDate });
      
      // if setAuth is in your context: setAuth(true, user); 
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update demographics.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowAuthModal(false);
    // Reset states for the next time the modal opens
    setTimeout(() => {
      setStep('telegram');
      setGender('');
      setBirthDate('');
      setError('');
    }, 300); // Wait for exit animation to finish
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
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white gentle-animation cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Banner */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                {step === 'telegram' ? (
                  <Send className="w-7 h-7 text-white ml-1" /> // ml-1 to visually center the send icon
                ) : (
                  <User className="w-7 h-7 text-white" />
                )}
              </div>
            </div>

            {/* Dynamic Headers */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {step === 'telegram' ? 'Connect Account' : 'Complete Your Orbit'}
            </h2>
            <p className="text-white/60 text-center text-sm mb-8 px-2">
              {step === 'telegram'
                ? 'Quickly and securely verify your identity using Telegram.'
                : 'To ensure safety and respect age firewalls, please confirm your details.'}
            </p>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-6 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* Content Forms */}
            {step === 'telegram' ? (
              <div className="space-y-4">
                <button
                  onClick={() => handleTelegramLogin({ /* Mock/Actual TG Payload */ })}
                  disabled={isLoading}
                  className="relative w-full bg-[#2AABEE] text-white font-semibold py-3.5 rounded-xl hover:bg-[#229ED9] gentle-animation disabled:opacity-50 cursor-pointer shadow-lg shadow-[#2AABEE]/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Entering Orbit...' : 'Continue with Telegram'}
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-white/40">
                  <Shield className="w-4 h-4" />
                  <p className="text-xs tracking-wide">
                    Your identity is never revealed unless it's mutual.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 gentle-animation appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-black">Select Gender</option>
                    <option value="male" className="text-black">Male</option>
                    <option value="female" className="text-black">Female</option>
                  </select>
                </div>

                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 gentle-animation [color-scheme:dark]"
                />

                <button 
                  disabled={isLoading}
                  onClick={handleDemographicsSubmit}
                  className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isLoading ? 'Encrypting Details...' : 'Enter Dashboard'}
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-white/40">
                  <Shield className="w-4 h-4" />
                  <p className="text-xs tracking-wide">
                    No profiles. No browsing. Complete privacy.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}