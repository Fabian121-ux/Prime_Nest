'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const Star = ({ x, y, size, duration }: { x: number; y: number; size: number; duration: number }) => (
  <motion.circle
    cx={x}
    cy={y}
    r={size}
    fill="hsl(var(--primary) / 0.5)"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
    }}
    transition={{
      duration: duration,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 5, // Add a delay before repeating
    }}
  />
);


const HeroAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // This code now runs only on the client, after the component has mounted.
    setIsMounted(true);
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 5 + 5,
    }));
    setStars(newStars);
  }, []); // The empty dependency array is crucial.

  if (!isMounted) {
    // Render a static background on the server and during initial client render
    // to prevent hydration errors.
    return <div className="absolute inset-0 bg-background -z-10" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
         {stars.map(star => (
          <Star key={star.id} x={`${star.x}%`} y={`${star.y}%`} size={star.size} duration={star.duration} />
        ))}
      </svg>
        
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
    </div>
  );
};

export default HeroAnimation;
