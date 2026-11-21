import { BRAND_INFO } from '../data/ghost9';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050507] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display-ghost text-xl font-extrabold uppercase tracking-[0.08em] text-white">
            GHOST <span className="text-[#E11D2E]">9</span> ESTÉTICA AUTOMOTIVA
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {BRAND_INFO.city} · Desenvolvimento por {BRAND_INFO.studioCredit}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#B8BDC9]">
          <a
            href="#especialidades"
            className="transition-colors hover:text-white"
          >
            Especialidades
          </a>
          <a
            href="#transformacao"
            className="transition-colors hover:text-white"
          >
            Transformação
          </a>
          <a
            href="#universo"
            className="transition-colors hover:text-white"
          >
            Estúdio 3D
          </a>
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#E11D2E]"
          >
            Instagram
          </a>
          <a
            href={BRAND_INFO.whatsappBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#E11D2E]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
