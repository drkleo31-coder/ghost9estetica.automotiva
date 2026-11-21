import { useRef, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CONFIRMED_SERVICES, type GhostService } from '../data/ghost9';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

interface ServiceCardProps {
  service: GhostService;
  index: number;
  spanClass: string;
  onSelect: (id: string) => void;
}

function ServiceCard({ service, index, spanClass, onSelect }: ServiceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 9,
      mx: px * 100,
      my: py * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  };

  const showVideo = Boolean(service.video) && !videoError;

  return (
    <motion.article
      ref={cardRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24), ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: prefersReducedMotion
          ? undefined
          : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: tilt.active
          ? 'transform 0.08s ease-out'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0E12] ${spanClass}`}
    >
      {/* Cursor-following studio illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, rgba(225, 29, 46, 0.18), transparent 60%)`,
        }}
      />

      {/* Media Frame (Real Video for Polimento & Detalhamento, High-Impact Studio Photo otherwise) */}
      <div className="relative h-64 w-full overflow-hidden bg-[#08090C] sm:h-72">
        {showVideo ? (
          <video
            data-testid={`service-video-${service.id}`}
            src={service.video}
            poster={service.image}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={service.videoLabel ?? service.title}
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover object-[50%_40%] transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : !imgError ? (
          <img
            src={service.image}
            alt={service.imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_40%,rgba(225,29,46,0.2),#08090C_75%)] p-6 text-center">
            <Sparkles className="h-7 w-7 text-[#E11D2E]" />
            <span className="font-display-ghost text-xl font-bold uppercase tracking-wide text-white">
              {service.title}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/25 to-transparent"
        />

        <span className="font-mono-ghost absolute left-4 top-4 text-xs font-semibold tracking-[0.14em] text-white/85">
          {service.number}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="text-xs font-medium tracking-[0.06em] text-[#A1A6B3]">
            {service.focusLabel}
          </p>
          <h3 className="font-display-ghost mt-1.5 text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.75rem]">
            {service.number}. {service.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#E11D2E]">{service.subtitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#B8BDC9]">{service.description}</p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            data-magnetic
            onClick={() => onSelect(service.id)}
            className="inline-flex min-h-[44px] w-full items-center justify-between rounded-lg border border-white/15 bg-[#15171E] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:border-[#E11D2E] hover:bg-[#E11D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
          >
            <span>Solicitar orçamento no WhatsApp</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

const CARD_SPANS = [
  'lg:col-span-4',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-2',
] as const;

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerParallaxY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <section
      id="especialidades"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          style={prefersReducedMotion ? undefined : { y: headerParallaxY }}
          className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              Especialidades GHOST 9
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Cuidado Técnico em Cada Superfície
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A1A6B3]">
            Serviços especializados para preservar, corrigir e valorizar a pintura e o interior do seu veículo em Limeira - SP.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {CONFIRMED_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              spanClass={CARD_SPANS[index] ?? 'lg:col-span-3'}
              onSelect={onSelectService}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
