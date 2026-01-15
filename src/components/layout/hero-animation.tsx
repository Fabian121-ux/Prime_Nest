'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface StarType {
  id: number;
  x: number; // in px
  y: number; // in px
  size: number;
  duration: number;
  drift: number;
  opacity: number;
}

const HeroAnimation = () => {
  const [stars, setStars] = useState<StarType[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const xParallax = useTransform(mouseX, [0, 1], [-15, 15]);
  const yParallax = useTransform(mouseY, [0, 1], [-15, 15]);

  // Update container dimensions
  useEffect(() => {
    const updateSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Generate stars
  useEffect(() => {
    const newStars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 5 + 5,
      drift: Math.random() * 10 - 5,
      opacity: Math.random() * 0.6 + 0.4,
    }));
    setStars(newStars);
  }, [width, height]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.8), transparent 70%)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Stars */}
      <svg width="100%" height="100%" className="absolute inset-0">
        {stars.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="hsl(var(--primary) / 0.9)"
            style={{ x: xParallax, y: yParallax }}
            animate={{
              cy: [star.y, -10],
              cx: [star.x, star.x + star.drift],
              opacity: [0, star.opacity, star.opacity, 0],
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
