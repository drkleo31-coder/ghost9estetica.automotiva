import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { TRANSFORMATION_MEDIA } from '../data/ghost9';
import { clampSplitPercent, stepSplitPercent } from '../utils/transform';

export function TransformationSection() {
  const prefersReducedMotion = useReducedMotion();
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const stageScale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.97, 1, 1, 0.98]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setSplitPercent(clampSplitPercent(ratio));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPercent((prev) => stepSplitPercent(prev, -4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPercent((prev) => stepSplitPercent(prev, 4));
    }
  };

  return (
    <section
      id="transformacao"
      ref={sectionRef}
      className="relative z-10 border-t border-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              A Transformação
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              OS DETALHES FAZEM A DIFERENÇA.
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#A1A6B3]">
            <span>Arraste o controle para comparar</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span className="font-mono-ghost text-white">{Math.round(splitPercent)}%</span>
          </div>
        </motion.div>

        {/* Interactive Before / After Stage with Scroll Depth Scale */}
        <motion.div
          style={prefersReducedMotion ? undefined : { scale: stageScale }}
          className="mt-10"
        >
          <div
            ref={containerRef}
            role="slider"
            tabIndex={0}
            aria-label="Comparador visual antes e depois de pintura automotiva"
            aria-valuemin={4}
            aria-valuemax={96}
            aria-valuenow={Math.round(splitPercent)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            data-testid="before-after-comparator"
            className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-white/15 bg-[#0D0E12] touch-pan-y sm:aspect-[16/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
          >
          {/* AFTER Layer (Full Background) */}
          <div className="absolute inset-0">
            {!afterError ? (
              <img
                src={TRANSFORMATION_MEDIA.afterImage}
                alt={TRANSFORMATION_MEDIA.afterAlt}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setAfterError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(135deg,#050507_0%,#15171E_50%,#E11D2E_100%)]" />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/45"
            />
          </div>

          {/* BEFORE Layer (Clipped by splitPercent) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
            }}
          >
            {!beforeError ? (
              <img
                src={TRANSFORMATION_MEDIA.beforeImage}
                alt={TRANSFORMATION_MEDIA.beforeAlt}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setBeforeError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#1C1E24]" />
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/45"
            />
          </div>

          {/* Corner Labels (Unboxed clean editorial scrim labels) */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Antes · Superfície com marcas
            </span>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-10 text-right sm:right-6 sm:top-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D2E]">
              Depois · Acabamento espelhado
            </span>
          </div>

          {/* Divider Line & Handle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(225,29,46,0.9)]"
            style={{ left: `${splitPercent}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#050507]/90 text-white shadow-[0_0_24px_rgba(225,29,46,0.6)]">
              <MoveHorizontal className="h-5 w-5 text-[#E11D2E]" />
            </div>
          </div>
        </div>
        </motion.div>

        {/* Accessible Range Sync Bar + Honest Demonstration Disclaimer */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#9CA3AF]">
            Imagens demonstrativas de estudo visual comparativo — não representam registros fotográficos de veículos atendidos pela GHOST 9.
          </p>

          <div className="flex items-center gap-3">
            <label htmlFor="compare-range" className="text-xs font-medium text-[#D1D5DB] whitespace-nowrap">
              Ajuste fino
            </label>
            <input
              id="compare-range"
              type="range"
              min={4}
              max={96}
              step={1}
              value={Math.round(splitPercent)}
              onChange={(e) => setSplitPercent(clampSplitPercent(Number(e.target.value)))}
              className="h-1.5 w-36 accent-[#E11D2E]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
