'use client';
import { motion, useReducedMotion } from 'framer-motion';
/** Pepita em SVG “3D” (facetas + rotação em Y via CSS 3D), cresce com o saldo em gramas. */
export function Nugget({ grams }: { grams: number }) {
  const reduce = useReducedMotion(); const scale = 0.6 + Math.min(1, Math.log10(1 + grams) / 1.3) * 0.55;
  return (
    <div className="relative grid h-48 place-items-center" style={{ perspective: 600 }} aria-hidden>
      <div className="absolute bottom-6 h-6 w-40 rounded-[50%] bg-gold-400/25 blur-xl" />
      <motion.div animate={{ scale }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
        <motion.svg viewBox="0 0 120 100" width={170} height={140} style={{ transformStyle: 'preserve-3d' }} animate={reduce ? undefined : { rotateY: [-25, 25, -25], rotateX: [6, -4, 6] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
          <defs>
            <linearGradient id="nug-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF4CC" /><stop offset=".5" stopColor="#E8C15A" /><stop offset="1" stopColor="#8C6A1C" /></linearGradient>
            <linearGradient id="nug-b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D4AF37" /><stop offset="1" stopColor="#5C430F" /></linearGradient>
          </defs>
          <path d="M18 58 L30 26 L58 14 L90 22 L106 48 L96 76 L64 88 L30 80 Z" fill="url(#nug-b)" />
          <path d="M30 26 L58 14 L90 22 L70 44 L42 46 Z" fill="url(#nug-a)" />
          <path d="M18 58 L30 26 L42 46 L36 70 Z" fill="#B8912A" />
          <path d="M42 46 L70 44 L76 68 L50 74 L36 70 Z" fill="#E8C15A" />
          <path d="M70 44 L90 22 L106 48 L96 76 L76 68 Z" fill="#A27C22" />
          <path d="M36 70 L50 74 L76 68 L96 76 L64 88 L30 80 Z" fill="#7A5B17" />
          <path d="M46 22 L60 18 L54 30 Z" fill="rgba(255,255,255,.75)" />
          <circle cx="56" cy="54" r="3" fill="rgba(255,255,255,.55)" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
