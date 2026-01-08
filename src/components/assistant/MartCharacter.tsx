'use client';

import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';

const MotionBox = motion(Box);

interface Particle {
  id: number;
  // Spherical coordinates for formation
  theta: number;
  phi: number;
  radius: number;
  // Current position
  x: number;
  y: number;
  // Drift offset for ambient movement
  driftX: number;
  driftY: number;
  driftSpeed: number;
  driftPhase: number;
  // Visual
  size: number;
  baseAlpha: number;
  hue: number;
}

interface MartCharacterProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  showBubble?: boolean;
  state?: 'idle' | 'thinking' | 'active' | 'loading';
  darkMode?: boolean; // Use dark background (for landing page)
}

export function MartCharacter({
  message,
  size = 'md',
  showBubble = true,
  state = 'idle',
  darkMode = false,
}: MartCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isHoveredRef = useRef(false);
  const hoverProgressRef = useRef(0);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const sizeMap = {
    xs: { canvas: 60, ball: 15, particles: 40 },
    sm: { canvas: 120, ball: 25, particles: 80 },
    md: { canvas: 200, ball: 40, particles: 150 },
    lg: { canvas: 280, ball: 55, particles: 200 },
    full: { canvas: 380, ball: 75, particles: 280 },
  };

  const config = sizeMap[size];
  const centerX = config.canvas / 2;
  const centerY = config.canvas / 2;

  // Initialize particles in a perfect sphere
  useEffect(() => {
    const particles: Particle[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < config.particles; i++) {
      // Fibonacci sphere distribution for even spacing
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / config.particles);

      // Convert to 2D with some depth variation
      const r = config.ball * (0.3 + Math.random() * 0.7);

      particles.push({
        id: i,
        theta,
        phi,
        radius: r,
        x: centerX,
        y: centerY,
        driftX: 0,
        driftY: 0,
        driftSpeed: 0.3 + Math.random() * 0.5,
        driftPhase: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2,
        baseAlpha: 0.4 + Math.random() * 0.5,
        hue: [210, 260, 320, 30, 180][Math.floor(Math.random() * 5)] + Math.random() * 20, // Blue, purple, pink, orange, cyan
      });
    }

    particlesRef.current = particles;
  }, [config.particles, config.ball, centerX, centerY]);

  // Smooth animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.008; // Slow time for dreamy effect
      const t = timeRef.current;

      // Smooth hover transition (eased)
      const targetProgress = isHoveredRef.current ? 1 : 0;
      const diff = targetProgress - hoverProgressRef.current;
      hoverProgressRef.current += diff * 0.03; // Very smooth transition
      const progress = hoverProgressRef.current;

      // Clear with slight fade for trail effect
      const bgColor = darkMode ? 'rgba(23, 25, 35, 0.15)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, config.canvas, config.canvas);

      // Breathing scale
      const breathe = 1 + Math.sin(t * 0.8) * 0.04;

      // Sort particles by calculated depth for proper layering
      const sortedParticles = [...particlesRef.current].sort((a, b) => {
        const depthA = Math.sin(a.phi) * Math.cos(a.theta + t * 0.2);
        const depthB = Math.sin(b.phi) * Math.cos(b.theta + t * 0.2);
        return depthA - depthB;
      });

      sortedParticles.forEach((particle) => {
        // Spherical to 2D projection with slow rotation
        const rotatedTheta = particle.theta + t * 0.15;
        const x3d = Math.sin(particle.phi) * Math.cos(rotatedTheta);
        const y3d = Math.sin(particle.phi) * Math.sin(rotatedTheta);
        const z3d = Math.cos(particle.phi);

        // Depth factor for 3D effect
        const depth = (z3d + 1) / 2; // 0 to 1

        // Base position in sphere
        const baseX = centerX + x3d * particle.radius * breathe;
        const baseY = centerY + y3d * particle.radius * breathe;

        // Ambient drift (always active, very subtle)
        const driftAmount = 2;
        particle.driftX = Math.sin(t * particle.driftSpeed + particle.driftPhase) * driftAmount;
        particle.driftY =
          Math.cos(t * particle.driftSpeed * 0.7 + particle.driftPhase) * driftAmount;

        // Explode outward on hover
        const explodeDistance = config.ball * 1.8;
        const explodeX = centerX + x3d * explodeDistance + particle.driftX * 3;
        const explodeY = centerY + y3d * explodeDistance + particle.driftY * 3;

        // Smoothly interpolate position
        const easeProgress = progress * progress * (3 - 2 * progress); // Smoothstep
        particle.x = baseX + particle.driftX + (explodeX - baseX - particle.driftX) * easeProgress;
        particle.y = baseY + particle.driftY + (explodeY - baseY - particle.driftY) * easeProgress;

        // Mouse repulsion - particles flee from cursor when hovered
        if (isHoveredRef.current && progress > 0.1) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 80;

          if (dist < repelRadius && dist > 0) {
            const force = ((repelRadius - dist) / repelRadius) * 25 * progress;
            particle.x += (dx / dist) * force;
            particle.y += (dy / dist) * force;
          }
        }

        // Alpha based on depth and hover state
        const depthAlpha = 0.3 + depth * 0.7;
        const alpha = particle.baseAlpha * depthAlpha * (1 - easeProgress * 0.3);

        // Size varies with depth
        const particleSize = particle.size * (0.6 + depth * 0.6);

        // Draw soft glowing particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particleSize * 3
        );

        const saturation = 85 + depth * 10;
        const lightness = 55 + depth * 15;

        gradient.addColorStop(0, `hsla(${particle.hue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(
          0.4,
          `hsla(${particle.hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`
        );
        gradient.addColorStop(1, `hsla(${particle.hue}, ${saturation}%, ${lightness}%, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [config.canvas, config.ball, centerX, centerY, darkMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      {showBubble && message && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
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
        position="relative"
        cursor="pointer"
        overflow="visible"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        width={`${config.canvas}px`}
        height={`${config.canvas}px`}
      >
        <canvas
          ref={canvasRef}
          width={config.canvas}
          height={config.canvas}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </MotionBox>
  );
}
