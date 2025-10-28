import React, { useEffect, useRef } from 'react';

// Particle interface
interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  update: (mouseX: number, mouseY: number, canvas: HTMLCanvasElement) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// Spark interface
interface Spark {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  isDead: () => boolean;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      opacity: number;
      speedX: number;
      speedY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
      }

      update(mouseX: number, mouseY: number) {
        // Distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          // Push away from cursor
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        } else {
          // Return to base position
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }

        // Gentle drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundaries
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(251, 146, 60, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Spark class for sparkle effects
    class Spark {
      x: number;
      y: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.opacity = 1;
        this.maxLife = Math.random() * 60 + 40; // 40-100 frames
        this.life = 0;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.5; // Slight upward bias
        
        // Random colors: orange, yellow, white
        const colors = [
          'rgba(251, 146, 60', // orange-400
          'rgba(253, 186, 116', // orange-300
          'rgba(255, 237, 213', // orange-100
          'rgba(255, 255, 255', // white
          'rgba(251, 191, 36', // amber-400
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        
        // Fade out based on life
        const lifeRatio = this.life / this.maxLife;
        this.opacity = 1 - lifeRatio;
        
        // Slow down over time
        this.speedX *= 0.98;
        this.speedY *= 0.98;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Main spark
        ctx.fillStyle = `${this.color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = `${this.color}, ${this.opacity * 0.8})`;
        ctx.fillStyle = `${this.color}, ${this.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    // Initialize particles
    const particleCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(new Particle(x, y));
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY + window.scrollY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    let frameCount = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Generate new sparks randomly (1-3 sparks every 8-15 frames)
      if (frameCount % Math.floor(Math.random() * 8 + 8) === 0) {
        const sparkCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < sparkCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          sparksRef.current.push(new Spark(x, y));
        }
      }

      // Update and draw sparks
      sparksRef.current = sparksRef.current.filter(spark => {
        spark.update();
        if (!spark.isDead()) {
          spark.draw(ctx);
          return true;
        }
        return false;
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particle.update(mouseRef.current.x, mouseRef.current.y, canvas);

        // Draw lines to nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15;
            ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        particle.draw(ctx);
      });

      // Add glow effect near cursor
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        200
      );
      gradient.addColorStop(0, 'rgba(251, 146, 60, 0.03)');
      gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.01)');
      gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
}
