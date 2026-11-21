import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, CalendarCheck2, Pause, Play } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BRAND_INFO, HERO_MEDIA } from '../data/ghost9';
import { canRevealHeroVideo, shouldAttemptHeroAutoPlay } from '../utils/heroMedia';
import { computeViewportPlaybackAction } from '../utils/videoPlayback';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true,
  );
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [posterImgFailed, setPosterImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [showBufferingHint, setShowBufferingHint] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const reelScrollY = useTransform(scrollYProgress, [0, 1], [0, 42]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      setIsDesktop(mql.matches);
      setVideoReady(false);
    };
    setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (videoReady || videoFailed || userPaused) {
      setShowBufferingHint(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowBufferingHint(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [videoReady, videoFailed, userPaused]);

  const revealIfMoving = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || videoFailed) return;
      if (
        canRevealHeroVideo({
          hasStartedPlaying: !video.paused || video.currentTime > 0,
          readyState: video.readyState,
          videoFailed,
        })
      ) {
        setVideoReady(true);
        setIsPlaying(true);
        setShowBufferingHint(false);
      }
    },
    [videoFailed],
  );

  const setActiveVideoNode = useCallback(
    (node: HTMLVideoElement | null) => {
      activeVideoRef.current = node;
      if (!node) return;
      node.defaultMuted = true;
      node.muted = true;
      node.playsInline = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      if (!userPaused && !videoFailed) {
        node.play().catch(() => {});
        revealIfMoving(node);
      }
    },
    [revealIfMoving, userPaused, videoFailed],
  );

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    const action = computeViewportPlaybackAction({
      isLoaded: true,
      isVisible: true,
      userPaused,
      videoFailed,
    });

    if (action === 'pause') {
      if (!video.paused) {
        video.pause();
      }
      setIsPlaying(false);
      return;
    }

    if (action === 'play') {
      setIsPlaying(true);
      revealIfMoving(video);
      if (
        shouldAttemptHeroAutoPlay({
          isPlaying: true,
          videoFailed,
          paused: video.paused,
          readyState: video.readyState,
        }) ||
        video.paused
      ) {
        video.play().catch(() => {});
      }
    }
  }, [isDesktop, revealIfMoving, userPaused, videoFailed]);

  // Fallback for strict iOS Low Power Mode / autoplay policies + background tab resume
  useEffect(() => {
    const tryResume = () => {
      const video = activeVideoRef.current;
      if (!video || userPaused || videoFailed || document.hidden) return;
      if (video.paused) {
        video.defaultMuted = true;
        video.muted = true;
        video.play().catch(() => {});
      }
      revealIfMoving(video);
    };

    const onVisibility = () => {
      const video = activeVideoRef.current;
      if (!video) return;
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else {
        tryResume();
      }
    };

    window.addEventListener('pointerdown', tryResume, { passive: true });
    window.addEventListener('touchstart', tryResume, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointerdown', tryResume);
      window.removeEventListener('touchstart', tryResume);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [revealIfMoving, userPaused, videoFailed]);

  const handleVideoLoadedOrCanPlay = (video: HTMLVideoElement | null) => {
    if (!video || userPaused || videoFailed) return;
    if (video.paused) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
    revealIfMoving(video);
  };

  const handleVideoPlaying = (video: HTMLVideoElement | null) => {
    if (!video) return;
    const ready = canRevealHeroVideo({
      hasStartedPlaying: true,
      readyState: Math.max(video.readyState, 2),
      videoFailed,
    });
    if (!ready) return;
    setVideoReady(true);
    setIsPlaying(true);
    setShowBufferingHint(false);
  };

  const handleVideoTimeUpdate = (video: HTMLVideoElement | null) => {
    if (!video || videoFailed) return;
    if (video.currentTime > 0 && !video.paused && !videoReady) {
      setVideoReady(true);
      setIsPlaying(true);
      setShowBufferingHint(false);
    }
  };

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
    const vid = activeVideoRef.current;
    const nextPaused = isPlaying;
    setUserPaused(nextPaused);
    setIsPlaying(!nextPaused);
    if (!vid) return;
    if (nextPaused) {
      vid.pause();
    } else {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.play().catch(() => {});
    }
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 sm:pb-20"
    >
      {/* Background Depth Layer: Single Active Mobile Video OR Desktop Real Studio Backdrop */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: bgScrollY }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Mobile full-bleed stage (mounted ONLY on <1024px to prevent duplicate decoders/requests) */}
        {!isDesktop && (
          <div className="relative h-full w-full">
            {!videoFailed && (
              <video
                ref={setActiveVideoNode}
                data-testid="hero-mobile-video"
                src={HERO_MEDIA.video}
                poster={HERO_MEDIA.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={HERO_MEDIA.videoLabel}
                onLoadedMetadata={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                onLoadedData={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                onCanPlay={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                onPlaying={(e) => handleVideoPlaying(e.currentTarget)}
                onTimeUpdate={(e) => handleVideoTimeUpdate(e.currentTarget)}
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover object-center brightness-[0.72] contrast-[1.08]"
              />
            )}

            {!posterImgFailed && (
              <img
                data-testid="hero-mobile-poster"
                src={HERO_MEDIA.poster}
                alt={HERO_MEDIA.posterAlt}
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                onError={() => setPosterImgFailed(true)}
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center brightness-[0.72] contrast-[1.08] transition-opacity duration-500 ease-out ${
                  videoReady && !videoFailed ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
          </div>
        )}

        {/* Desktop ambient backdrop derived from the real car frame (no generic placeholder) */}
        {isDesktop &&
          (!posterImgFailed ? (
            <motion.div
              className="h-full w-full"
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
                src={HERO_MEDIA.poster}
                alt=""
                aria-hidden="true"
                loading="eager"
                className="h-full w-full scale-105 object-cover object-center opacity-30 brightness-[0.55] contrast-[1.1] blur-[3px]"
              />
            </motion.div>
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_70%_40%,rgba(225,29,46,0.22),#050507_70%)]" />
          ))}

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
              fetchPriority="high"
              decoding="async"
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

          {/* Subtle mobile buffering indicator when slow network delays playback >350ms */}
          {!isDesktop && showBufferingHint && !videoReady && !videoFailed && (
            <div
              data-testid="hero-mobile-loading-hint"
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#D1D5DB]"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E11D2E]" />
              <span>Carregando vídeo do estúdio...</span>
            </div>
          )}
        </div>

        {/* Desktop Cinema-Masked Real Video Showcase (Mounted ONLY on >=1024px) */}
        {isDesktop && (
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
            className="flex lg:col-span-5 lg:justify-end"
          >
            <div className="relative aspect-[9/14] w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/15 bg-[#050507] shadow-[0_28px_70px_rgba(0,0,0,0.85)]">
              {!videoFailed && (
                <video
                  ref={setActiveVideoNode}
                  data-testid="hero-showcase-video"
                  src={HERO_MEDIA.video}
                  poster={HERO_MEDIA.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label={HERO_MEDIA.videoLabel}
                  onLoadedMetadata={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                  onLoadedData={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                  onCanPlay={(e) => handleVideoLoadedOrCanPlay(e.currentTarget)}
                  onPlaying={(e) => handleVideoPlaying(e.currentTarget)}
                  onTimeUpdate={(e) => handleVideoTimeUpdate(e.currentTarget)}
                  onError={() => setVideoFailed(true)}
                  className="h-full w-full object-cover object-center"
                />
              )}

              {/* Real Frame-0 Cover locked to exact same framing until playback begins */}
              {!posterImgFailed && (
                <img
                  data-testid="hero-desktop-poster"
                  src={HERO_MEDIA.poster}
                  alt={HERO_MEDIA.posterAlt}
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                  onError={() => setPosterImgFailed(true)}
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-out ${
                    videoReady && !videoFailed ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              )}

              {/* Feathered Cinema Mask & Crimson Rim Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/55"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#E11D2E]/30"
              />

              {/* Subtle buffering shimmer line + status when loading >350ms */}
              {showBufferingHint && !videoReady && !videoFailed && (
                <div
                  data-testid="hero-desktop-loading-hint"
                  aria-live="polite"
                  className="pointer-events-none absolute inset-x-0 top-0"
                >
                  <div className="h-[2px] w-full overflow-hidden bg-white/10">
                    <div className="h-full w-1/2 animate-pulse bg-[#E11D2E]" />
                  </div>
                  <div className="m-3 inline-flex items-center gap-2 rounded-md border border-white/15 bg-[#050507]/85 px-2.5 py-1 text-[11px] font-medium text-[#E5E7EB]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E11D2E]" />
                    <span>Carregando vídeo...</span>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E11D2E]">
                    Estúdio GHOST 9
                  </p>
                  <p className="text-xs font-medium text-white/90">
                    Brilho e reflexo real em cabine
                  </p>
                </div>

                {!videoFailed && (
                  <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label={isPlaying ? 'Pausar vídeo da abertura' : 'Reproduzir vídeo da abertura'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#050507]/85 text-white transition-colors hover:border-[#E11D2E] hover:bg-[#E11D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
