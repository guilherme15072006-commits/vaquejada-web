'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAurea, useHydrated } from '@/lib/store/aurea';

/** Ouro líquido escorre e se solidifica num "Á" metálico — 2,2 s. */
export default function Splash() {
  const router = useRouter(); const reduce = useReducedMotion(); const hydrated = useHydrated();
  const authed = useAurea((s) => s.authed); const onboarded = useAurea((s) => s.onboarded);
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => router.replace(authed ? '/home' : onboarded ? '/login' : '/onboarding'), reduce ? 600 : 2200);
    return () => clearTimeout(t);
  }, [hydrated, authed, onboarded, router, reduce]);
  return (
    <button onClick={() => router.replace(authed ? '/home' : onboarded ? '/login' : '/onboarding')} aria-label="Áurea — toque para continuar" className="relative grid h-full w-full place-items-center overflow-hidden">
      {/* ondas de água refletindo luz */}
      {[0, 1, 2].map((i) => (
        <motion.span key={i} aria-hidden className="absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-200/30"
          initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: [0.2, 3.2], opacity: [0, 0.6, 0] }} transition={{ duration: 2.2, delay: 0.9 + i * 0.35, ease: 'easeOut' }} style={{ scaleY: 0.35 }} />
      ))}
      <svg viewBox="0 0 200 220" className="relative w-44" aria-hidden>
        <defs>
          <clipPath id="a-clip"><path d="M100 40 L160 190 H134 L121 156 H79 L66 190 H40 Z M88 132 H112 L100 99 Z" /><path d="M104 32 L126 6 L136 13 L111 36 Z" /></clipPath>
          <filter id="splash-goo"><feGaussianBlur stdDeviation="3" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /></filter>
        </defs>
        {/* gota escorrendo */}
        <g filter="url(#splash-goo)">
          <motion.ellipse cx="100" rx="9" ry="12" fill="url(#aurea-gold)" initial={{ cy: -20 }} animate={{ cy: [-20, 70, 110], ry: [12, 16, 4], opacity: [1, 1, 0] }} transition={{ duration: 0.9, ease: 'easeIn' }} />
        </g>
        {/* enche o Á de baixo para cima */}
        <g clipPath="url(#a-clip)">
          <rect x="0" y="0" width="200" height="220" fill="rgba(255,255,255,.05)" />
          <motion.rect x="0" width="200" height="240" fill="url(#aurea-gold)" initial={{ y: 220 }} animate={{ y: 0 }} transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          <motion.rect x="-60" y="0" width="40" height="220" fill="rgba(255,255,255,.55)" transform="skewX(-20)" initial={{ x: -60 }} animate={{ x: 260 }} transition={{ duration: 0.7, delay: 1.5 }} />
        </g>
        <path d="M100 40 L160 190 H134 L121 156 H79 L66 190 H40 Z M88 132 H112 L100 99 Z" fill="none" stroke="rgba(245,215,122,.5)" strokeWidth="1" />
      </svg>
      <motion.p className="absolute bottom-[22%] font-serif text-4xl tracking-[0.25em] text-gold-metal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}>ÁUREA</motion.p>
      <motion.p className="absolute bottom-[16%] text-sm text-fg-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>seu dinheiro vira ouro</motion.p>
      <p className="absolute bottom-4 text-[11px] text-fg-soft/80">Protótipo — dados fictícios</p>
    </button>
  );
}
