'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const HeroAnimation = () => {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // This needs to be client-side only
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 5 + 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 80%)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Stars */}
      <svg width="100%" height="100%" className="absolute inset-0">
        {stars.map(star => (
          <motion.circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="hsl(var(--primary) / 0.5)"
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default HeroAnimation;
