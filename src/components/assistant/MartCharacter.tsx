'use client';

import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';

const MotionBox = motion(Box);

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  trail: { x: number; y: number }[];
}

interface MartCharacterProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showBubble?: boolean;
  state?: 'idle' | 'thinking' | 'active' | 'loading';
}

// Antigravity-style color palette
const COLORS = [
  { r: 59, g: 130, b: 246 }, // Blue
  { r: 139, g: 92, b: 246 }, // Purple
  { r: 236, g: 72, b: 153 }, // Pink
  { r: 249, g: 115, b: 22 }, // Orange
  { r: 34, g: 197, b: 94 }, // Green
];

export function MartCharacter({
  message,
  size = 'md',
  showBubble = true,
  state = 'idle',
}: MartCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [initialized, setInitialized] = useState(false);

  const sizeMap = {
    sm: { width: 380, height: 200, particles: 25 },
    md: { width: 560, height: 300, particles: 40 },
    lg: { width: 750, height: 400, particles: 60 },
    full: { width: 0, height: 0, particles: 120 },
  };

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (size !== 'full') {
        const s = sizeMap[size];
        setDimensions({ width: s.width, height: s.height });
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({
            width: Math.floor(rect.width),
            height: Math.floor(Math.max(rect.height, 400)),
          });
        }
      }
    };

    const timer = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, [size]);

  // Initialize particles
  useEffect(() => {
    if (dimensions.width < 100 || dimensions.height < 100) return;

    const count = size === 'full' ? 120 : sizeMap[size].particles;

    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      size: 1 + Math.random() * 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.3 + Math.random() * 0.4,
      trail: [],
    }));

    setInitialized(true);
  }, [dimensions, size]);

  // Animation loop
  useEffect(() => {
    if (!initialized || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle) => {
        particle.trail.unshift({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) particle.trail.pop();

        // Simple hover repulse
        if (mouseRef.current.active) {
          const mdx = particle.x - mouseRef.current.x;
          const mdy = particle.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 100 && mDist > 0) {
            const force = ((100 - mDist) / 100) * 0.1;
            particle.vx += (mdx / mDist) * force;
            particle.vy += (mdy / mDist) * force;
          }
        }

        // Gentle damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Draw trail
        for (let i = 1; i < particle.trail.length; i++) {
          const t = particle.trail[i];
          const prev = particle.trail[i - 1];
          const trailAlpha = particle.alpha * (1 - i / particle.trail.length) * 0.2;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${trailAlpha})`;
          ctx.lineWidth = particle.size * (1 - i / particle.trail.length);
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw small glowing particle
        const grad = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        grad.addColorStop(
          0,
          `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`
        );
        grad.addColorStop(
          1,
          `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`
        );
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [initialized, dimensions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  const containerStyle =
    size === 'full'
      ? { width: '100%', height: '100%' }
      : { width: `${sizeMap[size].width}px`, height: `${sizeMap[size].height}px` };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      w={size === 'full' ? '100%' : 'auto'}
      h={size === 'full' ? '100%' : 'auto'}
    >
      {showBubble && message && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          bg="white"
          borderRadius="2xl"
          px={6}
          py={4}
          boxShadow="0 4px 24px rgba(0,0,0,0.08)"
          position="relative"
          maxW="400px"
          border="1px solid"
          borderColor="gray.100"
        >
          <Text fontSize="md" color="gray.700" textAlign="center" fontWeight="medium">
            {message}
          </Text>
        </MotionBox>
      )}

      <Box
        ref={containerRef}
        position="relative"
        cursor="pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...containerStyle}
        minH={size === 'full' ? '100%' : undefined}
      >
        {dimensions.width > 0 && dimensions.height > 0 && (
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              position: size === 'full' ? 'absolute' : 'relative',
              top: 0,
              left: 0,
            }}
          />
        )}
      </Box>
    </MotionBox>
  );
}
