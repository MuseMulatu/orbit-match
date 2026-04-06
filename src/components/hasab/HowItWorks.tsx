'use client'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'

const processSteps = [
  {
    number: "01",
    title: "You Notice",
    description: "Someone's been on your mind. A classmate, a friend, someone in your orbit.",
    color: "blue-500"
  },
  {
    number: "02", 
    title: "You Add Them",
    description: "Enter their number or handle. It stays completely private — no alerts, no signals.",
    color: "emerald-500"
  },
  {
    number: "03",
    title: "They Orbit Too",
    description: "If they’ve also been thinking about you, they might add you too — independently.",
    color: "purple-500"
  },
  {
    number: "04",
    title: "Zabiya Connects",
    description: "Only when it's mutual, the distance closes. Both of you are revealed instantly.",
    color: "blue-500"
  },
  {
    number: "05",
    title: "No Risk, Just Clarity",
    description: "No guessing. No embarrassment. Just truth — when it’s real.",
    color: "purple-500"
  }
];

export function HowItWorks() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Unified sequence array
  const sequence = [
    { type: 'start' },
    ...processSteps.map(step => ({ type: 'step', ...step })),
    { type: 'end' },
    { type: 'spacer' }, // Adds one card worth of space
    { type: 'spacer' }  // Adds a second card worth of space
  ];

  // Duplicated track ensures seamless looping
  const seamlessTrack = [...sequence, ...sequence];

  if (!isMounted) return null;

  return (
    <section id="about" className="relative py-20 bg-background overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      {/* Subtle Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              How Zabiya Works
            </span>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-foreground">
              How It Works
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From silent interest to mutual clarity — without ever taking the risk first.
          </p>
        </div>

        {/* The Orbit Track */}
        <div className="relative max-w-7xl mx-auto">
          
          <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800"
               style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Celestial Edges - Top (Slowed Down) */}
            <div className="absolute top-0 left-0 right-0 h-8 z-20 overflow-hidden flex items-center bg-gradient-to-b from-black/60 to-transparent">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 80 }} // Increased duration for slow drift
                className="flex items-center gap-8 w-max px-4"
              >
                {[...Array(60)].map((_, i) => (
                  <div key={`top-${i}`} className="flex gap-8 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <div className="w-1 h-1 rounded-full bg-gray-600/30" />
                    <div className="w-2 h-2 rounded-full bg-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Celestial Edges - Bottom (Slowed Down) */}
            <div className="absolute bottom-0 left-0 right-0 h-8 z-20 overflow-hidden flex items-center bg-gradient-to-t from-black/60 to-transparent">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }} 
                transition={{ repeat: Infinity, ease: "linear", duration: 90 }} // Increased duration for slow drift
                className="flex items-center gap-8 w-max px-4"
              >
                {[...Array(60)].map((_, i) => (
                  <div key={`bot-${i}`} className="flex gap-8 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="w-1 h-1 rounded-full bg-gray-600/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Seamless Scrolling Cards Container */}
            <div className="relative py-12 px-0 overflow-hidden h-80 max-w-full flex items-center">
              
              {/* Framer Motion smoothly translates the container. 
                  "easeInOut" creates the slow-fast-slow cinematic pacing.
              */}
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "easeInOut", duration: 35 }} 
                className="flex items-center w-max gap-8 pl-8"
              >
                {seamlessTrack.map((item, index) => {
                  
                  // 1. START CARD
                  if (item.type === 'start') {
                    return (
                      <div key={`start-${index}`} className="flex-shrink-0 w-72 h-56 rounded-xl border-2 border-gray-200 bg-white flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent" />
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 animate-[spin_10s_linear_infinite] mb-4" />
                        <div className="text-gray-500 font-mono tracking-widest text-sm uppercase z-10">● YOU NOTICE</div>
                      </div>
                    )
                  }

                  // 2. PROCESS CARDS
                  if (item.type === 'step') {
                    return (
                      <div
                        key={`step-${item.number}-${index}`}
                        className={`flex-shrink-0 w-80 h-56 bg-white rounded-xl border-2 border-gray-100 relative overflow-visible shadow-xl`}
                      >
                        {/* Number Badge */}
                        <div className="absolute -top-5 -left-5 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center font-black z-10 border-4 border-white text-xl shadow-md">
                          {item.number}
                        </div>
                                           
                        <div className="relative h-full p-8 pt-10 flex flex-col justify-center">
                          <h3 className="font-bold text-2xl mb-3 text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )
                  }

                  // 3. END CARD (The Celestial Merge)
                 if (item.type === 'end') {
                  return (
                    <div key={index} className="w-96 h-56 bg-white rounded-xl flex flex-col items-center justify-center shadow-xl">

                      {/* 💫 MERGE INTO HEART */}
                      <div className="relative w-24 h-24 mb-4">

                        <motion.div
                          animate={{ x: [-30, 0, -30] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute w-6 h-6 bg-blue-500 rounded-full"
                        />

                        <motion.div
                          animate={{ x: [30, 0, 30] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute w-6 h-6 bg-emerald-500 rounded-full right-0"
                        />

                        <motion.div
                          animate={{ scale: [0.5, 1.4, 0.5], opacity: [0,1,0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute inset-0 flex items-center justify-center text-pink-500 text-2xl"
                        >
                          ♥
                        </motion.div>
                      </div>

                      <div className="font-bold text-gray-900">
                        Alas, It’s Mutual
                      </div>
                    </div>
                  )
                }

                  // 4. SPACER CARDS
                  if (item.type === 'spacer') {
                    return (
                      <div key={`spacer-${index}`} className="flex-shrink-0 w-80 h-56 opacity-0 pointer-events-none" />
                    )
                  }
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-6 bg-card/50 backdrop-blur-md border border-gray-800 rounded-2xl px-6 py-4">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-gray-300">100% Private & Encrypted</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-gray-800" />
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
              <span className="text-xs sm:text-sm font-semibold text-gray-300">Zero Social Risk</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-gray-800" />
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
              <span className="text-xs sm:text-sm font-semibold text-gray-300">Only Mutual Matches Revealed</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}