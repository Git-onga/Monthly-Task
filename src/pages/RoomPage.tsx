import { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_DOORS } from './MapPage';
import './RoomPage.css';

interface RoomPageProps {
  doorId: string;
  onBack: () => void;
  onOpenBook: (bookId: string) => void;
  showUnlockButton: boolean;
  onUnlockNext: () => void;
}

const RUNE_SETS: Record<string, string[]> = {
  cosmos: ['🌙', '⭐', '🌌', '🔭', '🪐', '✦', '✧', '⋆', '𓂀', '🜂'],
  alchemy: ['🔮', '🧪', '⚗️', '🜍', '🜁', '🜔', '🜞', '🜎', '🜧', '🌿'],
  mythos: ['🐉', '🏺', '🏛️', '⚡', '🔱', '🏺', '🏹', '⚔️', '🔱', '🏺'],
  geometry: ['🔺', '📐', '⬡', '⭕', '∞', '⬟', '⬧', '◆', '◇', '⬢'],
  spirits: ['👁️', '☽', '☾', '🧘', '💭', '🧠', '🕯️', '🪞', '⚕️', '👻'],
  bestiary: ['🦄', '🐺', '🦅', '🐋', '🦠', '🌱', '🍄', '🐾', '🍃', '🌳'],
  forge: ['⚒️', '🔥', '⚙️', '💻', '🚀', '🏗️', '🤖', '⛓️', '🔧', '⚓'],
  oracle: ['𓂀', '🔮', '⚜', '⚛', '🌌', '🕸️', '💡', '🔱', '✡', '☸']
};

const MAGIC_FACTS: Record<string, string[]> = {
  cosmos: [
    "The light you see from the stars left them when ancient civilisations were building the first temples.",
    "A single neutron star spoonful weighs as much as Mt. Everest.",
    "In space, sound cannot travel; the stars hum in an eternal, perfect silence."
  ],
  alchemy: [
    "Alchemists believed the Soul of the World (Anima Mundi) linked all matter together.",
    "The Emerald Tablet holds the secret of the universe: 'That which is below is like that which is above.'",
    "Phosphorus was discovered by an alchemist trying to transmute human urine into gold."
  ],
  mythos: [
    "Gilgamesh's quest for immortality was the first written human narrative.",
    "The Norse World Tree Ymir was held together by three great roots spanning different realms.",
    "The Greeks believed that memory was a river (Lethe) that souls drank from to forget their lives."
  ],
  geometry: [
    "Plato associated the tetrahedron with fire, the cube with earth, and the icosahedron with water.",
    "Golden ratio spirals can be traced in cyclones, hurricanes, galaxies, and sunflower seeds.",
    "Non-Euclidean geometry proved that parallel lines can intersect in curved dimensions."
  ],
  spirits: [
    "Socrates spoke of his 'daimonion', a guiding inner voice that warned him against errors.",
    "Jung believed the Collective Unconscious is a shared reservoir of symbols common to all humanity.",
    "In deep meditation, the brain waves shift to Gamma, binding separate thoughts into unified insights."
  ],
  bestiary: [
    "An octopus is so intelligent that each of its arms contains its own semi-independent nervous system.",
    "Tardigrades can survive being frozen to near absolute zero and exposed to the vacuum of outer space.",
    "Mycorrhizal fungi create a subterranean network connecting trees, acting as a forest-wide internet."
  ],
  forge: [
    "The Antikythera Mechanism, built in 150 BCE, was an analogue computer tracking the orbits of planets.",
    "Damascus steel was so strong it was said to cut through other swords like butter, its forge process lost for centuries.",
    "The concept of 'zero' was forged independently by ancient Babylonians, Mayans, and Indian mathematicians."
  ],
  oracle: [
    "All fields of knowledge are branches of a single tree, described as the Great Synthesis by Alexandria.",
    "The Delphi Oracle sat above a geological chasm, breathing vaporous spirits that inspired her visions.",
    "To learn is to remember; the ancient thinkers believed all truth already exists inside the soul."
  ]
};

