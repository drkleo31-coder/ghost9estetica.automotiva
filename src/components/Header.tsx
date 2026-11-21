import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { BRAND_INFO } from '../data/ghost9';

interface HeaderProps {
  onOpenBooking: () => void;
}

const NAV_LINKS = [
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#transformacao', label: 'Transformação' },
  { href: '#universo', label: 'Estúdio 3D' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#contato', label: 'Contato' },
] as const;

export function Header({ onOpenBooking }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#050507]/92 border-b border-white/10'
          : 'bg-gradient-to-b from-[#050507]/90 to-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] rounded"
          aria-label="GHOST 9 Estética Automotiva — Início"
        >
          <img
            src={BRAND_INFO.logoPath}
            alt="Logo oficial GHOST 9"
            className="h-9 w-9 rounded-md object-cover border border-white/15"
            referrerPolicy="no-referrer"
          />
          <span className="font-display-ghost text-2xl font-extrabold tracking-[0.06em] text-white whitespace-nowrap shrink-0">
            GHOST <span className="text-[#E11D2E]">9</span>
          </span>
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A1A6B3]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:text-white group"
            >
              <span>{link.label}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-[#E11D2E] transition-transform duration-200 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            data-magnetic
            onClick={onOpenBooking}
            className="btn-luminous-sweep relative overflow-hidden rounded-md bg-[#E11D2E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-transform duration-200 hover:bg-[#c81827] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Agendar
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-[#0D0E12] text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        aria-hidden="true"
        className="h-[2px] w-full origin-left bg-gradient-to-r from-[#99111E] via-[#E11D2E] to-white"
        style={{ scaleX }}
      />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Navegação mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-b border-white/10 bg-[#050507]/98 px-4 py-5 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-between rounded-md px-3 text-base font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="text-xs text-[#E11D2E]">
                    →
                  </span>
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenBooking();
                }}
                className="mt-3 flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#E11D2E] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Agendar pelo WhatsApp
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
