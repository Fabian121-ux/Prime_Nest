'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StarType {
  id: number
  x: number
  y: number
  size: number
  duration: number
}

const HeroAnimation = () => {
  const [stars, setStars] = useState<StarType[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        duration: Math.random() * 6 + 6,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Rotating glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, hsl(var(--primary) / 0.25), transparent 70%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Stars */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {stars.map(star => (
          <motion.circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="hsl(var(--primary) / 0.8)"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default HeroAnimation