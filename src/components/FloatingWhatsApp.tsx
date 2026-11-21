import { MessageCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface FloatingWhatsAppProps {
  onClick: () => void;
}

export function FloatingWhatsApp({ onClick }: FloatingWhatsAppProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      data-magnetic
      onClick={onClick}
      aria-label="Agendar atendimento pelo WhatsApp"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-[#E11D2E]/60 bg-[#0D0E12]/95 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition-colors hover:border-[#E11D2E] hover:bg-[#E11D2E] sm:bottom-6 sm:right-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <MessageCircle className="h-4 w-4 text-[#E11D2E] group-hover:text-white" />
      <span className="hidden sm:inline">WhatsApp</span>
    </motion.button>
  );
}