// Helper: get a unique background gradient for each room
function getRoomBackground(door: typeof ALL_DOORS[0]): string {
  const c = door.glowColor;
  switch (door.id) {
    case 'weapons':
      return `radial-gradient(ellipse at 30% 40%, ${c}18, #020012), repeating-linear-gradient(45deg, ${c}08 0px, ${c}08 2px, transparent 2px, transparent 15px)`;
    case 'Truth':
      return `radial-gradient(circle at 70% 20%, ${c}22, #051505), repeating-linear-gradient(0deg, #2ecc7110 1px, transparent 1px, transparent 35px)`;
    case 'mythos':
      return `radial-gradient(circle at 40% 70%, ${c}25, #1a0a00), repeating-linear-gradient(115deg, ${c}10 0px, ${c}10 3px, transparent 3px, transparent 25px)`;
    case 'geometry':
      return `radial-gradient(ellipse at 60% 40%, ${c}18, #001028), repeating-linear-gradient(90deg, ${c}08 0px, ${c}08 5px, transparent 5px, transparent 30px)`;
    case 'spirits':
      return `radial-gradient(circle at 30% 80%, ${c}20, #0e0418), repeating-radial-gradient(circle at 20% 40%, ${c}10 1px, transparent 1px, transparent 20px)`;
    case 'bestiary':
      return `radial-gradient(ellipse at 70% 60%, ${c}22, #021008), repeating-linear-gradient(45deg, #27ae6010 0px, #27ae6010 2px, transparent 2px, transparent 14px)`;
    case 'forge':
      return `radial-gradient(circle at 50% 20%, ${c}1a, #1c0400), repeating-linear-gradient(135deg, ${c}0c 0px, ${c}0c 2px, transparent 2px, transparent 12px)`;
    case 'oracle':
      return `radial-gradient(ellipse at 90% 80%, ${c}28, #141000), repeating-linear-gradient(0deg, ${c}10 1px, transparent 1px, transparent 45px)`;
    default:
      return `radial-gradient(circle at 50% 50%, ${c}15, #02010a)`;
  }
}

