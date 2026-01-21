'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  // For unique animation properties
  duration: number
  delay: number
}

const generateParticles = (count: number, colors: string[]): Particle[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 5 + 5, // Slower, more subtle pulse
    delay: Math.random() * -10, // Staggered start times
  }))
}

const HeroAnimation = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true)
    const gold = 'hsl(45 65% 52%)'
    const teal = 'hsl(177 72% 36%)'
    const navy = 'hsl(215 71% 13%)' // For subtle background stars
    setParticles(generateParticles(150, [gold, teal, navy, '#ffffff']))
  }, [])
  
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const { clientX, clientY } = event
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      mouseX.set((clientX - left) / width)
      mouseY.set((clientY - top) / height)
    }
  }

  const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
  }

  // Layer transformations for parallax
  const x1 = useTransform(mouseX, [0, 1], ['-5%', '5%'])
  const y1 = useTransform(mouseY, [0, 1], ['-5%', '5%'])
  const x2 = useTransform(mouseX, [0, 1], ['-3%', '3%'])
  const y2 = useTransform(mouseY, [0, 1], ['-3%', '3%'])
  const x3 = useTransform(mouseX, [0, 1], ['-1.5%', '1.5%'])
  const y3 = useTransform(mouseY, [0, 1], ['-1.5%', '1.5%'])

  if (!isClient) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-primary"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Glow */}
       <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.2), transparent 60%)',
          x: x1,
          y: y1
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Starfield */}
      <motion.svg 
        viewBox="0 0 100 100" 
        className="absolute inset-[-10%] w-[120%] h-[120%]" 
        preserveAspectRatio="xMidYMid slice"
        style={{x: x2, y: y2}}
      >
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size / 3} // Make stars smaller
            fill={particle.color}
            animate={{
              opacity: [0.1, 0.8, 0.1], // Twinkle effect
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </motion.svg>
      
      {/* Foreground Glowing Lines */}
       <motion.svg 
         viewBox="0 0 100 100" 
         className="absolute inset-[-15%] w-[130%] h-[130%]" 
         preserveAspectRatio="xMidYMid slice"
         style={{x: x3, y: y3}}
       >
         {/* Line 1 */}
        <motion.line
          x1="0" y1="30" x2="100" y2="40"
          stroke="hsl(var(--trust) / 0.15)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, delay: 1, ease: 'easeInOut' }}
        />
         {/* Line 2 */}
         <motion.line
          x1="100" y1="70" x2="0" y2="60"
          stroke="hsl(var(--premium) / 0.2)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, delay: 1.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  )
}

export default HeroAnimation
