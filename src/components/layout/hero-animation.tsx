'use client'

import { motion, useMotionValue, useTransform, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  animation: {
    scale: number[]
    opacity: number[]
    duration: number
    delay: number
  }
}

const generateParticles = (count: number, colors: string[]): Particle[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    animation: {
      scale: [1, Math.random() * 1.5 + 0.5, 1],
      opacity: [0, Math.random() * 0.5 + 0.2, 0],
      duration: Math.random() * 8 + 4,
      delay: -Math.random() * 12,
    },
  }))
}

const HeroAnimation = () => {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setIsClient(true)
    const gold = 'hsl(45 65% 52%)'
    const teal = 'hsl(177 72% 36%)'
    setParticles(generateParticles(100, [gold, teal, 'hsl(var(--primary-foreground))']))
  }, [])

  if (!isClient) {
    return null
  }
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-primary">
        <div className="absolute inset-0">
            {/* Rotating glow */}
            <motion.div
                className="absolute inset-0"
                style={{
                background:
                    'radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent 70%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            />

            {/* Stars */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                {particles.map(particle => (
                <motion.circle
                    key={particle.id}
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size}
                    fill={particle.color}
                    animate={{
                        scale: particle.animation.scale,
                        opacity: particle.animation.opacity,
                    }}
                    transition={{
                        duration: particle.animation.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: particle.animation.delay,
                    }}
                />
                ))}
            </svg>
        </div>
    </div>
  )
}

export default HeroAnimation
