
'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroAnimation() {
  const [toggle, setToggle] = useState(true);
  const controls = useAnimation();
  const gradients = [
    'linear-gradient(135deg, #2563EB, #9333EA)',
    'linear-gradient(135deg, #EC4899, #F59E0B)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #F43F5E, #6366F1)',
  ];
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);

  // Smooth gradient animation
  useEffect(() => {
    if (toggle) {
        controls.start({
            opacity: [0.8, 1, 0.9],
            transition: {
                opacity: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
            }
        });

        const interval = setInterval(() => {
            const next = gradients[Math.floor(Math.random() * gradients.length)];
            setCurrentGradient(next);
            controls.start({
                background: next,
                transition: { duration: 3, ease: 'easeInOut' }
            });
        }, 5000);

        return () => clearInterval(interval);
    } else {
        controls.start({ opacity: 0 });
    }
  }, [toggle, controls, gradients]);

  return (
    <>
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{ background: currentGradient }}
        initial={{ opacity: 0 }}
        animate={controls}
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
