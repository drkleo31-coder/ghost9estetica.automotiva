import { useState } from 'react';
import { Check, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_INFO, CONFIRMED_SERVICES } from '../data/ghost9';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

interface ContactBookingSectionProps {
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
}

export function ContactBookingSection({
  selectedServices,
  onToggleService,
}: ContactBookingSectionProps) {
  const [vehicleModel, setVehicleModel] = useState('');
  const previewMessage = buildWhatsAppMessage(selectedServices, vehicleModel);
  const whatsappUrl = buildWhatsAppUrl(selectedServices, vehicleModel);

  return (
    <section id="contato" className="relative z-10 border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          {/* Left: Interactive WhatsApp Service Configurator */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/12 bg-[#0D0E12] p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
                Agendamento Direto
              </p>
              <h2
                className="font-display-ghost mt-2 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                Solicite Seu Orçamento pelo WhatsApp
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#A1A6B3]">
                Selecione os serviços de interesse abaixo para montar sua mensagem automaticamente e iniciar o atendimento com a GHOST 9.
              </p>

              {/* Service Multi-Selector */}
              <div className="mt-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#D1D5DB]">
                  Serviços disponíveis
                </span>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {CONFIRMED_SERVICES.map((service) => {
                    const active = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onToggleService(service.id)}
                        className={`flex min-h-[46px] items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] ${
                          active
                            ? 'border-[#E11D2E] bg-[#E11D2E]/15 text-white'
                            : 'border-white/12 bg-[#15171E] text-[#B8BDC9] hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono-ghost mr-1.5 text-[#E11D2E]">
                            {service.number}
                          </span>
                          {service.title}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            active
                              ? 'border-[#E11D2E] bg-[#E11D2E] text-white'
                              : 'border-white/25'
                          }`}
                        >
                          {active && <Check className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Vehicle Model Field */}
              <div className="mt-5">
                <label
                  htmlFor="vehicle-model-input"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#D1D5DB]"
                >
                  Modelo do veículo (opcional)
                </label>
                <input
                  id="vehicle-model-input"
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Ex.: Honda Civic, Porsche 911, BMW 320i"
                  className="mt-2 w-full rounded-lg border border-white/15 bg-[#050507] px-4 py-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#E11D2E] focus:outline-none focus:ring-1 focus:ring-[#E11D2E]"
                />
              </div>

              {/* Live Message Preview */}
              <div className="mt-5 rounded-xl border border-white/10 bg-[#050507] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
                  Prévia da mensagem
                </p>
                <p
                  data-testid="whatsapp-message-preview"
                  className="mt-1.5 text-sm leading-relaxed text-[#E5E7EB]"
                >
                  “{previewMessage}”
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                data-testid="whatsapp-direct-link"
                className="btn-luminous-sweep relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#E11D2E] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_34px_rgba(225,29,46,0.35)] transition-colors hover:bg-[#c81827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Enviar Solicitação no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Official Location & Social Channels */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/12 bg-[#0D0E12] p-6 sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <img
                  src={BRAND_INFO.logoPath}
                  alt="Logo oficial GHOST 9 Estética Automotiva"
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-xl border border-white/15 object-cover"
                />
                <div>
                  <h3 className="font-display-ghost text-2xl font-extrabold uppercase tracking-wide text-white">
                    {BRAND_INFO.fullName}
                  </h3>
                  <p className="text-sm text-[#A1A6B3]">{BRAND_INFO.city}</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E11D2E]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                      Cidade de Atendimento
                    </p>
                    <p className="mt-1 text-base font-medium text-white">
                      {BRAND_INFO.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#E11D2E]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                      WhatsApp Oficial
                    </p>
                    <a
                      href={BRAND_INFO.whatsappBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-ghost mt-1 inline-block text-base font-medium text-white transition-colors hover:text-[#E11D2E]"
                    >
                      {BRAND_INFO.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-[#E11D2E]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                      Instagram Oficial
                    </p>
                    <a
                      href={BRAND_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-base font-medium text-white transition-colors hover:text-[#E11D2E]"
                    >
                      {BRAND_INFO.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#15171E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-[#E11D2E] hover:bg-[#1B1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
              >
                <Instagram className="h-4 w-4 text-[#E11D2E]" />
                <span>Acompanhar no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
