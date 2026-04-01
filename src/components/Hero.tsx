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
      // You can adjust the volume level of the Yung Kai song here
      videoRef.current.volume = isMuted ? 0 : 0.5;
    }
  }, [isMuted]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
 {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-50"
        autoPlay
        muted={isMuted} // Let React control the muted state directly
        loop
        playsInline
      >
        {/* Point to the local file in your public folder */}
        {/* If your file is public/videos/bg-video.mp4, the path is /videos/bg-video.mp4 */}
        <source src="/videos/bg-video.mp4" type="video/mp4" />
        
        {/* Fallback text if the browser doesn't support the video tag */}
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
          className="space-y-8 max-w-3xl"
        >
          {/* Main Tagline */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            Don't wait <br />
            <span className="text-white/80">for gravity.</span>
          </h1>

          {/* Subtext */}
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl text-white/90 font-medium">
              Zero Risk. Pure Intent. 
            </p>
            <p className="text-md sm:text-lg text-white/60 max-w-xl mx-auto italic">
              "There's a reason why gravity is the weakest force in the universe."
            </p>
          </div>

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