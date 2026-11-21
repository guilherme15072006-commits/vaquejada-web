'use client';
import { LiquidFill } from './LiquidFill';
import { cn } from '@/lib/utils/format';
/** Lingote de vidro (trapézio) que enche com ouro líquido. */
export function Ingot({ value, className, children, label }: { value: number; className?: string; children?: React.ReactNode; label?: string }) {
  const full = value >= 1;
  return (
    <div className={cn('relative', className)} style={{ clipPath: 'polygon(9% 0, 91% 0, 100% 100%, 0 100%)' }}>
      <div className="absolute inset-0"><LiquidFill value={value} rounded="rounded-[10px]" className="h-full w-full" label={label} /></div>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.22), transparent 30%, transparent 70%, rgba(0,0,0,.25))', boxShadow: 'inset 0 0 0 1px rgba(245,215,122,.4)' }} />
      {full && <div className="pointer-events-none absolute inset-0 motion-safe:animate-[shimmer_2.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />}
      <div className="relative z-[2] h-full">{children}</div>
    </div>
  );
}
