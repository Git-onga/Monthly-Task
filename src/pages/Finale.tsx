import { useEffect, useRef } from 'react';
import './Finale.css';

interface Props { onReturn: () => void; }

export default function Finale({ onReturn }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Particle = { x:number;y:number;vx:number;vy:number;life:number;maxLife:number;size:number;hue:number };
    const particles: Particle[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const spawnBurst = () => {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.45;
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.8, life: 0, maxLife: 120 + Math.random() * 80, size: 2 + Math.random() * 3, hue: 40 + Math.random() * 30 });
      }
    };
    const burstInterval = setInterval(spawnBurst, 200);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.01; p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        const progress = p.life / p.maxLife;
        ctx.save(); ctx.globalAlpha = (1 - progress) * 0.7;
        ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
        ctx.shadowColor = `hsl(${p.hue}, 90%, 80%)`; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(burstInterval); window.removeEventListener('resize', resize); };
  }, []);

  const achievements = [
    { icon: '🌙', label: 'Stargazer',      desc: 'Explored the Cosmic Chamber' },
    { icon: '🔮', label: 'Transmuter',      desc: 'Entered the Alchemical Sanctum' },
    { icon: '🐉', label: 'Mythkeeper',      desc: 'Read the Legendarium' },
    { icon: '🔺', label: 'Cartomancer',     desc: 'Unlocked the Map Chamber' },
    { icon: '👁️', label: 'Seer',            desc: 'Crossed the Spirit Observatory' },
    { icon: '🦄', label: 'Beastmaster',     desc: 'Opened the Bestiary Vaults' },
    { icon: '⚒️', label: 'Artificer',       desc: 'Forged knowledge at the Forge of Minds' },
    { icon: '🔮', label: 'Oracle',          desc: "Reached the Oracle's Throne" },
  ];

  return (
    <div className="finale-root">
      <canvas ref={canvasRef} className="finale-canvas" />
      <div className="finale-orb finale-orb--a" />
      <div className="finale-orb finale-orb--b" />

      <div className="finale-content">
        {/* Top constellation */}
        <div className="finale-stars" aria-hidden="true">
          {'✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦'.split(' ').map((s, i) => (
            <span key={i} className="finale-star" style={{ animationDelay: `${i * 0.14}s` }}>{s}</span>
          ))}
        </div>

        {/* Seal */}
        <div className="finale-seal" aria-hidden="true">
          <div className="seal-ring seal-ring--a" />
          <div className="seal-ring seal-ring--b" />
          <span className="seal-glyph">𓂀</span>
        </div>

        <h1 className="finale-title">
          <span className="finale-title-sub">YOU HAVE JOURNEYED THROUGH</span>
          <span className="finale-title-main">THE LIBRARY</span>
          <span className="finale-title-accent">OF ETERNITY</span>
        </h1>

        <p className="finale-verse">
          « Every door you opened added a star to the firmament of your mind »
        </p>

        {/* Achievements grid */}
        <div className="finale-achievements">
          {achievements.map((a, i) => (
            <div key={i} className="achievement-card" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              <span className="achievement-icon">{a.icon}</span>
              <span className="achievement-label">{a.label}</span>
              <span className="achievement-desc">{a.desc}</span>
            </div>
          ))}
        </div>

        <div className="finale-divider" aria-hidden="true">
          <span className="finale-div-line" />
          <span>⚜ 𓂀 ⚜</span>
          <span className="finale-div-line" />
        </div>

        <p className="finale-closing">
          The eight doors of the Great Library have revealed their secrets.<br />
          You carry the light of Alexandria forward into the world.
        </p>

        <button className="finale-btn" onClick={onReturn}>
          ✦ Return to the Gates ✦
        </button>
      </div>
    </div>
  );
}
