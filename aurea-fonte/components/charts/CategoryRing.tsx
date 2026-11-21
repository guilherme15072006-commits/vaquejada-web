'use client';
import { motion } from 'framer-motion';
import { CATEGORY_COLOR } from '@/lib/mock/transactions';
import type { Category } from '@/lib/mock/types';
import { formatBRL } from '@/lib/utils/format';

export function CategoryRing({ items, total, size = 120 }: { items: { category: Category; label: string; value: number }[]; total: number; size?: number }) {
  const r = 42, C = 2 * Math.PI * r; let acc = 0; const top = items.slice(0, 5);
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`Gastos por categoria: ${top.map((i) => `${i.label} ${formatBRL(i.value)}`).join(', ')}`} className="-rotate-90 shrink-0">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
        {top.map((i, k) => { const len = (i.value / (total || 1)) * C; const off = acc; acc += len;
          return <motion.circle key={i.category} cx="50" cy="50" r={r} fill="none" stroke={CATEGORY_COLOR[i.category]} strokeWidth="10" strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: -off }} transition={{ duration: 0.9, delay: k * 0.08, ease: [0.22, 1, 0.36, 1] }} />; })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5 text-[13px]">
        {top.map((i) => (
          <li key={i.category} className="flex items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: CATEGORY_COLOR[i.category] }} /><span className="flex-1 truncate text-fg-soft">{i.label}</span><span className="tabular">{formatBRL(i.value)}</span></li>
        ))}
      </ul>
    </div>
  );
}
