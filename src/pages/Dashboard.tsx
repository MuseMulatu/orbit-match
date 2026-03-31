import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Trash2, ShieldCheck, LogOut, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { crushList, maxSlots, addCrush, removeCrush, simulateMatch, logout } = useApp();
  const [phoneInput, setPhoneInput] = useState('');
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const handleAddCrush = async () => {
    setAdding(true);
    await new Promise(r => setTimeout(r, 800));
    const result = addCrush(phoneInput);
    setAdding(false);

    if (result.success) {
      setPhoneInput('');
      toast({ title: 'Locked in', description: 'Your crush has been securely added.' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Hasab</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white/40 text-sm">Private Mode Active</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="glass-effect p-3 rounded-full text-white/60 hover:text-white gentle-animation cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Slots card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium">Active Slots</span>
            <span className="text-white font-bold">{crushList.length} / {maxSlots}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(crushList.length / maxSlots) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-white/60 rounded-full"
            />
          </div>
        </motion.div>

        {/* Add crush */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-white/60" />
            Lock in a crush
          </h3>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 gentle-animation"
            />
            <button
              onClick={handleAddCrush}
              disabled={adding || !phoneInput.trim()}
              className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-white/90 gentle-animation disabled:opacity-30 cursor-pointer shrink-0"
            >
              {adding ? '...' : 'Lock In'}
            </button>
          </div>
        </motion.div>

        {/* Crush list */}
        {crushList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-white/60 text-sm font-medium px-1">Your list</h3>
            {crushList.map((crush) => (
              <motion.div
                key={crush.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-effect rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-white/30" />
                  <div>
                    <p className="text-white font-mono text-sm">{crush.maskedPhone}</p>
                    <p className={`text-xs mt-0.5 ${crush.status === 'matched' ? 'text-emerald-400' : 'text-white/30'}`}>
                      {crush.status === 'matched' ? '✓ Matched' : 'Pending'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeCrush(crush.id)}
                  className="text-white/20 hover:text-red-400 gentle-animation cursor-pointer p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dev trigger */}
        {crushList.length > 0 && (
          <div className="pt-8 border-t border-white/5">
            <p className="text-white/20 text-xs mb-2 text-center">Dev Tools</p>
            <button
              onClick={() => {
                const pending = crushList.find(c => c.status === 'pending');
                if (pending) simulateMatch(pending.id);
              }}
              className="w-full border border-white/10 text-white/30 text-sm py-2 rounded-xl hover:bg-white/5 hover:text-white/50 gentle-animation flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              Simulate Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
