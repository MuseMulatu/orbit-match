import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // Demographics State (Step 3)
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botUrl, setBotUrl] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsLoading(true); setError(null);
    try {
      const response = await api.post<{ success: boolean; botUrl: string }>('/api/auth/request-otp', { phone });
      setBotUrl(response.botUrl);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true); setError(null);
    try {
      const response = await api.post<{ success: boolean; token: string; user: any }>('/api/auth/verify-otp', { phone, otp });
      localStorage.setItem('zabiya_token', response.token);
      if (response.user.requires_demographics) {
        setStep(3); // Move to demographics
      } else {
        onClose();
        window.location.href = '/dashboard'; // 👈 BULLETPROOF REDIRECT
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemographicsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !birthDate) {
      setError('Please provide both gender and birth date.');
      return;
    }
    setIsLoading(true); setError(null);
    try {
      await api.post('/api/auth/user/demographics', { gender, birth_date: birthDate });
      onClose();
      window.location.href = '/dashboard'; 
    } catch (err: any) {
      setError(err.message || 'Failed to update demographics.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#111] border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] rounded-3xl p-8 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>

        <h2 className="text-2xl font-light text-white text-center mb-6">Enter Orbit</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        {/* STEP 1: REQUEST OTP (Unchanged) */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col space-y-4">
            <p className="text-sm text-white/60 text-center mb-2">We use Telegram to securely deliver your code.</p>
            <input type="tel" placeholder="Phone Number (e.g., +251...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/50" required />
            <button type="submit" disabled={isLoading || !phone} className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all">
              {isLoading ? 'Connecting...' : 'Request Login Code'}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP (Unchanged visually) */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
            <p className="text-sm text-white/60 text-center mb-4">Code requested for {phone}.</p>
            {botUrl && (
              <a href={botUrl} target="_blank" rel="noreferrer" className="w-full text-center bg-[#24A1DE]/10 border border-[#24A1DE]/50 text-[#24A1DE] font-medium py-3 rounded-xl hover:bg-[#24A1DE]/20 transition-all mb-2 flex justify-center items-center gap-2">
                <span>💬</span> Open Telegram to get code
              </a>
            )}
            <input type="text" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white text-center tracking-widest outline-none focus:border-white/50" required />
<button 
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            {/* 👈 UPGRADED CHANGE NUMBER BUTTON */}
            <button 
              type="button" 
              onClick={() => {
                setStep(1);
                setOtp(''); // Clear the bad OTP
                setError(null); // Clear any errors
              }}
              className="w-full text-sm text-white/50 hover:text-white mt-4 py-2 flex justify-center items-center gap-2 transition-colors cursor-pointer"
            >
              <span>←</span> Wrong number?
            </button>
          </form>
        )}

        {/* STEP 3: DEMOGRAPHICS (New) */}
        {step === 3 && (
          <form onSubmit={handleDemographicsSubmit} className="flex flex-col space-y-4">
             <p className="text-sm text-white/70 text-center mb-4">
              To ensure safety and respect age firewalls, please confirm your details.
            </p>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white/50">
              <option value="" disabled>Select Gender</option>
              <option value="male" className="bg-[#111]">Male</option>
              <option value="female" className="bg-[#111]">Female</option>
            </select>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white/50 [color-scheme:dark]" required />
            <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all mt-2">
              {isLoading ? 'Encrypting Details...' : 'Enter Dashboard'}
            </button>
          </form>
        )}

        <p className="text-xs text-white/40 text-center mt-6 tracking-wide">
          🔒 Your identity is never revealed unless it’s mutual.
        </p>
      </div>
    </div>
  );
}