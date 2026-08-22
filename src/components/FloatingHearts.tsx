import React, { useEffect, useRef } from 'react';

interface FloatingHeartsProps {
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'heart' | 'petal' | 'sparkle';
}

export function FloatingHearts({ interactive = true }: FloatingHeartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 63, 94, 0.45)', // Rose
      'rgba(251, 113, 133, 0.4)', // Pink
      'rgba(225, 29, 72, 0.35)', // Crimson
      'rgba(254, 205, 211, 0.6)', // Soft peach
      'rgba(255, 228, 230, 0.5)', // Pale cream rose
    ];

    const particles: Particle[] = [];
    const maxParticles = Math.min(28, Math.floor(width / 45));

    const createParticle = (customX?: number, customY?: number, isBurst = false): Particle => {
      const typeRand = Math.random();
      const type: 'heart' | 'petal' | 'sparkle' =
        typeRand > 0.4 ? 'heart' : typeRand > 0.15 ? 'petal' : 'sparkle';

      return {
        x: customX ?? Math.random() * width,
        y: customY ?? (isBurst ? customY || height / 2 : height + Math.random() * 50),
        size: isBurst ? Math.random() * 14 + 10 : Math.random() * 12 + 8,
        speedY: isBurst ? (Math.random() - 0.7) * 3 : -(Math.random() * 0.8 + 0.35),
        speedX: isBurst ? (Math.random() - 0.5) * 4 : Math.sin(Math.random() * Math.PI) * 0.4 - 0.2,
        opacity: isBurst ? 0.9 : Math.random() * 0.5 + 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
      };
    };

    // Initial population
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle(Math.random() * width, Math.random() * height);
      particles.push(p);
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.8, 0, size);
      // bottom right curve
      ctx.bezierCurveTo(0, size * 0.8, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.8, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = 'rgba(255, 245, 230, 0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation, p.opacity);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.color, p.rotation, p.opacity);
        } else {
          drawSparkle(ctx, p.x, p.y, p.size, p.opacity);
        }

        // Reset if particle moves out of viewport
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
      if (clientX === undefined || clientY === undefined) return;

      // Spawn a burst of 5-7 little hearts
      for (let i = 0; i < 6; i++) {
        particles.push(createParticle(clientX, clientY, true));
        if (particles.length > maxParticles + 15) {
          particles.shift();
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      id="floating-hearts-canvas"
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
}
