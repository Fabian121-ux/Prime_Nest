'use client';

import { motion } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Point {
  x: number;
  y: number;
}

interface Connection {
  p1: Point;
  p2: Point;
}

const generatePoints = (width: number, height: number, spacing: number): Point[] => {
  const points: Point[] = [];
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      points.push({ x, y });
    }
  }
  return points;
};

const HeroAnimation = () => {
  const [viewBox, setViewBox] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();
  const gridSpacing = isMobile ? 80 : 100;
  const numConnections = isMobile ? 3 : 5;

  useEffect(() => {
    // Set initial viewbox size on the client
    setViewBox({ width: window.innerWidth, height: 400 });
  }, []);

  const points = useMemo(() => {
    if (viewBox.width === 0) return [];
    return generatePoints(viewBox.width, viewBox.height, gridSpacing);
  }, [viewBox.width, viewBox.height, gridSpacing]);

  const connections = useMemo(() => {
    if (points.length < 2) return [];
    const newConnections: Connection[] = [];
    const usedPoints = new Set<number>();

    for (let i = 0; i < numConnections; i++) {
        let p1Index, p2Index;
        let attempts = 0;
        do {
            p1Index = Math.floor(Math.random() * points.length);
            p2Index = Math.floor(Math.random() * points.length);
            attempts++;
        } while ((p1Index === p2Index || usedPoints.has(p1Index) || usedPoints.has(p2Index)) && attempts < 50);

        if (attempts < 50) {
            usedPoints.add(p1Index);
            usedPoints.add(p2Index);
            newConnections.push({ p1: points[p1Index], p2: points[p2Index] });
        }
    }
    return newConnections;
  }, [points, numConnections]);


  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: [0, 0.4, 0],
      transition: {
        pathLength: { type: 'spring', duration: 3, bounce: 0 },
        opacity: { duration: 5, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" },
      },
    }),
  };

  if (viewBox.width === 0) {
    return <div className="absolute inset-0 bg-background" />;
  }

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid slice"
        className="opacity-40"
      >
        <g>
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill="hsl(var(--primary))"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.01 }}
            />
          ))}
        </g>
        <g>
          {connections.map((c, i) => (
            <motion.line
              key={i}
              x1={c.p1.x}
              y1={c.p1.y}
              x2={c.p2.x}
              y2={c.p2.y}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
};

export default HeroAnimation;
