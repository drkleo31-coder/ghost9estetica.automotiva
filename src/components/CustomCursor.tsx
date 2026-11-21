import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateAvailability = () => {
      const active =
        finePointer.matches &&
        !reducedMotion.matches &&
        window.innerWidth >= 1024;
      setEnabled(active);
      document.body.classList.toggle('has-custom-cursor', active);
    };

    const onTouch = () => {
      setEnabled(false);
      document.body.classList.remove('has-custom-cursor');
    };

    updateAvailability();
    finePointer.addEventListener('change', updateAvailability);
    reducedMotion.addEventListener('change', updateAvailability);
    window.addEventListener('resize', updateAvailability, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      finePointer.removeEventListener('change', updateAvailability);
      reducedMotion.removeEventListener('change', updateAvailability);
      window.removeEventListener('resize', updateAvailability);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHoveringInteractive = false;
    let isPressed = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="slider"], input');
      isHoveringInteractive = Boolean(interactive);
    };

    const onDown = () => {
      isPressed = true;
    };

    const onUp = () => {
      isPressed = false;
    };

    const onLeave = () => {
      mouseX = -100;
      mouseY = -100;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
          isPressed ? 0.7 : 1
        })`;
      }

      if (ringRef.current) {
        const scale = isPressed ? 0.85 : isHoveringInteractive ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = isHoveringInteractive
          ? 'rgba(225, 29, 46, 0.95)'
          : 'rgba(244, 245, 247, 0.42)';
        ringRef.current.style.backgroundColor = isHoveringInteractive
          ? 'rgba(225, 29, 46, 0.08)'
          : 'transparent';
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border transition-[border-color,background-color] duration-150 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[#E11D2E] shadow-[0_0_10px_rgba(225,29,46,0.9)] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
