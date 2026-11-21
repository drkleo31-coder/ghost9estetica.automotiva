import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number; // depth layer 0.2..1.0
  vx: number;
  vy: number;
  radius: number;
  isRed: boolean;
  alpha: number;
}

interface FloatingShard {
  x: number;
  y: number;
  z: number;
  size: number;
  angle: number;
  spin: number;
  isRed: boolean;
}

export function StudioAtmosphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallViewport = window.innerWidth < 768;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPowerDevice = (nav.deviceMemory ?? 8) <= 4 || isSmallViewport;

    const particleCount = reducedMotion ? 22 : lowPowerDevice ? 40 : 88;
    const shardCount = reducedMotion ? 3 : lowPowerDevice ? 5 : 9;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1.25 : 1.75);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1.25 : 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.25 + (i % 5) * 0.18,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.12 + Math.random() * 0.28),
      radius: 0.7 + Math.random() * 1.6,
      isRed: i % 3 === 0 || i % 5 === 0,
      alpha: 0.2 + Math.random() * 0.55,
    }));

    const shards: FloatingShard[] = Array.from({ length: shardCount }, (_, i) => ({
      x: ((i + 0.5) / shardCount) * width,
      y: Math.random() * height,
      z: 0.35 + (i % 3) * 0.25,
      size: 28 + (i % 4) * 16,
      angle: Math.random() * Math.PI * 2,
      spin: (i % 2 === 0 ? 1 : -1) * 0.0025,
      isRed: i % 2 === 0,
    }));

    let scrollY = window.scrollY;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let rafId = 0;
    let lastTime = performance.now();

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / Math.max(1, width) - 0.5) * 2;
      targetMouseY = (e.clientY / Math.max(1, height) - 0.5) * 2;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const drawFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now * 0.00045;

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Animated studio red & charcoal atmospheric mist gradients
      const glowX = width * (0.72 + Math.sin(t * 0.7) * 0.06 - smoothMouseX * 0.04);
      const glowY = height * (0.28 + Math.cos(t * 0.5) * 0.06 - smoothMouseY * 0.04);
      const redMist = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, Math.max(width, height) * 0.58);
      redMist.addColorStop(0, 'rgba(225, 29, 46, 0.11)');
      redMist.addColorStop(0.45, 'rgba(130, 14, 26, 0.04)');
      redMist.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = redMist;
      ctx.fillRect(0, 0, width, height);

      const coolX = width * (0.2 + Math.cos(t * 0.4) * 0.04 + smoothMouseX * 0.03);
      const coolY = height * (0.76 + Math.sin(t * 0.6) * 0.05);
      const chromeMist = ctx.createRadialGradient(coolX, coolY, 10, coolX, coolY, Math.max(width, height) * 0.5);
      chromeMist.addColorStop(0, 'rgba(244, 245, 247, 0.045)');
      chromeMist.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = chromeMist;
      ctx.fillRect(0, 0, width, height);

      // Abstract architectural laser lines in background depth
      ctx.save();
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const offset = ((scrollY * (0.04 + i * 0.02)) % (height + 300)) - 150;
        const grad = ctx.createLinearGradient(0, offset, width, offset - 220);
        grad.addColorStop(0, 'rgba(225, 29, 46, 0)');
        grad.addColorStop(0.5, i === 1 ? 'rgba(225, 29, 46, 0.14)' : 'rgba(244, 245, 247, 0.05)');
        grad.addColorStop(1, 'rgba(225, 29, 46, 0)');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-40, offset + i * 160);
        ctx.lineTo(width + 40, offset - 240 + i * 160);
        ctx.stroke();
      }
      ctx.restore();

      // Floating abstract geometric shards (multi-layer parallax)
      for (const s of shards) {
        if (!reducedMotion) {
          s.angle += s.spin * (dt * 60);
        }
        const py = ((s.y - scrollY * s.z * 0.18) % (height + 120) + (height + 120)) % (height + 120) - 60;
        const px = s.x + smoothMouseX * s.z * 26;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(s.angle);
        ctx.scale(1, 0.84 + Math.sin(t + s.x * 0.01) * 0.14);
        ctx.strokeStyle = s.isRed ? 'rgba(225, 29, 46, 0.18)' : 'rgba(244, 245, 247, 0.09)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const r = s.size * s.z;
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          const hx = Math.cos(a) * r;
          const hy = Math.sin(a) * r;
          if (k === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
        ctx.strokeStyle = s.isRed ? 'rgba(244, 245, 247, 0.07)' : 'rgba(225, 29, 46, 0.12)';
        ctx.stroke();
        ctx.restore();
      }

      // Multi-depth floating red & metallic white particles
      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx * p.z * (dt * 60);
          p.y += p.vy * p.z * (dt * 60);
          if (p.y < -12) {
            p.y = height + 12;
            p.x = Math.random() * width;
          }
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
        }

        const parallaxY = ((p.y - scrollY * p.z * 0.24) % height + height) % height;
        const parallaxX = p.x + smoothMouseX * p.z * 18;

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, p.radius * (0.65 + p.z * 0.55), 0, Math.PI * 2);
        if (p.isRed) {
          ctx.fillStyle = `rgba(225, 29, 46, ${p.alpha})`;
          if (!lowPowerDevice) {
            ctx.shadowColor = 'rgba(225, 29, 46, 0.65)';
            ctx.shadowBlur = 8 * p.z;
          }
        } else {
          ctx.fillStyle = `rgba(244, 245, 247, ${p.alpha * 0.72})`;
          if (!lowPowerDevice) {
            ctx.shadowColor = 'rgba(244, 245, 247, 0.35)';
            ctx.shadowBlur = 4 * p.z;
          }
        }
        ctx.fill();
      }
      if (!lowPowerDevice) {
        ctx.shadowBlur = 0;
      }

      if (!reducedMotion && !document.hidden) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    const onVisibilityChange = () => {
      if (reducedMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastTime = performance.now();
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reducedMotion) {
      drawFrame(performance.now());
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
