import { useRef, useState } from 'react';
import { ArrowUpRight, Bike, Camera, Car, Film } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CONFIRMED_SERVICES } from '../data/ghost9';
import { buildMotoWhatsAppUrl } from '../utils/whatsapp';

interface VehiclesSegmentsSectionProps {
  onSelectCarService: (serviceId: string) => void;
}

const CAR_PILLARS = [
  { id: 'polimento-automotivo', label: 'Polimento' },
  { id: 'correcao-de-pintura', label: 'Correção de pintura' },
  { id: 'espelhamento', label: 'Espelhamento' },
  { id: 'vitrificacao', label: 'Vitrificação' },
  { id: 'detalhamento-completo', label: 'Detalhamento' },
] as const;

export function VehiclesSegmentsSection({
  onSelectCarService,
}: VehiclesSegmentsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [carImgError, setCarImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const leftParallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const rightParallaxY = useTransform(scrollYProgress, [0, 1], [-14, 18]);

  const carShowcaseImage =
    CONFIRMED_SERVICES.find((s) => s.id === 'espelhamento')?.image ?? '';
  const motoWhatsAppUrl = buildMotoWhatsAppUrl();

  return (
    <section
      id="segmentos"
      ref={sectionRef}
      className="relative z-10 border-t border-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              Atendimento por Segmento
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Carros &amp; Motos
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A1A6B3]">
            Apresentação dedicada aos dois universos sobre rodas atendidos pela GHOST 9 em Limeira - SP.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Segment 01: Carros */}
          <motion.article
            style={prefersReducedMotion ? undefined : { y: leftParallaxY }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-[#0D0E12] lg:col-span-7"
          >
            <div className="relative h-64 w-full overflow-hidden bg-[#050507] sm:h-72">
              {!carImgError && carShowcaseImage ? (
                <img
                  src={carShowcaseImage}
                  alt="Automóvel esportivo preto com acabamento espelhado em estúdio"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() => setCarImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_60%_40%,rgba(225,29,46,0.2),#050507_75%)]" />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/40 to-transparent"
              />
              <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                <Car className="h-4 w-4 text-[#E11D2E]" />
                <span>Segmento 01 · Quatro Rodas</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div>
                <h3 className="font-display-ghost text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">
                  Carros
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8BDC9]">
                  Cuidado completo para veículos de passeio e esportivos, com foco em brilho, leitura limpa do verniz e proteção da pintura.
                </p>

                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {CAR_PILLARS.map((pillar, idx) => (
                    <li key={pillar.id}>
                      <button
                        type="button"
                        data-magnetic
                        onClick={() => onSelectCarService(pillar.id)}
                        className="flex min-h-[46px] w-full items-center justify-between py-2.5 text-left text-sm font-medium text-[#E5E7EB] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
                      >
                        <span>
                          <span className="font-mono-ghost mr-3 text-xs text-[#E11D2E]">
                            0{idx + 1}
                          </span>
                          {pillar.label}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#A1A6B3] transition-transform duration-200 group-hover:text-[#E11D2E]" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>

          {/* Segment 02: Motos (Prepared Space for Real Photos & Videos — Zero Invented Services) */}
          <motion.article
            style={prefersReducedMotion ? undefined : { y: rightParallaxY }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-[#0D0E12] lg:col-span-5"
          >
            {/* Atmospheric Architectural Stage Ready for Real Motorcycle Media */}
            <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(225,29,46,0.22),#07080B_72%)] p-6 sm:h-72">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_30%,rgba(225,29,46,0.08)_50%,transparent_70%)]"
              />
              {/* Precision Wireframe Halo & Motorcycle Silhouette Emblem */}
              <div
                aria-hidden="true"
                className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#E11D2E]/40 bg-[#050507]/85 shadow-[0_0_40px_rgba(225,29,46,0.25)]"
              >
                <div className="absolute -inset-3 rounded-full border border-white/10" />
                <Bike className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>

              <div className="relative mt-4 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#D1D5DB]">
                <span className="inline-flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-[#E11D2E]" />
                  Fotos Reais
                </span>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-[#E11D2E]" />
                  Vídeos Reais
                </span>
              </div>

              <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                <Bike className="h-4 w-4 text-[#E11D2E]" />
                <span>Segmento 02 · Duas Rodas</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
              <div>
                <h3 className="font-display-ghost text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">
                  Motos
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#B8BDC9]">
                  Espaço visual dedicado ao universo duas rodas na GHOST 9, preparado para receber fotografias e vídeos reais de motocicletas com o mesmo padrão de acabamento do estúdio.
                </p>

                <div className="mt-5 rounded-xl border border-white/10 bg-[#050507]/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#E11D2E]">
                    Vitrine em Preparação para Acervo Oficial
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#A1A6B3]">
                    Deseja cuidar da sua motocicleta? Fale diretamente com nossa equipe no WhatsApp para verificar as opções de atendimento disponíveis para o seu modelo.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={motoWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  data-testid="moto-whatsapp-link"
                  className="btn-luminous-sweep relative inline-flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#E11D2E] bg-[#E11D2E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c81827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Consultar atendimento para moto</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
