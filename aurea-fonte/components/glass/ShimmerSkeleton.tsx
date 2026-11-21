import { cn } from '@/lib/utils/format';
export function ShimmerSkeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('relative overflow-hidden rounded-sm bg-white/[0.05]', className)}><div className="absolute inset-0 motion-safe:animate-[shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[rgba(245,215,122,0.16)] to-transparent" /></div>;
}
