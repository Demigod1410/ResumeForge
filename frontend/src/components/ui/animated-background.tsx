"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Particle class for the 3D wave effect
  class Particle {
    x: number;
    y: number;
    z: number;
    origX: number;
    origY: number;
    origZ: number;
    color: string;
    size: number;
    vz: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.z = 0;
      this.origX = x;
      this.origY = y;
      this.origZ = 0;
      // More vibrant colors - incorporating purples, blues, and cyans
      const hue = Math.random() * 80 + 180; // 180-260 range (blues to purples)
      const saturation = Math.random() * 30 + 70; // 70-100%
      const lightness = Math.random() * 20 + 60; // 60-80%
      this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`;
      this.size = Math.random() * 3 + 1.5; // Larger particles
      this.vz = Math.random() * 0.05 - 0.025; // More vertical movement
    }

    update(mouseX: number, mouseY: number, canvas: HTMLCanvasElement) {
      const dx = this.origX - mouseX;
      const dy = this.origY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.min(canvas.width, canvas.height) * 0.4;
      
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 20;
        this.z = force;
      } else {
        this.z += (0 - this.z) * 0.03;
      }
      
      this.z += this.vz;
      this.z *= 0.99; // Dampen the effect over time
    }

    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Scale effect based on z-position
      const scale = (this.z + 10) / 10;
      const opacity = Math.min(Math.max(0.3, (this.z + 20) / 30), 0.9); // Higher opacity
      
      // Draw glow effect
      const glow = this.size * scale * 2;
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, glow
      );
      
      gradient.addColorStop(0, this.color.replace("0.9", "0.8"));
      gradient.addColorStop(1, this.color.replace("0.9", "0"));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw particle
      ctx.fillStyle = this.color.replace("0.9", opacity.toString());
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Connecting lines for nearby particles - more connections and brighter
      particlesRef.current.forEach(p => {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 70) { // Increased connection distance
          ctx.beginPath();
          const lineOpacity = 0.2 * (1 - dist / 70); // Brighter lines
          ctx.strokeStyle = `hsla(210, 100%, 80%, ${lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize particles - MOVED UP before it's used
    const initParticles = () => {
      particlesRef.current = [];
      // Much higher density of particles - multiply by 3
      const particleCount = Math.floor((canvas.width * canvas.height) / 3000); 
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
      
      // Add some special larger particles as highlights
      for (let i = 0; i < 20; i++) {
        const particle = new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        );
        particle.size = particle.size * 3; // Make them significantly larger
        particle.color = `hsla(${Math.random() * 40 + 190}, 100%, 80%, 0.9)`; // Brighter color
        particlesRef.current.push(particle);
      }
    };
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles on resize
      initParticles();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Track mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient - much more vibrant
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 1)'); // dark blue
      gradient.addColorStop(0.5, 'rgba(76, 29, 149, 0.7)'); // purple
      gradient.addColorStop(1, 'rgba(30, 64, 175, 0.9)'); // blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines for more visual structure
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      
      // Draw horizontal grid lines
      const gridSize = 40;
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw vertical grid lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Update and draw particles - with larger sizes and more vibrant colors
      particlesRef.current.forEach(particle => {
        particle.update(mousePosition.current.x, mousePosition.current.y, canvas);
        particle.draw(ctx, canvas);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    initParticles();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Static background to ensure we have color even before canvas loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-blue-900" />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Light effects overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      
      {/* Animated light beam */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"] 
        }}
        transition={{ 
          repeat: Infinity,
          repeatType: "reverse",
          duration: 15,
          ease: "linear"
        }}
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(156, 163, 255, 0.4) 0%, rgba(0, 0, 0, 0) 60%)",
          backgroundSize: "120% 120%"
        }}
      />
      
      {/* Animated glow spots */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 20%),
            radial-gradient(circle at 80% 50%, rgba(124, 58, 237, 0.4) 0%, transparent 25%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 30%)
          `,
        }}
      />
    </div>
  );
}