// Magic Dust component (mouse trail)
function MagicDust({ color }: { color: string }) {
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const nextId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addParticle = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    setParticles(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    let lastX = 0, lastY = 0;
    const onMove = (e: MouseEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const dx = Math.abs(e.clientX - lastX);
      const dy = Math.abs(e.clientY - lastY);
      if (dx > 5 || dy > 5) {
        addParticle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        timeoutRef.current = setTimeout(() => { }, 16);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [addParticle]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}, #ffb347)`,
            filter: 'blur(1px)',
            opacity: 0.7,
            transform: 'translate(-50%, -50%)',
            animation: 'dustFade 0.8s ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes dustFade {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
        }
      `}</style>
    </div>
  );
}

export default function RoomPage({ doorId, onBack, onOpenBook, showUnlockButton, onUnlockNext }: RoomPageProps) {
  const door = ALL_DOORS.find(d => d.id === doorId);
  const [flameColor, setFlameColor] = useState(door?.glowColor || '#d4af37');
  const [candleState, setCandleState] = useState<'lit' | 'extinguishing' | 'out'>('lit');
  const [factIndex, setFactIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Rotate magical fact every 12 seconds
  useEffect(() => {
    if (!door) return;
    const interval = setInterval(() => {
      setFactIndex(i => (i + 1) % (MAGIC_FACTS[door.id]?.length || 1));
    }, 12000);
    return () => clearInterval(interval);
  }, [door]);

  // Canvas particle system (two layers)
  useEffect(() => {
    if (!door) return;
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

    const runeSet = RUNE_SETS[door.id] || ['✦', '✧', '⋆'];
    type Particle = { x: number; y: number; char: string; sz: number; vy: number; vx: number; alpha: number; rot: number; rs: number };
    const particles: Particle[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: runeSet[Math.floor(Math.random() * runeSet.length)],
      sz: 12 + Math.random() * 24,
      vy: -(0.1 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.2,
      alpha: 0.08 + Math.random() * 0.3,
      rot: Math.random() * Math.PI * 2,
      rs: (Math.random() - 0.5) * 0.006,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rs;

        if (p.y < -50) {
          p.y = h + 50;
          p.x = Math.random() * w;
        }
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.sz}px Georgia, serif`;
        ctx.fillStyle = door.glowColor;
        ctx.shadowColor = door.glowColor;
        ctx.shadowBlur = 8;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [door]);

  if (!door) {
    return (
      <div className="room-error">
        <h2>Chamber not found</h2>
        <button onClick={onBack}>Return to Map</button>
      </div>
    );
  }

  const handleCandleClick = () => {
    if (candleState !== 'lit') return;
    const colors = ['#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#d4af37', '#8b6cf7', '#1abc9c', '#e67e22'];
    const next = colors.filter(c => c !== flameColor)[Math.floor(Math.random() * (colors.length - 1))];
    setFlameColor(next);

    const candleEl = document.querySelector('.unlock-candle-wrap');
    if (candleEl) {
      const rect = candleEl.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const el = document.createElement('div');
          el.textContent = '✦';
          Object.assign(el.style, {
            position: 'fixed', left: `${x}px`, top: `${y}px`, fontSize: '18px',
            color: next, filter: `drop-shadow(0 0 4px ${next})`,
            pointerEvents: 'none', zIndex: '9999', transition: 'all 0.7s ease-out',
            transform: 'translate(-50%,-50%)'
          });
          document.body.appendChild(el);
          requestAnimationFrame(() => {
            el.style.transform = `translate(${(Math.random() - 0.5) * 100}px,-${40 + Math.random() * 70}px) scale(0.2)`;
            el.style.opacity = '0';
          });
          setTimeout(() => el.remove(), 800);
        }, i * 60);
      }
    }
  };

  const handleUnlockClick = () => {
    if (candleState !== 'lit') return;

    setCandleState('extinguishing');

    // Smoke puffs
    const candleWrap = document.querySelector('.unlock-candle-wrap');
    if (candleWrap) {
      const rect = candleWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + 20;
      const smokeChars = ['💨', '〜', '∿', '⁓', '☁️'];
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          const el = document.createElement('div');
          el.textContent = smokeChars[i % smokeChars.length];
          Object.assign(el.style, {
            position: 'fixed',
            left: `${cx + (Math.random() - 0.5) * 25}px`,
            top: `${cy}px`,
            fontSize: `${16 + Math.random() * 14}px`,
            color: `rgba(180, 170, 200, 0.8)`,
            pointerEvents: 'none',
            zIndex: '9999',
            transition: `all ${0.9 + Math.random() * 0.5}s ease-out`,
            transform: 'translate(-50%,-50%)',
            filter: 'blur(1.5px)',
          });
          document.body.appendChild(el);
          requestAnimationFrame(() => {
            el.style.transform = `translate(${(Math.random() - 0.5) * 70}px, -${70 + Math.random() * 90}px) scale(0.3)`;
            el.style.opacity = '0';
          });
          setTimeout(() => el.remove(), 1400);
        }, i * 100);
      }
    }

    // Animate seal rings (add CSS class)
    const seal = document.querySelector('.unlock-seal');
    if (seal) seal.classList.add('unlock-seal--breaking');

    setTimeout(() => setCandleState('out'), 700);
    setTimeout(() => onUnlockNext(), 1600);
  };

  const roomBackground = getRoomBackground(door);

  return (
    <div className="room-root" style={{ '--glow': door.glowColor, '--flame': flameColor, background: roomBackground } as React.CSSProperties}>
      <canvas ref={canvasRef} className="room-canvas" />
      <MagicDust color={door.glowColor} />
      <div className="room-ambient-glow" />

      {/* Floating magical orbs */}
      <div className="room-orb" style={{ background: `radial-gradient(circle, ${door.glowColor}44, transparent 70%)`, left: '10%', top: '20%', width: '250px', height: '250px', animationDelay: '0s' }} />
      <div className="room-orb" style={{ background: `radial-gradient(circle, ${door.glowColor}33, transparent 70%)`, left: '80%', top: '60%', width: '200px', height: '200px', animationDelay: '3s' }} />
      <div className="room-orb" style={{ background: `radial-gradient(circle, ${door.glowColor}22, transparent 70%)`, left: '40%', top: '85%', width: '180px', height: '180px', animationDelay: '6s' }} />

      <main className="room-content">
        <header className="room-header-nav">
          <button className="room-back-btn" onClick={onBack}>← Return to Realm Map</button>
        </header>

        <section className="room-intro">
          <div className="room-emblem-wrap">
            <span className="room-emblem-icon">{door.icon}</span>
            <div className="room-emblem-glow" />
          </div>
          <h1 className="room-title">{door.roomTitle}</h1>
          <p className="room-desc">{door.roomDesc}</p>
          <div className="room-badge">{door.tag}</div>
          <div className="room-divider">
            <span className="divider-glow-bar" />
          </div>
        </section>

        <section className="room-layout">
          {/* Bookshelf Section */}
          <div className="room-shelf-section">
            <div className="room-shelf-wall">
              <div className="room-shelf-header">
                <h3>✧ CHAMBER SHELF ✧</h3>
                <p>select a tome to read its scripts</p>
              </div>

              {(() => {
                const BOOKS_PER_SHELF = 5;
                const chunks: typeof door.books[] = [];
                for (let i = 0; i < door.books.length; i += BOOKS_PER_SHELF) {
                  chunks.push(door.books.slice(i, i + BOOKS_PER_SHELF));
                }
                return chunks.map((chunk, shelfIdx) => (
                  <div key={shelfIdx}>
                    <div className="room-shelf-plank">
                      {chunk.map((book, idx) => (
                        <div key={book.id} className="book-wrapper">
                          <button
                            className="room-book-spine"
                            style={{
                              '--spine-color': book.spineColor,
                              '--spine-delay': `${(shelfIdx * BOOKS_PER_SHELF + idx) * 0.12}s`,
                              '--book-glow': door.glowColor
                            } as React.CSSProperties}
                            onClick={() => onOpenBook(book.id)}
                            aria-label={`Open ${book.spineTitle}`}
                          >
                            <span className="room-book-spine-title">{book.spineTitle}</span>
                            <span className="room-book-spine-gem" />
                          </button>
                          <div className="room-book-shadow" />
                        </div>
                      ))}
                    </div>
                    <div className="room-shelf-edge" />
                  </div>
                ));
              })()}

              {/* Magical fact display */}
              {/* <div className="room-fact-container">
                <div className="room-fact-icon">📜</div>
                <p className="room-fact-text">{MAGIC_FACTS[door.id]?.[factIndex] || "Wisdom whispers in the silence."}</p>
              </div> */}
            </div>
          </div>
        </section>
      </main>

      

      {/* Unlock section */}
      {showUnlockButton && (
        <section className="unlock-section">
          <div style={{ marginTop: '10vh' }}></div>
          <div className="unlock-card">
            <div
              className={`unlock-candle-wrap unlock-candle-wrap--${candleState}`}
              onClick={handleCandleClick}
              title={candleState === 'lit' ? 'Click to change flame colour' : ''}
            >
              {candleState !== 'out' && (
                <div
                  className={`unlock-candle-halo${candleState === 'extinguishing' ? ' unlock-candle-halo--dying' : ''}`}
                  style={{ background: `radial-gradient(circle, ${flameColor}66 0%, transparent 80%)` }}
                />
              )}

              {candleState === 'lit' && (
                <div className="unlock-flame">
                  <div className="unlock-flame-outer"
                    style={{ background: `radial-gradient(ellipse at 50% 85%, ${flameColor}, ${flameColor}44 55%, transparent 80%)` }} />
                  <div className="unlock-flame-inner"
                    style={{ background: `radial-gradient(ellipse at 50% 90%, #fffde0, ${flameColor}cc 60%, transparent)` }} />
                  <div className="unlock-flame-core" />
                </div>
              )}

              {candleState === 'extinguishing' && (
                <div className="unlock-flame unlock-flame--dying">
                  <div className="unlock-flame-outer unlock-flame-outer--dying"
                    style={{ background: `radial-gradient(ellipse at 50% 85%, ${flameColor}, transparent 80%)` }} />
                </div>
              )}

              <div className="unlock-candle-body">
                <div className={`unlock-candle-wick${candleState === 'out' ? ' unlock-candle-wick--cold' : ''}`} />
                <div className="unlock-candle-wax">
                  <div className="unlock-candle-drip unlock-candle-drip--a" />
                  <div className="unlock-candle-drip unlock-candle-drip--b" />
                </div>
              </div>
              <div className="unlock-candle-holder" />

              {candleState === 'out' && (
                <>
                  <div className="unlock-smoke unlock-smoke--a" />
                  <div className="unlock-smoke unlock-smoke--b" />
                  <div className="unlock-smoke unlock-smoke--c" />
                </>
              )}
            </div>

            <div className="unlock-seal">
              <div className="unlock-seal-ring unlock-seal-ring--a" />
              <div className="unlock-seal-ring unlock-seal-ring--b" />
              <div className="unlock-seal-ring unlock-seal-ring--c" />
              <span className="unlock-seal-glyph">🗝️</span>
            </div>

            <div className="unlock-text">
              <p className="unlock-eyebrow">✦ Chamber Complete ✦</p>
              <h2 className="unlock-heading">The Next Door Awaits</h2>
              <p className="unlock-body">
                You have explored this chamber and studied its tomes.<br />
                Light the way forward — extinguish this flame to break the seal.
              </p>
            </div>

            <div className="unlock-runes">
              {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'].map((r, i) => (
                <span key={i} className="unlock-rune" style={{ animationDelay: `${i * 0.18}s` }}>{r}</span>
              ))}
            </div>

            <button
              className={`unlock-btn${candleState !== 'lit' ? ' unlock-btn--activating' : ''}`}
              onClick={handleUnlockClick}
              disabled={candleState !== 'lit'}
            >
              <span className="unlock-btn-shimmer" />
              <span className="unlock-btn-icon">
                {candleState === 'lit' ? '🔓' : candleState === 'extinguishing' ? '🕯️' : '✦'}
              </span>
              <span className="unlock-btn-label">
                {candleState === 'lit'
                  ? 'Unlock Next Door'
                  : candleState === 'extinguishing'
                    ? 'Breaking the seal…'
                    : 'Opening…'}
              </span>
              {candleState === 'lit' && <span className="unlock-btn-arrow">→</span>}
            </button>

            <p className="unlock-footnote">
              This seal is permanent — the door will remain open on your return.
            </p>
          </div>
        </section>
      )}

      <footer className="room-footer">
        <p>✦ {door.label} · Alexandria Sanctum ✦</p>
      </footer>
    </div>
  );
}