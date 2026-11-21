import { useRef, useState } from 'react';
import { ArrowDownRight, CalendarCheck2, Pause, Play } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BRAND_INFO, HERO_MEDIA } from '../data/ghost9';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const reelScrollY = useTransform(scrollYProgress, [0, 1], [0, 42]);

  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x, y });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  const togglePlayback = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    [desktopVideoRef.current, mobileVideoRef.current].forEach((vid) => {
      if (!vid) return;
      if (next) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 sm:pb-20"
    >
      {/* Background Depth Layer: Mobile Real Video (Portrait 9:16 Native Fit) + Desktop Ambient Supercar Backdrop */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: bgScrollY }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Mobile full-bleed real video (9:16 matches mobile portrait naturally without distortion) */}
        {!videoFailed && (
          <video
            ref={mobileVideoRef}
            src={HERO_MEDIA.video}
            poster={HERO_MEDIA.image}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={HERO_MEDIA.videoLabel}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover object-center brightness-[0.72] contrast-[1.08] lg:hidden"
          />
        )}

        {/* Desktop ambient backdrop (subtle parallax behind the cinema reel) */}
        {!heroImgFailed ? (
          <motion.div
            className={`h-full w-full ${!videoFailed ? 'hidden lg:block' : 'block'}`}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    x: pointer.x * -14,
                    y: pointer.y * -9,
                    scale: 1.06,
                  }
            }
            transition={{ type: 'spring', stiffness: 65, damping: 24, mass: 0.9 }}
          >
            <img
              src={HERO_MEDIA.image}
              alt={HERO_MEDIA.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="h-full w-full object-cover object-center opacity-55 brightness-[0.82] contrast-[1.08]"
            />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_40%,rgba(225,29,46,0.22),#050507_70%)]" />
        )}

        {/* Cinematic Dark Masks & Crimson Studio Rim Lighting */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/80 to-[#050507]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(660px circle at ${54 + pointer.x * 18}% ${
              48 + pointer.y * 16
            }%, rgba(225, 29, 46, 0.2), transparent 65%)`,
          }}
        />
      </motion.div>

      {/* Foreground Content + Desktop Masked Cinema Video Stage */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 flex items-center gap-3.5"
          >
            <img
              src={BRAND_INFO.logoPath}
              alt="Mascote e identidade oficial GHOST 9 Estética Automotiva"
              referrerPolicy="no-referrer"
              className="h-14 w-14 shrink-0 rounded-xl border border-white/20 bg-[#0D0E12] object-cover shadow-[0_8px_24px_rgba(225,29,46,0.28)] sm:h-16 sm:w-16"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#E5E7EB]">
              <span>{BRAND_INFO.fullName}</span>
              <span aria-hidden="true" className="text-[#E11D2E]">
                ·
              </span>
              <span className="text-[#A1A6B3]">{BRAND_INFO.city}</span>
            </div>
          </motion.div>

          {/* Animated Line-by-Line Mask Reveal Headline */}
          <h1
            className="font-display-ghost text-5xl font-extrabold uppercase leading-[0.94] tracking-[-0.01em] text-white sm:text-7xl lg:text-[5.5rem]"
            style={{ textWrap: 'balance' }}
          >
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? false : { y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                SEU CARRO.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReducedMotion ? false : { y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.72, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="block bg-gradient-to-r from-white via-[#F4F5F7] to-[#E11D2E] bg-clip-text text-transparent"
              >
                OUTRO NÍVEL.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[#D1D5DB] sm:text-lg"
          >
            Precisão nos detalhes. Excelência em cada acabamento.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <button
              type="button"
              data-magnetic
              onClick={onOpenBooking}
              className="btn-luminous-sweep relative inline-flex min-h-[48px] items-center justify-center gap-2.5 overflow-hidden rounded-md bg-[#E11D2E] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_34px_rgba(225,29,46,0.35)] transition-all duration-200 hover:bg-[#c81827] hover:shadow-[0_16px_42px_rgba(225,29,46,0.5)] active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <CalendarCheck2 className="h-4 w-4 shrink-0" />
              <span>AGENDAR MEU ATENDIMENTO</span>
            </button>

            <a
              href="#especialidades"
              data-magnetic
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-white/20 bg-[#0D0E12]/85 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-[#E11D2E]/70 hover:bg-[#15171E] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
            >
              <span>EXPLORAR SERVIÇOS</span>
              <ArrowDownRight className="h-4 w-4 text-[#E11D2E]" />
            </a>
          </motion.div>
        </div>

        {/* Desktop Cinema-Masked Real Video Showcase (Vídeo 2 — Native Portrait Ratio, Zero Distortion) */}
        {!videoFailed && (
          <motion.div
            style={prefersReducedMotion ? undefined : { y: reelScrollY, perspective: 1100 }}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    rotateY: pointer.x * 5,
                    rotateX: pointer.y * -4,
                  }
            }
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-5 lg:justify-end"
          >
            <div className="relative aspect-[9/14] w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/15 bg-[#050507] shadow-[0_28px_70px_rgba(0,0,0,0.85)]">
              <video
                ref={desktopVideoRef}
                data-testid="hero-showcase-video"
                src={HERO_MEDIA.video}
                poster={HERO_MEDIA.image}
                autoPlay={!prefersReducedMotion}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={HERO_MEDIA.videoLabel}
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover object-center"
              />

              {/* Feathered Cinema Mask & Crimson Rim Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/55"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#E11D2E]/30 rounded-2xl"
              />

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E11D2E]">
                    Estúdio GHOST 9
                  </p>
                  <p className="text-xs font-medium text-white/90">
                    Brilho e reflexo real em cabine
                  </p>
                </div>

                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? 'Pausar vídeo da abertura' : 'Reproduzir vídeo da abertura'}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#050507]/85 text-white transition-colors hover:border-[#E11D2E] hover:bg-[#E11D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
