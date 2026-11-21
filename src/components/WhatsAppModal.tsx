import { useEffect, useState } from 'react';
import { Check, MessageCircle, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CONFIRMED_SERVICES } from '../data/ghost9';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

interface WhatsAppModalProps {
  open: boolean;
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
  onClose: () => void;
}

export function WhatsAppModal({
  open,
  selectedServices,
  onToggleService,
  onClose,
}: WhatsAppModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [vehicleModel, setVehicleModel] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const preview = buildWhatsAppMessage(selectedServices, vehicleModel);
  const url = buildWhatsAppUrl(selectedServices, vehicleModel);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-agendamento-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/82 p-4"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0D0E12] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D2E]">
                  Atendimento GHOST 9
                </p>
                <h2
                  id="modal-agendamento-title"
                  className="font-display-ghost mt-1 text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl"
                >
                  Agendar pelo WhatsApp
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar janela de agendamento"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/15 text-white hover:border-[#E11D2E] hover:text-[#E11D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D1D5DB]">
                Escolha o serviço desejado
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CONFIRMED_SERVICES.map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleService(service.id)}
                      className={`flex min-h-[42px] items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        active
                          ? 'border-[#E11D2E] bg-[#E11D2E]/15 text-white'
                          : 'border-white/12 bg-[#15171E] text-[#B8BDC9] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{service.title}</span>
                      {active && <Check className="h-3.5 w-3.5 shrink-0 text-[#E11D2E]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="modal-vehicle-input"
                className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#D1D5DB]"
              >
                Veículo (opcional)
              </label>
              <input
                id="modal-vehicle-input"
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex.: Golf GTI, Corolla, Audi A3"
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#050507] px-3.5 py-2.5 text-sm text-white placeholder:text-[#6B7280] focus:border-[#E11D2E] focus:outline-none"
              />
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#050507] p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                Mensagem preparada
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#E5E7EB]">“{preview}”</p>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="btn-luminous-sweep relative inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#E11D2E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#c81827]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Abrir WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[46px] rounded-lg border border-white/15 bg-[#15171E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#D1D5DB] hover:text-white"
              >
                Continuar no site
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
