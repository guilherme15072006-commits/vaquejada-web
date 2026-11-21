'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/format';
import { useRipple } from '../effects/Ripple';

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & { children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; block?: boolean; active?: boolean };
export function GlassButton({ className, children, size = 'md', block, active, onPointerDown, ...rest }: Props) {
  const { onPointerDown: rp, ripples } = useRipple();
  return (
    <motion.button whileTap={{ scale: 0.97 }} onPointerDown={(e) => { rp(e); onPointerDown?.(e); }}
      className={cn('glass relative inline-flex touch items-center justify-center gap-2 overflow-hidden rounded-pill font-medium text-fg transition-colors disabled:opacity-40',
        active && 'glass-gold text-fg-gold', size === 'sm' ? 'h-11 px-4 text-sm' : size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-5 text-[15px]', block && 'w-full', className)}
      {...rest}>
      {ripples}<span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
