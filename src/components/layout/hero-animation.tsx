'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroAnimation() {
  const gradients = [
    'linear-gradient(135deg, #2563EB, #9333EA)',
    'linear-gradient(135deg, #EC4899, #F59E0B)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #F43F5E, #6366F1)',
  ];
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);

  // Smooth gradient animation
  useEffect(() => {
    const interval = setInterval(() => {
      const next = gradients[Math.floor(Math.random() * gradients.length)];
      setCurrentGradient(next);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating stars
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // 1-4px
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  // Glowing graph lines
  const lines = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    duration: Math.random() * 20 + 15,
  }));

  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
      {/* Gradient Background */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ background: currentGradient }}
        animate={{
          opacity: [0.85, 1, 0.9],
          rotate: [0, 2, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      {/* Floating Stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            top: '100%',
            left: `${star.x}%`,
            opacity: star.opacity,
          }}
          animate={{ y: ['100%', '-10%'] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Glowing Graph Lines */}
      {lines.map(line => (
        <motion.div
          key={line.id}
          className="absolute left-0 w-full h-0.5 bg-white/30 blur-sm"
          style={{ top: `${line.top}%` }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
