import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export function HeroSection() {
  const { setShowAuthModal } = useApp();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0;
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 0.7;
    }
  }, [isMuted]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-50 glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-6 max-w-2xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            Zero Risk.
            <br />
            <span className="text-white/80">Pure Intent.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-lg mx-auto">
            Find out if the feeling is mutual — without ruining the friendship.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-black font-bold px-10 py-4 rounded-xl text-lg hover:bg-white/90 gentle-animation cursor-pointer"
          >
            Enter Hasab
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-sm"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          ↓
        </motion.div>
      </motion.div>
    </div>
  );
}
