'use client';
import { useMemo, useState } from 'react';
import { GlassButton, GlassPanel } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { TxRow } from '@/components/app/TxRow';
import { TxSheet } from '@/components/app/TxSheet';
import type { Transaction } from '@/lib/mock/types';
import { useAurea } from '@/lib/store/aurea';
import { formatBRL, formatDay } from '@/lib/utils/format';

const FILTERS = [
  { id: 'todos', label: 'Tudo', fn: () => true },
  { id: 'entradas', label: 'Entradas', fn: (t: Transaction) => t.kind === 'entrada' },
  { id: 'saidas', label: 'Saídas', fn: (t: Transaction) => t.kind === 'saida' },
  { id: 'pix', label: 'Pix', fn: (t: Transaction) => t.channel === 'pix' },
  { id: 'cartao', label: 'Cartão', fn: (t: Transaction) => t.channel === 'cartao' },
  { id: 'cofres', label: 'Cofres', fn: (t: Transaction) => t.channel === 'cofre' },
] as const;

export default function Extrato() {
  const txs = useAurea((s) => s.transactions); const hide = useAurea((s) => s.hideBalance);
  const [f, setF] = useState<(typeof FILTERS)[number]['id']>('todos'); const [q, setQ] = useState(''); const [sel, setSel] = useState<Transaction | null>(null);
  const groups = useMemo(() => {
    const fn = FILTERS.find((x) => x.id === f)!.fn; const qq = q.trim().toLowerCase();
    const list = txs.filter((t) => fn(t) && (!qq || (t.title + t.detail).toLowerCase().includes(qq)));
    const m = new Map<string, Transaction[]>(); list.forEach((t) => { const k = new Date(t.date).toDateString(); m.set(k, [...(m.get(k) ?? []), t]); });
    return [...m.values()];
  }, [txs, f, q]);
  const sums = useMemo(() => txs.reduce((a, t) => (t.kind === 'entrada' ? { ...a, in: a.in + t.amount } : { ...a, out: a.out + t.amount }), { in: 0, out: 0 }), [txs]);
  return (
    <Screen title="Extrato" back className="space-y-4">
      <dl className="grid grid-cols-2 divide-x divide-white/10 rounded-md border border-[var(--glass-border)] bg-white/[0.03] py-3 text-center">
        <div><dt className="text-xs text-fg-soft">Entradas · 30 dias</dt><dd className="tabular text-success">{hide ? '••••' : formatBRL(sums.in)}</dd></div>
        <div><dt className="text-xs text-fg-soft">Saídas · 30 dias</dt><dd className="tabular">{hide ? '••••' : formatBRL(sums.out)}</dd></div>
      </dl>
      <input aria-label="Buscar no extrato" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar transação" className="h-12 w-full rounded-pill border border-[var(--glass-border)] bg-black/30 px-5 outline-none focus:border-gold-300" />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="radiogroup" aria-label="Filtro">{FILTERS.map((x) => <GlassButton key={x.id} size="sm" role="radio" aria-checked={f === x.id} active={f === x.id} onClick={() => setF(x.id)} className="shrink-0">{x.label}</GlassButton>)}</div>
      {groups.length === 0 && <GlassPanel className="p-6 text-center text-sm text-fg-soft">Nenhuma transação com esse filtro. Tente “Tudo” ou outra busca.</GlassPanel>}
      {groups.map((g) => { const day = g[0]!.date; const net = g.reduce((s, t) => s + (t.kind === 'entrada' ? t.amount : -t.amount), 0); return (
        <section key={day} aria-label={formatDay(day)}>
          <div className="mb-1.5 flex justify-between px-2 text-xs uppercase tracking-[0.12em] text-fg-soft"><h2>{formatDay(day)}</h2><span className="tabular normal-case">{hide ? '' : `${net >= 0 ? '+' : '−'} ${formatBRL(Math.abs(net))}`}</span></div>
          <GlassPanel className="p-1.5">{g.map((t) => <TxRow key={t.id} tx={t} hidden={hide} onClick={() => setSel(t)} />)}</GlassPanel>
        </section>
      ); })}
      <TxSheet tx={sel} onClose={() => setSel(null)} />
    </Screen>
  );
}
