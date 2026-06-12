import { useEffect, useRef } from 'react';
import './Landing.css';

interface Props { onBegin: () => void; }

const RUNE_SET = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛈ','ᛇ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ','⚡','✦','✧','⊕','⊗','⋆'];

export default function Landing({ onBegin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Rune = { x:number;y:number;sym:string;sz:number;sx:number;sy:number;rot:number;rs:number;a:number };
    let runes: Rune[] = [];
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      runes = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        sym: RUNE_SET[Math.floor(Math.random() * RUNE_SET.length)],
        sz: 12 + Math.random() * 28,
        sx: (Math.random() - 0.5) * 0.2, sy: (Math.random() - 0.5) * 0.12,
        rot: Math.random() * Math.PI * 2, rs: (Math.random() - 0.5) * 0.005,
        a: 0.07 + Math.random() * 0.22,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const r of runes) {
        r.x += r.sx; r.y += r.sy; r.rot += r.rs;
        if (r.x < -50) r.x = w + 30; if (r.x > w + 50) r.x = -30;
        if (r.y < -50) r.y = h + 30; if (r.y > h + 50) r.y = -30;
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
        ctx.globalAlpha = r.a; ctx.font = `${r.sz}px serif`;
        ctx.fillStyle = '#d4af37';
        ctx.fillText(r.sym, 0, 0); ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="landing-root">
      {/* Canvas runes */}
      <canvas ref={canvasRef} className="landing-canvas" />

      {/* Magic orbs */}
      <div className="landing-orb landing-orb--a" />
      <div className="landing-orb landing-orb--b" />
      <div className="landing-orb landing-orb--c" />

      {/* Ground mist */}
      <div className="landing-mist" aria-hidden="true" />

      {/* Content */}
      <div className="landing-content">

        {/* Constellation row */}
        <div className="landing-stars" aria-hidden="true">
          {'✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦'.split(' ').map((s, i) => (
            <span key={i} className="landing-star" style={{ animationDelay: `${i * 0.14}s` }}>{s}</span>
          ))}
        </div>

        {/* Crest */}
        <div className="landing-crest" aria-hidden="true">
          <div className="crest-ring crest-ring--outer" />
          <div className="crest-ring crest-ring--mid" />
          <div className="crest-ring crest-ring--inner" />
          <span className="crest-glyph">𓂀</span>
        </div>

        {/* Title */}
        <h1 className="landing-title">
          <span className="landing-title-sub">WELCOME TO</span>
          <span className="landing-title-main">MAPPA</span>
          <span className="landing-title-main landing-title-main--gold">ALEXANDRIAE</span>
        </h1>

        <p className="landing-verse">
          « A great library waits beyond this threshold »<br />
          <em>Eight doors · twenty-four tomes · infinite paths through knowledge</em>
        </p>

        {/* Ornamental divider */}
        <div className="landing-divider" aria-hidden="true">
          <span className="landing-div-line" />
          <span className="landing-div-rune">⚜</span>
          <span className="landing-div-rune">𓂀</span>
          <span className="landing-div-rune">⚜</span>
          <span className="landing-div-line" />
        </div>

        {/* Lore blurb */}
        <p className="landing-lore">
          Long before memory the Great Library of Alexandria was said to hold every thought<br />
          ever written. Burned. Forgotten. But not destroyed — only hidden behind eight enchanted<br />
          doors, waiting for a scholar brave enough to seek them out.
        </p>

        {/* Feature pills */}
        <div className="landing-features">
          {['🌙 Cosmic Chamber','🔮 Alchemical Sanctum','🐉 Legendarium','🔺 Map Chamber',
            '👁️ Spirit Observatory','🦄 Bestiary Vaults','⚒️ Forge of Minds','🔮 Oracle\'s Throne']
            .map((f, i) => (
              <span key={i} className="feature-pill" style={{ animationDelay: `${0.6 + i * 0.08}s` }}>{f}</span>
            ))}
        </div>

        {/* Begin button */}
        <button className="landing-btn" onClick={onBegin}>
          <span className="landing-btn-glyph">✦</span>
          Begin the Journey
          <span className="landing-btn-glyph">✦</span>
        </button>

        <p className="landing-hint">↓ eight doors · scroll the realm ↓</p>
      </div>
    </div>
  );
}
