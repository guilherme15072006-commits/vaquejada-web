'use client';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatBRL } from '@/lib/utils/format';
import { cn } from '@/lib/utils/format';

/** Valor em R$ com count-up e gradiente metálico. hidden → vira névoa de vidro fosco. */
export function GoldNumber({ value, className, hidden, format = formatBRL, label, duration = 1.1 }: { value: number; className?: string; hidden?: boolean; format?: (v: number) => string; label?: string; duration?: number }) {
  const mv = useMotionValue(value); const [txt, setTxt] = useState(format(value)); const first = useRef(true); const reduce = useReducedMotion();
  useEffect(() => {
    const from = first.current ? value * 0.82 : mv.get(); first.current = false;
    if (reduce) { mv.set(value); setTxt(format(value)); return; }
    mv.set(from);
    const c = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setTxt(format(v)) });
    return () => c.stop();
  }, [value, duration, format, mv, reduce]);
  return (
    <span className={cn('relative inline-block font-serif tabular', className)} aria-label={hidden ? `${label ?? 'Valor'} oculto` : `${label ? label + ': ' : ''}${format(value)}`} role="text">
      <span aria-hidden className={cn('text-gold-metal transition-[filter,opacity] duration-500', hidden && 'opacity-40 blur-[10px]')}>{txt}</span>
      {hidden && <span aria-hidden className="absolute inset-0 rounded-sm bg-white/5 backdrop-blur-md" />}
    </span>
  );
}
