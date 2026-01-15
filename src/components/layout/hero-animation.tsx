'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroAnimation() {
  // Motion values for mouse hover parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const xParallax = useTransform(mouseX, [0, 1], [-20, 20]);
  const yParallax = useTransform(mouseY, [0, 1], [-20, 20]);

  // Floating stars
  const [stars] = useState(
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // 1-4px
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10,
      opacity: Math.random() * 0.6 + 0.3,
    }))
  );

  // Glowing horizontal lines
  const [lines] = useState(
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      opacity: Math.random() * 0.3 + 0.2,
    }))
  );

  // Background gradient
  const gradients = [
    'linear-gradient(135deg, #2563EB, #9333EA)',
    'linear-gradient(135deg, #EC4899, #F59E0B)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #F43F5E, #6366F1)',
  ];
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = gradients[Math.floor(Math.random() * gradients.length)];
      setCurrentGradient(next);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }}
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ background: currentGradient }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      />

      {/* Floating Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.left}%`,
            top: '100%',
            opacity: star.opacity,
            x: xParallax,
            y: yParallax,
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

      {/* Glowing Horizontal Lines */}
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute left-0 w-full h-[1px] bg-white/20 blur-sm"
          style={{
            top: `${line.top}%`,
            opacity: line.opacity,
            x: xParallax,
            y: yParallax,
          }}
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
