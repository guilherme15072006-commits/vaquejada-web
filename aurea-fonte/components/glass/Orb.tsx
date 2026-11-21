'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';
/** Orbe de vidro com ouro líquido. mode: idle (ondula devagar), talking (ondula), listening (agita). */
export function Orb({ size = 120, mode = 'idle', level = 0.55 }: { size?: number; mode?: 'idle' | 'talking' | 'listening'; level?: number }) {
  const id = useId().replace(/:/g, ''); const reduce = useReducedMotion();
  const amp = mode === 'listening' ? 9 : mode === 'talking' ? 6 : 3; const dur = mode === 'listening' ? 0.7 : mode === 'talking' ? 1.4 : 3.2;
  const y = 100 - level * 100;
  const w = (a: number, o = 0) => `M-100 ${y + o} Q -75 ${y - a + o} -50 ${y + o} T 0 ${y + o} T 50 ${y + o} T 100 ${y + o} T 150 ${y + o} T 200 ${y + o} V 120 H -100Z`;
  return (
    <motion.div aria-hidden className="relative" style={{ width: size, height: size }} animate={reduce ? undefined : { scale: mode === 'listening' ? [1, 1.05, 1] : mode === 'talking' ? [1, 1.02, 1] : 1 }} transition={{ duration: dur, repeat: Infinity }}>
      <div className="absolute inset-[-18%] rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,.45), transparent 65%)', opacity: mode === 'idle' ? 0.5 : 0.9 }} />
      <svg viewBox="0 0 100 100" className="relative h-full w-full">
        <defs>
          <clipPath id={`c-${id}`}><circle cx="50" cy="50" r="46" /></clipPath>
          <radialGradient id={`g-${id}`} cx="35%" cy="30%"><stop offset="0%" stopColor="rgba(255,255,255,.22)" /><stop offset="100%" stopColor="rgba(255,255,255,.03)" /></radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill={`url(#g-${id})`} />
        <g clipPath={`url(#c-${id})`}>
          <motion.path d={w(amp)} fill="url(#aurea-gold)" opacity={0.6} animate={reduce ? undefined : { x: [0, 100] }} transition={{ duration: dur * 1.4, repeat: Infinity, ease: 'linear' }} />
          <motion.path d={w(amp * 0.8, 3)} fill="url(#aurea-gold)" animate={reduce ? undefined : { x: [100, 0] }} transition={{ duration: dur, repeat: Infinity, ease: 'linear' }} />
        </g>
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(245,215,122,.55)" strokeWidth="1" />
        <ellipse cx="34" cy="26" rx="14" ry="7" fill="rgba(255,255,255,.35)" transform="rotate(-30 34 26)" />
      </svg>
    </motion.div>
  );
}
