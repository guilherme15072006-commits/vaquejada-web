'use client';
import { motion } from 'framer-motion';
import { useId, useMemo, useState } from 'react';
import { formatBRL } from '@/lib/utils/format';

/** Linha dourada com área translúcida, ponto interativo (ponteiro/teclado) e resumo acessível. */
export function GoldLineChart({ data, height = 160, label, format = formatBRL, dates }: { data: number[]; height?: number; label: string; format?: (v: number) => string; dates?: number[] }) {
  const id = useId().replace(/:/g, ''); const W = 320; const H = height; const pad = 8;
  const [hover, setHover] = useState<number | null>(null);
  const { path, area, pts, min, max } = useMemo(() => {
    const min = Math.min(...data), max = Math.max(...data); const span = max - min || 1;
    const pts = data.map((v, i) => [pad + (i / Math.max(1, data.length - 1)) * (W - pad * 2), pad + (1 - (v - min) / span) * (H - pad * 2)] as const);
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    return { path, area: `${path} L${W - pad} ${H} L${pad} ${H} Z`, pts, min, max };
  }, [data, H]);
  const first = data[0] ?? 0, last = data[data.length - 1] ?? 0; const up = last >= first;
  const hp = hover != null ? pts[hover] : undefined;
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full touch-none" style={{ height }} role="img" aria-label={`${label}: de ${format(first)} para ${format(last)}, mínima ${format(min)}, máxima ${format(max)}`}
        tabIndex={0}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; setHover(Math.max(0, Math.min(data.length - 1, Math.round(((x - pad) / (W - pad * 2)) * (data.length - 1))))); }}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? data.length) - 1)); if (e.key === 'ArrowRight') setHover((h) => Math.min(data.length - 1, (h ?? -1) + 1)); }}>
        <defs>
          <linearGradient id={`a-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(212,175,55,.35)" /><stop offset="100%" stopColor="rgba(212,175,55,0)" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={pad} x2={W - pad} y1={H * g} y2={H * g} stroke="rgba(245,215,122,.08)" strokeDasharray="2 4" />)}
        <motion.path d={area} fill={`url(#a-${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
        <motion.path key={path} d={path} fill="none" stroke="url(#aurea-gold)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
        {hp && <g><line x1={hp[0]} x2={hp[0]} y1={0} y2={H} stroke="rgba(245,215,122,.35)" /><circle cx={hp[0]} cy={hp[1]} r={5} fill="#F5D77A" stroke="#07070A" strokeWidth={2} /></g>}
      </svg>
      <figcaption className="mt-1 flex justify-between text-xs text-fg-soft tabular" aria-live="polite">
        {hover != null ? <><span>{dates?.[hover] ? new Date(dates[hover]!).toLocaleDateString('pt-BR') : `Ponto ${hover + 1}`}</span><span className="text-fg-gold">{format(data[hover]!)}</span></>
          : <><span>Mín. {format(min)}</span><span className={up ? 'text-success' : 'text-danger'}>{up ? '▲' : '▼'} {(((last - first) / (first || 1)) * 100).toFixed(2).replace('.', ',')}%</span><span>Máx. {format(max)}</span></>}
      </figcaption>
    </figure>
  );
}

export function Sparkline({ data, width = 96, height = 28, label }: { data: number[]; width?: number; height?: number; label: string }) {
  const min = Math.min(...data), max = Math.max(...data); const s = max - min || 1;
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${(i / (data.length - 1)) * width} ${height - 2 - ((v - min) / s) * (height - 4)}`).join(' ');
  return <svg width={width} height={height} role="img" aria-label={label}><path d={d} fill="none" stroke="url(#aurea-gold)" strokeWidth={1.75} strokeLinecap="round" /></svg>;
}
