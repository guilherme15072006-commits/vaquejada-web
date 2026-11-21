'use client';
import { useMemo, useState } from 'react';
import { GlassButton, GlassPanel, GlassSheet, GoldButton, GoldNumber } from '@/components/glass';
import { GoldLineChart } from '@/components/charts/GoldLineChart';
import { Screen } from '@/components/layout/Screen';
import { AmountDisplay, AmountPad } from '@/components/app/AmountPad';
import { Nugget } from '@/components/app/Nugget';
import { GOLD_PRICE, goldRange } from '@/lib/mock/gold';
import { useAurea } from '@/lib/store/aurea';
import { formatBRL, formatGrams } from '@/lib/utils/format';

const RANGES = ['7d', '30d', '1a'] as const;
export default function Ouro() {
  const grams = useAurea((s) => s.goldGrams); const balance = useAurea((s) => s.balance); const buy = useAurea((s) => s.buyGold); const sell = useAurea((s) => s.sellGold); const toast = useAurea((s) => s.toast);
  const [range, setRange] = useState<(typeof RANGES)[number]>('30d'); const [mode, setMode] = useState<'comprar' | 'vender' | null>(null); const [cents, setCents] = useState(0); const [err, setErr] = useState<string>();
  const series = useMemo(() => goldRange(range), [range]);
  const g = cents / 100 / GOLD_PRICE;
  const close = () => { setMode(null); setCents(0); setErr(undefined); };
  const confirm = () => {
    const r = mode === 'comprar' ? buy(cents / 100) : sell(+g.toFixed(4)); if (!r.ok) return setErr(r.error);
    toast({ title: mode === 'comprar' ? 'Ouro guardado' : 'Ouro vendido', body: `${formatGrams(g)} por ${formatBRL(cents / 100)}`, tone: 'gold' }); close();
  };
  return (
    <Screen title="Ouro digital" back className="space-y-5">
      <GlassPanel variant="strong" refraction specular radius="lg" className="p-5 text-center">
        <Nugget grams={grams} />
        <p className="text-sm text-fg-soft">Seu ouro</p>
        <p className="font-serif text-4xl tabular text-gold-metal">{formatGrams(grams)}</p>
        <p className="mt-1 text-sm text-fg-soft">≈ <GoldNumber value={grams * GOLD_PRICE} className="text-base" label="Valor estimado do ouro" /></p>
      </GlassPanel>
      <GlassPanel className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div><p className="text-xs text-fg-soft">Grama hoje (cotação simulada)</p><p className="font-serif text-2xl tabular">{formatBRL(GOLD_PRICE)}</p></div>
          <div className="flex gap-1" role="tablist" aria-label="Período">{RANGES.map((r) => <GlassButton key={r} size="sm" role="tab" aria-selected={range === r} active={range === r} onClick={() => setRange(r)} className="!h-11 !px-3">{r}</GlassButton>)}</div>
        </div>
        <GoldLineChart data={series.map((s) => s.price)} dates={series.map((s) => s.t)} label={`Cotação do grama em ${range}`} />
      </GlassPanel>
      <div className="grid grid-cols-2 gap-3"><GoldButton onClick={() => setMode('comprar')}>Comprar</GoldButton><GlassButton onClick={() => setMode('vender')} disabled={grams <= 0}>Vender</GlassButton></div>
      <p className="text-[11px] leading-relaxed text-fg-soft/80">Ouro digital custodiado por parceiro autorizado (simulação). O preço varia e pode cair; não há rentabilidade garantida.</p>
      <GlassSheet open={!!mode} onClose={close} title={mode === 'comprar' ? 'Comprar ouro' : 'Vender ouro'}>
        <AmountDisplay cents={cents} error={err} hint={cents ? `≈ ${formatGrams(g)}` : mode === 'comprar' ? `A partir de R$ 1 · disponível ${formatBRL(balance)}` : `Você tem ${formatGrams(grams)} (${formatBRL(grams * GOLD_PRICE)})`} />
        <AmountPad cents={cents} onChange={(c) => { setCents(c); setErr(undefined); }} />
        <GoldButton block size="lg" className="mt-4" disabled={mode === 'comprar' ? cents < 100 : !cents} onClick={confirm}>{mode === 'comprar' ? `Comprar ${cents ? formatGrams(g) : ''}` : 'Vender'}</GoldButton>
      </GlassSheet>
    </Screen>
  );
}
