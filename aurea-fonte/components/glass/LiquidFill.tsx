'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useId, useMemo } from 'react';
import { cn } from '@/lib/utils/format';

/** Container que enche de ouro líquido 0–100% com superfície ondulada, reflexo metálico e bolhas. */
export function LiquidFill({ value, className, bubbles = true, children, label, wave = 1, rounded = 'rounded-md' }: { value: number; className?: string; bubbles?: boolean; children?: React.ReactNode; label?: string; wave?: number; rounded?: string }) {
  const pct = Math.max(0, Math.min(1, value)); const id = useId().replace(/:/g, ''); const reduce = useReducedMotion();
  const bs = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ left: 8 + ((i * 37) % 84), size: 3 + ((i * 7) % 6), delay: (i * 0.9) % 5, dur: 3.5 + (i % 3) })), []);
  const wavePath = (amp: number) => `M0 ${10} Q 25 ${10 - amp} 50 10 T 100 10 T 150 10 T 200 10 V 200 H 0 Z`;
  return (
    <div className={cn('relative overflow-hidden', rounded, className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} aria-label={label}>
      <div className="absolute inset-0 bg-white/[0.03]" />
      <motion.div className="absolute inset-x-0 bottom-0" initial={{ height: '0%' }} animate={{ height: `${pct * 100}%` }} transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}>
        {pct < 1 && (
          <div className="absolute inset-x-0 -top-[10px] h-[20px] overflow-hidden">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute left-0 top-0 h-full w-[200%] motion-safe:animate-[aurea-wave_3.2s_linear_infinite] opacity-60"><path d={wavePath(5 * wave)} fill={`url(#lf-${id})`} /></svg>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute left-0 top-[2px] h-full w-[200%] motion-safe:animate-[aurea-wave_2.2s_linear_infinite_reverse]"><path d={wavePath(4 * wave)} fill={`url(#lf-${id})`} /></svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gold-metal motion-safe:animate-[gold-sheen_6s_ease-in-out_infinite]" style={{ boxShadow: 'inset 0 6px 14px rgba(255,244,204,0.45), inset 0 -12px 24px rgba(90,64,10,0.55)' }} />
        <div className="absolute inset-y-0 left-[12%] w-[14%] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[2px]" />
        {bubbles && pct > 0.05 && pct < 1 && bs.map((b, i) => (
          <span key={i} className="absolute bottom-0 rounded-full border border-white/50 bg-white/20 motion-safe:animate-[bubble_var(--d)_ease-in_infinite]" style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDelay: `${b.delay}s`, ['--d' as string]: `${b.dur}s` }} />
        ))}
        <svg width="0" height="0" className="absolute"><defs><linearGradient id={`lf-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF4CC" /><stop offset="100%" stopColor="#D4AF37" /></linearGradient></defs></svg>
      </motion.div>
      <style>{`@keyframes aurea-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      {children && <div className="relative z-[2] h-full">{children}</div>}
    </div>
  );
}
