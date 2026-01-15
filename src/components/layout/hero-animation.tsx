'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// ✅ Star type
interface StarType {
  id: number;
  x: number; // 0–100 (% of width)
  y: number; // 0–100 (% of height)
  size: number;
  duration: number;
}

// ✅ Single Star component
const Star: React.FC<StarType> = ({ x, y, size, duration }) => (
  <motion.circle
    cx={`${x}%`}
    cy={`${y}%`}
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
      repeatDelay: Math.random() * 2, // random delay for natural twinkle
    }}
  />
);

const HeroAnimation: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState<StarType[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const generatedStars: StarType[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 5 + 5,
    }));
    setStars(generatedStars);
  }, []);

  if (!isMounted) {
    return <div className="absolute inset-0 bg-background -z-10" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-background -z-10">
      {/* Layer 1: Radial Gradient */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        {/* Layer 2: Stars */}
        {stars.map(star => (
          <Star
            key={star.id}
            x={star.x}
            y={star.y}
            size={star.size}
            duration={star.duration}
          />
        ))}
      </svg>

      {/* Layer 3: Faint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          '--grid-color': 'hsl(var(--primary) / 0.05)',
          '--grid-size': '40px',
          backgroundSize: 'var(--grid-size) var(--grid-size)',
          backgroundImage:
            'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 60%)',
          opacity: 0.8,
        } as React.CSSProperties}
      ></div>
    </div>
  );
};

export default HeroAnimation;
