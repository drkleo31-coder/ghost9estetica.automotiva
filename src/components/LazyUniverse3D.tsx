import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const AutomotiveUniverse3D = lazy(() =>
  import('./AutomotiveUniverse3D').then((mod) => ({
    default: mod.AutomotiveUniverse3D,
  })),
);

function Universe3DShell() {
  return (
    <section
      id="universo"
      className="relative z-10 border-t border-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              Universo Automotivo 3D
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Reflexos, Forma e Movimento Contínuo
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A1A6B3]">
            Composição 3D em tempo real sensível ao scroll e ao toque. Arraste sobre o palco para inspecionar os ângulos e reflexos da carroceria.
          </p>
        </div>

        <div className="relative mt-10 flex h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-[radial-gradient(circle_at_50%_45%,rgba(225,29,46,0.14),#050507_72%)] sm:h-[600px]">
          <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[#A1A6B3]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E11D2E]" />
            <span>Preparando Estúdio 3D...</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LazyUniverse3D() {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const onHashTrigger = () => {
      if (window.location.hash === '#universo') {
        setShouldLoad(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '650px 0px', threshold: 0 },
    );

    observer.observe(el);
    window.addEventListener('hashchange', onHashTrigger);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashTrigger);
    };
  }, []);

  if (!shouldLoad) {
    return (
      <div ref={triggerRef}>
        <Universe3DShell />
      </div>
    );
  }

  return (
    <Suspense fallback={<Universe3DShell />}>
      <AutomotiveUniverse3D />
    </Suspense>
  );
}
