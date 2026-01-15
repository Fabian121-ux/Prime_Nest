'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState, useMemo } from 'react';

const HeroAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particleVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.7, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  if (!isMounted) {
    return <div className="absolute inset-0 bg-background -z-10" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Layer 1: Core Glow */}
        <motion.div
          className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />

        {/* Layer 2: Rotating Outer Gradient */}
        <motion.div
          className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background:
              'radial-gradient(circle, transparent 50%, hsl(var(--primary) / 0.1) 70%, transparent 90%)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Layer 3: Faint Grid */}
        <div
          className="absolute inset-0 bg-grid"
          style={{
            '--grid-color': 'hsl(var(--primary) / 0.05)',
            '--grid-size': '40px',
            backgroundSize: 'var(--grid-size) var(--grid-size)',
            backgroundImage:
              'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 60%)',
            opacity: 0.8,
          }}
        ></div>

      </motion.div>
    </div>
  );
};

export default HeroAnimation;
