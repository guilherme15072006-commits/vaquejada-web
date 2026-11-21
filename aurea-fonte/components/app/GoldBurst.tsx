'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
/** Explosão sutil de partículas douradas (barra completa). */
export function GoldBurst({ count = 18 }: { count?: number }) {
  const reduce = useReducedMotion();
  const ps = useMemo(() => Array.from({ length: count }, (_, i) => { const a = (i / count) * Math.PI * 2; const d = 40 + (i % 4) * 14; return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7, s: 2 + (i % 3) }; }), [count]);
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {ps.map((p, i) => <motion.span key={i} className="absolute rounded-full bg-gold-200 shadow-[0_0_6px_rgba(245,215,122,.9)]" style={{ width: p.s, height: p.s }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: p.x, y: p.y, opacity: 0 }} transition={{ duration: 1.3, delay: 0.4 + (i % 5) * 0.04, ease: 'easeOut', repeat: Infinity, repeatDelay: 4 }} />)}
    </span>
  );
}
export function CompleteSeal() {
  return <span className="inline-flex items-center gap-1 rounded-pill border border-gold-200/60 bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-100 backdrop-blur">✦ Barra completa</span>;
}
