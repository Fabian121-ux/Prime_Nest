'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface StarType {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

const HeroAnimation = () => {
  const [stars, setStars] = useState<StarType[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // 0-100 for viewBox coordinates
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 5 + 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Animated radial gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.5), transparent 80%)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 30, // Slow rotation
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Stars layer - Only render on the client */}
      {hasMounted && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          {stars.map(star => (
            <motion.circle
              key={star.id}
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill="hsl(var(--primary) / 0.7)"
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
      )}


      {/* Optional faint grid for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage:
            'linear-gradient(to right, hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.05) 1px, transparent 1px)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default HeroAnimation;
