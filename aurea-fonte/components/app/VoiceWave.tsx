'use client';
import { motion } from 'framer-motion';
/** Onda dourada de “gravação” simulada. */
export function VoiceWave({ active, bars = 24 }: { active: boolean; bars?: number }) {
  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-gold-metal" animate={{ height: active ? [6, 10 + ((i * 13) % 26), 6] : 4 }} transition={{ duration: 0.5 + (i % 5) * 0.12, repeat: active ? Infinity : 0, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}
