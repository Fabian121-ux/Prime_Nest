'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroAnimation() {
  const [toggle, setToggle] = useState(true);

  // For smooth color/gradient animation
  const [gradient, setGradient] = useState('linear-gradient(135deg, #2563EB, #9333EA)');

  useEffect(() => {
    if (!toggle) {
        // When toggled off, reset to a neutral state if desired
        setGradient('hsl(var(--background))');
        return;
    } else {
        // When toggled on, set initial gradient immediately
        setGradient('linear-gradient(135deg, #2563EB, #9333EA)');
    }

    const interval = setInterval(() => {
      const colors = [
        'linear-gradient(135deg, #2563EB, #9333EA)',
        'linear-gradient(135deg, #EC4899, #F59E0B)',
        'linear-gradient(135deg, #10B981, #3B82F6)',
        'linear-gradient(135deg, #F43F5E, #6366F1)',
      ];
      const next = colors[Math.floor(Math.random() * colors.length)];
      setGradient(next);
    }, 5000); // change gradient every 5s

    return () => clearInterval(interval);
  }, [toggle]);

  return (
    <>
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{ background: gradient }}
        animate={toggle ? { opacity: 1, rotate: [0, 2, 0], scale: [1, 1.02, 1] } : { opacity: 0 }}
        transition={{ 
            opacity: { duration: 0.5 },
            rotate: { duration: 10, repeat: Infinity, repeatType: 'loop' },
            scale: { duration: 10, repeat: Infinity, repeatType: 'loop' }
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
