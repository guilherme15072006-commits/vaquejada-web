'use client';
import { useCallback, useState, type PointerEvent as RPE } from 'react';
interface R { id: number; x: number; y: number; size: number }
/** Ripple de água com borda dourada. Use: const { onPointerDown, ripples } = useRipple(); */
export function useRipple() {
  const [items, setItems] = useState<R[]>([]);
  const onPointerDown = useCallback((e: RPE<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect(); const size = Math.max(r.width, r.height) * 2;
    const it = { id: Date.now() + Math.random(), x: e.clientX - r.left, y: e.clientY - r.top, size };
    setItems((p) => [...p.slice(-3), it]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== it.id)), 750);
  }, []);
  const ripples = (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {items.map((it) => (
        <span key={it.id} className="absolute rounded-full" style={{
          left: it.x - it.size / 2, top: it.y - it.size / 2, width: it.size, height: it.size,
          border: '1.5px solid rgba(245,215,122,0.7)', background: 'radial-gradient(circle, rgba(255,255,255,0.18), rgba(212,175,55,0.08) 40%, transparent 65%)',
          animation: 'aurea-ripple 750ms var(--ease-water) forwards',
        }} />
      ))}
      <style>{`@keyframes aurea-ripple{from{transform:scale(0);opacity:.9}to{transform:scale(1);opacity:0}}`}</style>
    </span>
  );
  return { onPointerDown, ripples };
}
