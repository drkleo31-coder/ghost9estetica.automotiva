import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GALLERY_FRAMES } from '../data/ghost9';

export function GallerySection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_FRAMES.length
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_FRAMES.length) % GALLERY_FRAMES.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  const activeFrame = activeIndex !== null ? GALLERY_FRAMES[activeIndex] : null;

  return (
    <section id="galeria" className="relative z-10 border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              Galeria Editorial
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Estética em Tela Ampla
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A1A6B3]">
            Mostruário visual ilustrativo estruturado em alta definição para receber as fotografias oficiais dos veículos atendidos pela GHOST 9.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          {GALLERY_FRAMES.map((frame, index) => {
            const isWide = frame.span === 'wide';
            const colClass = isWide ? 'md:col-span-7' : 'md:col-span-5';
            const hasError = Boolean(failedIds[frame.id]);

            return (
              <motion.figure
                key={frame.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24) }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12] ${colClass}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ampliar ${frame.title}`}
                  className="relative block h-[300px] w-full overflow-hidden text-left sm:h-[360px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
                >
                  {!hasError ? (
                    <img
                      src={frame.image}
                      alt={frame.imageAlt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() =>
                        setFailedIds((prev) => ({ ...prev, [frame.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_40%,rgba(225,29,46,0.2),#0D0E12_75%)]" />
                  )}

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#050507]/95 via-[#050507]/30 to-transparent"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050507]/80 text-white opacity-90 transition-colors group-hover:border-[#E11D2E] group-hover:bg-[#E11D2E]"
                  >
                    <Expand className="h-4 w-4" />
                  </span>

                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-medium tracking-[0.08em] text-[#A1A6B3]">
                      <span className="font-mono-ghost text-[#E11D2E]">{frame.number}</span>
                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>
                      <span>{frame.category}</span>
                    </p>
                    <h3 className="font-display-ghost mt-1 text-2xl font-bold uppercase tracking-wide text-white">
                      {frame.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-[#D1D5DB]">
                      {frame.caption}
                    </p>
                  </figcaption>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </div>

      {/* Expandable Lightbox Modal */}
      <AnimatePresence>
        {activeFrame && activeIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeFrame.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 sm:p-8"
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0D0E12]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div>
                  <p className="text-xs text-[#A1A6B3]">
                    {activeFrame.number} · {activeFrame.category}
                  </p>
                  <h3 className="font-display-ghost text-xl font-bold uppercase tracking-wide text-white">
                    {activeFrame.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Fechar visualização ampliada"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white hover:border-[#E11D2E] hover:text-[#E11D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative aspect-[16/9] w-full bg-[#050507]">
                <img
                  src={activeFrame.image}
                  alt={activeFrame.imageAlt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + GALLERY_FRAMES.length) % GALLERY_FRAMES.length
                    )
                  }
                  aria-label="Imagem anterior"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#050507]/85 text-white hover:border-[#E11D2E] hover:bg-[#E11D2E]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % GALLERY_FRAMES.length)
                  }
                  aria-label="Próxima imagem"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#050507]/85 text-white hover:border-[#E11D2E] hover:bg-[#E11D2E]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#D1D5DB]">{activeFrame.caption}</p>
                <span className="font-mono-ghost text-xs text-[#A1A6B3] whitespace-nowrap">
                  {activeIndex + 1} / {GALLERY_FRAMES.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
