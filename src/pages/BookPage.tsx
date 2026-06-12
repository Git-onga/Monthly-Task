import { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_DOORS } from './MapPage';
import './BookPage.css';

interface BookPageProps {
  doorId: string;
  bookId: string;
  onBack: () => void;
  onNavigateBook: (bookId: string) => void;
}

// Roman numerals for page numbering
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

export default function BookPage({ doorId, bookId, onBack, onNavigateBook }: BookPageProps) {
  const door = ALL_DOORS.find(d => d.id === doorId);
  const book = door?.books.find(b => b.id === bookId);

  // Page spread: index of the LEFT page (0, 2, 4 …)
  const [spreadIndex, setSpreadIndex] = useState(0);
  // Flip animation: 'forward' | 'backward' | null
  const [flipDir, setFlipDir] = useState<'forward' | 'backward' | null>(null);
  // Book-level flip (when switching between tomes)
  const [bookFlipping, setBookFlipping] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  // Reset to first spread whenever the bookId changes
  useEffect(() => { setSpreadIndex(0); setFlipDir(null); }, [bookId]);

  const totalPages = book?.pages.length ?? 0;
  const totalSpreads = Math.ceil(totalPages / 2);
  const hasPrevSpread = spreadIndex > 0;
  const hasNextSpread = spreadIndex + 2 < totalPages;

  const pageLeft  = book?.pages[spreadIndex];
  const pageRight = book?.pages[spreadIndex]; // may be undefined (last page alone)

  // Quick book navigation
  const currentIdx = door?.books.findIndex(b => b.id === bookId) ?? -1;
  const prevBook = currentIdx > 0 ? door?.books[currentIdx - 1] : null;
  const nextBook = door?.books && currentIdx < door.books.length - 1 ? door.books[currentIdx + 1] : null;

  /* ─── Keyboard navigation ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onBack(); return; }
      if (e.key === 'ArrowRight') {
        if (hasNextSpread) flipForward();
        else if (nextBook) handleSwitchBook(nextBook.id);
      }
      if (e.key === 'ArrowLeft') {
        if (hasPrevSpread) flipBackward();
        else if (prevBook) handleSwitchBook(prevBook.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadIndex, bookId, hasNextSpread, hasPrevSpread, prevBook, nextBook]);

  /* ─── Particle click effect ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    type Spark = { x:number;y:number;vx:number;vy:number;sz:number;life:number;maxLife:number;color:string };
    const sparks: Spark[] = [];

    const handleCanvasClick = (e: MouseEvent) => {
      const color = door?.glowColor || '#d4af37';
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.8;
        sparks.push({ x:e.clientX, y:e.clientY, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed - 0.5,
          sz:2+Math.random()*3, life:0, maxLife:40+Math.random()*30, color });
      }
    };
    window.addEventListener('click', handleCanvasClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.005; s.life++;
        if (s.life > s.maxLife) { sparks.splice(i, 1); continue; }
        const p = s.life / s.maxLife;
        ctx.save();
        ctx.globalAlpha = 1 - p;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz * (1 - p * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, [door]);

  /* ─── Page flip helpers ─── */
  const flipForward = useCallback(() => {
    if (!hasNextSpread || flipDir) return;
    setFlipDir('forward');
    setTimeout(() => {
      setSpreadIndex(i => i + 2);
      setFlipDir(null);
    }, 420);
  }, [hasNextSpread, flipDir]);

  const flipBackward = useCallback(() => {
    if (!hasPrevSpread || flipDir) return;
    setFlipDir('backward');
    setTimeout(() => {
      setSpreadIndex(i => i - 2);
      setFlipDir(null);
    }, 420);
  }, [hasPrevSpread, flipDir]);

  const handleSwitchBook = (targetId: string) => {
    setBookFlipping(true);
    setTimeout(() => { onNavigateBook(targetId); setBookFlipping(false); }, 300);
  };

  const getDropCap = (text: string) => ({ first: text.charAt(0), rest: text.slice(1) });

  if (!door || !book) {
    return (
      <div className="book-error">
        <h2>Tome not found</h2>
        <button onClick={onBack}>Return to Shelf</button>
      </div>
    );
  }

  const flipClass = flipDir === 'forward' ? 'tome-wrap--flip-forward'
    : flipDir === 'backward' ? 'tome-wrap--flip-backward'
    : bookFlipping ? 'tome-wrap--flipping'
    : '';

  return (
    <div className="book-root-view" style={{ '--glow': door.glowColor } as React.CSSProperties}>
      <canvas ref={canvasRef} className="book-view-canvas" />
      <div className="book-view-starfield" />

      <main className="book-view-content">
        <header className="book-view-header">
          <button className="book-view-back-btn" onClick={onBack}>
            ← Close Tome &amp; Return to Shelf
          </button>
          <div className="book-view-nav-indicators">
            Chamber: <span className="book-view-nav-door-name">{door.roomTitle}</span>
            &nbsp;·&nbsp; Spread {Math.floor(spreadIndex / 2) + 1} / {totalSpreads}
          </div>
        </header>

        {/* Immersive Tome Container */}
        <div className={`tome-wrap ${flipClass}`}>
          <div className="tome-shadow" />

          {/* Left cover border */}
          <div className="tome-cover-border tome-cover-border--left"
               style={{ backgroundColor: book.coverColor } as React.CSSProperties} />

          <div className="tome-book">
            {/* ── LEFT PAGE ── */}
            {pageLeft && (() => {
              const dc = getDropCap(pageLeft.taught,);
              return (
                <div className="tome-page tome-page--left">
                  <div className="tome-page-corner tome-page-corner--tl" />
                  <div className="tome-page-corner tome-page-corner--bl" />
                  <div className="tome-page-ornament">⸻ ✦ ⸻</div>
                  <h2 className="tome-page-title">{pageLeft.title}</h2>
                  <p className="tome-page-text">
                    <span className="tome-drop-cap" style={{ color: door.glowColor } as React.CSSProperties}>
                      {dc.first}
                    </span>
                    {dc.rest}
                  </p>
                  {/* Inline prev/next page turn buttons */}
                  {hasPrevSpread && (
                    <button className="tome-page-turn tome-page-turn--prev" onClick={flipBackward}
                            aria-label="Previous page spread">
                      ◀ prev
                    </button>
                  )}
                  <div className="tome-page-footer">
                    <span className="tome-page-number">{ROMAN[spreadIndex] ?? spreadIndex + 1}</span>
                  </div>
                </div>
              );
            })()}

            {/* ── SPINE ── */}
            <div className="tome-spine">
              <div className="tome-spine-crease" />
              <div className="tome-spine-ribbon"
                   style={{ backgroundColor: door.glowColor } as React.CSSProperties} />
            </div>

            {/* ── RIGHT PAGE ── */}
            {pageRight ? (() => {
              const sentences = pageRight.learnt.split(/\.\s+/).filter(s => s.trim().length > 0);
              return (
                <div className="tome-page tome-page--right">
                  <div className="tome-page-corner tome-page-corner--tr" />
                  <div className="tome-page-corner tome-page-corner--br" />
                  <div className="tome-page-ornament"></div>
                  <h2 className="tome-page-title">What I learnt</h2>
                  <ul className="tome-page-bullets">
                    {sentences.map((sentence, idx) => (
                      <li key={idx} className="tome-page-bullet-item">
                        <div className="tome-page-corner tome-page-corner--br" />
                        {sentence + '.'}
                      </li>
                    ))}
                  </ul>
                  {hasNextSpread && (
                    <button className="tome-page-turn tome-page-turn--next" onClick={flipForward}
                            aria-label="Next page spread">
                      next ▶
                    </button>
                  )}
                  <div className="tome-page-footer">
                    <span className="tome-page-number">{ROMAN[spreadIndex + 1] ?? spreadIndex + 2}</span>
                  </div>
                </div>
              );
            })() : (
              /* Blank page placeholder if odd total */
              <div className="tome-page tome-page--right tome-page--blank">
                <div className="tome-page-ornament" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  ✦ Finis ✦
                </div>
              </div>
            )}
          </div>

          {/* Right cover border */}
          <div className="tome-cover-border tome-cover-border--right"
               style={{ backgroundColor: book.coverColor } as React.CSSProperties} />
        </div>

        {/* Page spread indicator dots */}
        {totalSpreads > 1 && (
          <div className="tome-spread-dots" aria-label={`Page spread ${Math.floor(spreadIndex / 2) + 1} of ${totalSpreads}`}>
            {Array.from({ length: totalSpreads }, (_, i) => (
              <button key={i}
                className={`tome-spread-dot ${i === Math.floor(spreadIndex / 2) ? 'tome-spread-dot--active' : ''}`}
                onClick={() => {
                  const target = i * 2;
                  if (target === spreadIndex || flipDir) return;
                  setFlipDir(target > spreadIndex ? 'forward' : 'backward');
                  setTimeout(() => { setSpreadIndex(target); setFlipDir(null); }, 420);
                }}
                aria-label={`Go to spread ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick Shelf Nav tabs */}
        <div className="tome-shelf-nav">
          {prevBook ? (
            <button className="tome-nav-btn tome-nav-btn--prev" onClick={() => handleSwitchBook(prevBook.id)}>
              <span className="tome-nav-arrow">←</span>
              <div className="tome-nav-label">
                <span>PREVIOUS TOME</span>
                <strong>{prevBook.spineTitle}</strong>
              </div>
            </button>
          ) : <div className="tome-nav-btn-placeholder" />}

          <div className="tome-navigation-hint">
            <span>← → arrow keys to navigate · ↑ page buttons to flip</span>
          </div>

          {nextBook ? (
            <button className="tome-nav-btn tome-nav-btn--next" onClick={() => handleSwitchBook(nextBook.id)}>
              <div className="tome-nav-label">
                <span>NEXT TOME</span>
                <strong>{nextBook.spineTitle}</strong>
              </div>
              <span className="tome-nav-arrow">→</span>
            </button>
          ) : <div className="tome-nav-btn-placeholder" />}
        </div>
      </main>

      <footer className="book-view-footer">
        <p>✦ Mappa Alexandriae · Scriptorium Scribe ✦</p>
      </footer>
    </div>
  );
}
