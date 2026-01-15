'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroAnimation() {
  const [toggle, setToggle] = useState(true);
  const [gradient, setGradient] = useState('linear-gradient(135deg, #2563EB, #9333EA)');

  useEffect(() => {
    if (!toggle) {
      setGradient('hsl(var(--background))'); // neutral background when off
      return;
    }

    setGradient('linear-gradient(135deg, #2563EB, #9333EA)');

    const interval = setInterval(() => {
      const colors = [
        'linear-gradient(135deg, #2563EB, #9333EA)',
        'linear-gradient(135deg, #EC4899, #F59E0B)',
        'linear-gradient(135deg, #10B981, #3B82F6)',
        'linear-gradient(135deg, #F43F5E, #6366F1)',
      ];
      setGradient(colors[Math.floor(Math.random() * colors.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [toggle]);

  return (
    <>
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{ background: gradient }}
        animate={toggle ? {
          opacity: [0.8, 1, 0.8],
          rotate: [0, 2, 0],
          scale: [1, 1.02, 1]
        } : { opacity: 0 }}
        transition={{
          opacity: { duration: 1, repeat: Infinity, repeatType: 'mirror' },
          rotate: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
          scale: { duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }
        }}
      />

      {/* Toggle Button */}
      <button
        onClick={() => setToggle(!toggle)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/70 hover:bg-white/90 shadow-md text-sm transition-colors"
      >
        {toggle ? '💥 On' : '⚡ Off'}
      </button>
    </>
  );
}
