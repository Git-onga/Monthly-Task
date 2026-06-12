import { useEffect, useRef } from 'react';

const RUNE_SET = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛈ','ᛇ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ','⚡','✦','✧','⊕','⊗','⋆'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn standard star and rune particles on mouse move
      const count = Math.random() > 0.75 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const char = RUNE_SET[Math.floor(Math.random() * RUNE_SET.length)];
        const size = 11 + Math.random() * 14;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.8;
        
        // Pick gold-adjacent magic colors
        const colors = ['#d4af37', '#ffe890', '#f5e7c8', '#a07830', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15, // float upwards slightly
          char,
          size,
          alpha: 0.8,
          decay: 0.015 + Math.random() * 0.015,
          color,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId = 0;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px Georgia, serif`;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
      }

      rafId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
        filter: 'drop-shadow(0 0 4px #d4af37)',
      }}
    />
  );
}
