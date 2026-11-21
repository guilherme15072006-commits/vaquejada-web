'use client';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/format';
import { WaterRefraction } from '../effects/WaterRefraction';
import { SpecularHighlight } from '../effects/SpecularHighlight';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'soft' | 'strong' | 'gold';
  refraction?: boolean; specular?: boolean;
  radius?: 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article';
}
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { variant = 'soft', refraction, specular, radius = 'md', className, children, as: Tag = 'div', ...rest }, ref,
) {
  const T = Tag as 'div';
  return (
    <T ref={ref} className={cn('glass', variant === 'strong' && 'glass-strong', variant === 'gold' && 'glass-gold', radius === 'sm' ? 'rounded-sm' : radius === 'lg' ? 'rounded-lg' : 'rounded-md', className)} {...rest}>
      {refraction && <WaterRefraction />}
      {specular && <SpecularHighlight />}
      <div className="relative z-[2]">{children}</div>
    </T>
  );
});
