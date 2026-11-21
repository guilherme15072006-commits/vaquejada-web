import type { Level } from '@/lib/mock/types';
import { LEVELS } from '@/lib/mock/user';
import { cn } from '@/lib/utils/format';
export function Avatar({ name, hue, level, size = 44, className }: { name: string; hue: number; level?: Level; size?: number; className?: string }) {
  const l = LEVELS.find((x) => x.id === level); const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center rounded-full', className)} style={{ width: size, height: size, padding: 2.5, background: l ? `conic-gradient(from 210deg, ${l.color[0]}, ${l.color[1]}, ${l.color[2]}, ${l.color[0]})` : 'var(--glass-border)' }} aria-label={`${name}${l ? `, nível ${l.name}` : ''}`} role="img">
      <span className="grid h-full w-full place-items-center rounded-full font-semibold" style={{ background: `radial-gradient(circle at 30% 25%, hsl(${hue} 45% 42%), hsl(${hue} 40% 16%))`, fontSize: size * 0.36, color: '#FAF7EE', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }}>{initials}</span>
    </span>
  );
}
