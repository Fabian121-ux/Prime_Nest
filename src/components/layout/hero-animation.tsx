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

const Star: React.FC<StarType> = ({ x, y, size, duration }) => (
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
      repeatDelay: Math.random() * 2,
    }}
  />
);

const HeroAnimation: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState<StarType[]>([]);
  const [viewBox, setViewBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // This effect runs only on the client
    setIsMounted(true);
    
    // We can safely access window dimensions here
    const width = window.innerWidth;
    const height = 500; // Approx height of hero section
    setViewBox({ width, height });

    const generatedStars: StarType[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 5 + 5,
    }));
    setStars(generatedStars);
  }, []);

  if (!isMounted) {
    // Render nothing on the server to prevent hydration mismatch
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
       <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.3), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <svg width="100%" height="100%" viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} className="absolute inset-0">
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
