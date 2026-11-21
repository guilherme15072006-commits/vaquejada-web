'use client';
import { useEffect, useRef } from 'react';
import { useAurea } from '@/lib/store/aurea';
/** Poeira de ouro flutuando: canvas leve, máx. 40 partículas, pausa em reduced-motion e aba oculta. */
export function GoldDust({ count = 36 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useAurea((s) => s.reduceMotion);
  useEffect(() => {
    const c = ref.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const n = Math.min(40, count); let w = 0, h = 0, raf = 0; const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { w = window.innerWidth; h = window.innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.4 + Math.random() * 1.6, vx: (Math.random() - 0.5) * 0.12, vy: -0.05 - Math.random() * 0.18, a: 0.2 + Math.random() * 0.6, t: Math.random() * 6.28 }));
    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (animate) { p.t += 0.01; p.x += p.vx + Math.sin(p.t) * 0.08; p.y += p.vy; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4; }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(255,236,170,${p.a * (0.7 + 0.3 * Math.sin(p.t * 2))})`); g.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill();
      }
    };
    const loop = () => { draw(true); raf = requestAnimationFrame(loop); };
    const start = () => { cancelAnimationFrame(raf); if (mq.matches || reduce || document.hidden) draw(false); else loop(); };
    start();
    window.addEventListener('resize', resize); document.addEventListener('visibilitychange', start); mq.addEventListener('change', start);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', start); mq.removeEventListener('change', start); };
  }, [count, reduce]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
