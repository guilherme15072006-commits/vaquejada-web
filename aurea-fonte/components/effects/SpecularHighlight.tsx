'use client';
import { useEffect } from 'react';
/** Um único listener global escreve --mx/--my (0..1) no <html>; painéis leem via CSS. Mouse no desktop, giroscópio no celular. */
export function PointerTracker() {
  useEffect(() => {
    const root = document.documentElement; let raf = 0; let x = 0.3, y = 0.2;
    const write = () => { raf = 0; root.style.setProperty('--mx', x.toFixed(3)); root.style.setProperty('--my', y.toFixed(3)); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(write); };
    const onMove = (e: PointerEvent) => { x = e.clientX / window.innerWidth; y = e.clientY / window.innerHeight; queue(); };
    const onTilt = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; x = Math.min(1, Math.max(0, 0.5 + e.gamma / 60)); y = Math.min(1, Math.max(0, 0.5 + (e.beta - 45) / 60)); queue(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onTilt, { passive: true });
    write();
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('deviceorientation', onTilt); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
export function SpecularHighlight({ strength = 1 }: { strength?: number }) {
  return (
    <div aria-hidden className="fx-layer pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0 transition-[background-position] duration-300"
        style={{
          opacity: 0.55 * strength, mixBlendMode: 'screen',
          background: 'radial-gradient(120% 60% at calc(var(--mx, .3) * 100%) calc(var(--my, .2) * 60%), rgba(255,255,255,0.22), transparent 45%)',
        }}
      />
      <div className="absolute -left-1/4 -top-1/2 h-full w-[150%] rotate-[-18deg]" style={{ opacity: 0.35 * strength, background: 'linear-gradient(180deg, var(--glass-highlight), transparent 35%)', transform: 'translateX(calc((var(--mx, .3) - .5) * 30px)) rotate(-18deg)' }} />
    </div>
  );
}
