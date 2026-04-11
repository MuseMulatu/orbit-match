import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export function HeroSection() {
  const { setShowAuthModal } = useApp();
  // 1. Change initial state to false (unmuted by default)
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // 2. Set initial volume and unmute
      video.volume = 0.5;
      video.muted = false;
      video.defaultMuted = false;

      // 3. Attempt to play with sound
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // 4. BROWSER AUTOPLAY POLICY FALLBACK
          // If the browser blocks unmuted autoplay, we catch the error 
          // and fall back to playing it muted so the visual background still works.
          console.warn("Autoplay with sound was blocked. Falling back to muted autoplay.", error);
          setIsMuted(true);
          video.muted = true;
          video.volume = 0;
          video.play().catch(() => {
             // Handle extremely strict browsers that block even muted autoplay
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : 0.5;
    }
  }, [isMuted]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-50"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto" 
        poster="/images/hero-poster.jpg" 
      >
        {/* Put WebM first! Browsers that support it will grab the smaller file */}
        <source src="/videos/bg-video.webm" type="video/webm" />
        <source src="/videos/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay to make text pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-50 glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </motion.button>

      {/* Sound On Hint (Only shows when muted) */}
      {isMuted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-20 right-8 z-50 text-white/70 text-sm font-medium tracking-wide"
        >
          Turn on sound ↗
        </motion.div>
      )}

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
            <span className="text-white/80">See if it's mutual.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-lg mx-auto">
            Find out if the feeling is mutual — without ruining the friendship.
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)}
            className="mt-4 bg-white text-black font-bold px-12 py-4 rounded-full text-lg hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.3)] gentle-animation cursor-pointer transition-all"
          >
            Enter Zabiya
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest uppercase"
      >
        <div className="flex flex-col items-center gap-2">
          <span>Discover</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            ↓
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}