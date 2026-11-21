'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/format';
import { useRipple } from '../effects/Ripple';

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & { children: React.ReactNode; size?: 'md' | 'lg'; block?: boolean; loading?: boolean };

export function GoldButton({ className, children, size = 'md', block, loading, disabled, onPointerDown, ...rest }: Props) {
  const { onPointerDown: rp, ripples } = useRipple();
  return (
    <motion.button whileTap={{ scale: 0.97 }} disabled={disabled || loading} aria-busy={loading || undefined}
      onPointerDown={(e) => { rp(e); onPointerDown?.(e); }}
      className={cn('group relative isolate inline-flex touch items-center justify-center gap-2 overflow-hidden rounded-pill bg-gold-metal font-semibold text-[#2A1F05] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.6),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(140,106,28,0.5)] transition-[filter,opacity] disabled:opacity-50 disabled:saturate-50',
        size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-5 text-[15px]', block && 'w-full', className)}
      {...rest}>
      <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-none group-hover:animate-[shimmer_900ms_ease-out] group-hover:opacity-100" />
      {ripples}
      <span className="relative z-[1] inline-flex items-center gap-2">{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2A1F05]/30 border-t-[#2A1F05]" /> : children}</span>
    </motion.button>
  );
}
