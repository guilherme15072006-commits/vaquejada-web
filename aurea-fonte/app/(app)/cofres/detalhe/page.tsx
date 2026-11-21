'use client';
import { ArrowDownToLine, ArrowUpFromLine, Repeat } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { GlassButton, GlassPanel, GlassSheet, GoldButton, GoldNumber, Ingot } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { AmountDisplay, AmountPad } from '@/components/app/AmountPad';
import { CompleteSeal, GoldBurst } from '@/components/app/GoldBurst';
import { VaultIcon } from '@/components/app/VaultIcon';
import { dailyRate } from '@/lib/mock/balance';
import { useAurea } from '@/lib/store/aurea';
import { formatBRL } from '@/lib/utils/format';
import { freqLabel } from '@/lib/utils/freq';

function Detail() {
  const id = useSearchParams()?.get('id') ?? ''; const v = useAurea((s) => s.vaults.find((x) => x.id === id));
  const deposit = useAurea((s) => s.deposit); const withdraw = useAurea((s) => s.withdraw); const toast = useAurea((s) => s.toast); const balance = useAurea((s) => s.balance);
  const [mode, setMode] = useState<'guardar' | 'resgatar' | null>(null); const [cents, setCents] = useState(0); const [err, setErr] = useState<string>();
  if (!v) return <Screen title="Cofre" back="/cofres"><GlassPanel className="p-6 text-center"><p>Cofre não encontrado.</p><Link href="/cofres" className="mt-3 inline-block text-fg-gold">Voltar aos cofres</Link></GlassPanel></Screen>;
  const p = v.saved / v.goal; const full = p >= 1; const monthYield = v.saved * dailyRate() * 21;
  const confirm = () => {
    const amount = cents / 100; const r = mode === 'guardar' ? deposit(v.id, amount) : withdraw(v.id, amount);
    if (!r.ok) return setErr(r.error);
    const willFill = mode === 'guardar' && v.saved + amount >= v.goal && !full;
    toast({ title: willFill ? '✦ Barra completa!' : mode === 'guardar' ? 'Guardado' : 'Resgatado', body: `${formatBRL(amount)} ${mode === 'guardar' ? 'no' : 'do'} cofre ${v.name}.`, tone: 'gold' });
    setMode(null); setCents(0); setErr(undefined);
  };
  return (
    <Screen title={v.name} back="/cofres" className="space-y-5">
      <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
        <div className="relative">
          <Ingot value={p} className="h-36 w-full" label={`${Math.round(p * 100)}% da meta`}>
            <div className="flex h-full flex-col items-center justify-center gap-2">{full ? <CompleteSeal /> : <span className={`font-serif text-5xl tabular ${p > 0.5 ? 'text-[#2A1F05]' : ''}`}>{Math.round(p * 100)}%</span>}</div>
          </Ingot>
          {full && <GoldBurst count={24} />}
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div><p className="text-sm text-fg-soft">Guardado</p><GoldNumber value={v.saved} className="text-3xl" label="Guardado" /></div>
          <div className="text-right"><p className="text-sm text-fg-soft">Meta</p><p className="font-serif text-2xl tabular">{formatBRL(v.goal)}</p></div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-white/5 text-sm">
          <div className="bg-ink-900/60 p-3"><dt className="text-xs text-fg-soft">Rendimento estimado no mês*</dt><dd className="tabular text-success">+ {formatBRL(monthYield)}</dd></div>
          <div className="bg-ink-900/60 p-3"><dt className="text-xs text-fg-soft">Falta</dt><dd className="tabular">{formatBRL(Math.max(0, v.goal - v.saved))}</dd></div>
        </dl>
        {v.rule && <p className="mt-3 flex items-center gap-1.5 text-sm text-fg-gold"><Repeat size={14} aria-hidden /> Regra: {formatBRL(v.rule.amount)} {freqLabel(v.rule.frequency, v.rule.weekday)}</p>}
      </GlassPanel>
      <div className="grid grid-cols-2 gap-3">
        <GoldButton onClick={() => setMode('guardar')}><ArrowDownToLine size={18} strokeWidth={1.5} /> Guardar</GoldButton>
        <GlassButton onClick={() => setMode('resgatar')} disabled={v.saved <= 0}><ArrowUpFromLine size={18} strokeWidth={1.5} /> Resgatar</GlassButton>
      </div>
      <section aria-labelledby="hist"><h2 id="hist" className="mb-2 font-serif text-xl">Histórico</h2>
        <GlassPanel className="divide-y divide-white/5 px-4">
          {v.history.length === 0 && <p className="py-4 text-sm text-fg-soft">Nenhum movimento ainda. Guarde o primeiro real!</p>}
          {v.history.map((h) => (
            <div key={h.id} className="flex items-center gap-3 py-3"><span className="text-gold-200"><VaultIcon icon={v.icon} size={16} /></span><span className="flex-1 text-sm">{h.amount > 0 ? 'Guardado' : 'Resgatado'} · <span className="text-fg-soft">{new Date(h.date).toLocaleDateString('pt-BR')}</span></span><span className={`tabular text-sm ${h.amount > 0 ? 'text-fg-gold' : 'text-fg-soft'}`}>{h.amount > 0 ? '+' : '−'} {formatBRL(Math.abs(h.amount))}</span></div>
          ))}
        </GlassPanel>
      </section>
      <p className="text-[11px] text-fg-soft/80">*Simulação. Rendimento não garantido.</p>
      <GlassSheet open={!!mode} onClose={() => { setMode(null); setCents(0); setErr(undefined); }} title={mode === 'guardar' ? 'Guardar no cofre' : 'Resgatar do cofre'}>
        <AmountDisplay cents={cents} error={err} hint={mode === 'guardar' ? `Disponível ${formatBRL(balance)}` : `No cofre ${formatBRL(v.saved)}`} />
        <div className="mb-4 flex justify-center gap-2">{[20, 50, 100].map((q) => <GlassButton key={q} size="sm" onClick={() => setCents(q * 100)}>R$ {q}</GlassButton>)}{mode === 'resgatar' && <GlassButton size="sm" onClick={() => setCents(Math.round(v.saved * 100))}>Tudo</GlassButton>}</div>
        <AmountPad cents={cents} onChange={(c) => { setCents(c); setErr(undefined); }} />
        <GoldButton block size="lg" className="mt-4" disabled={!cents} onClick={confirm}>Confirmar</GoldButton>
      </GlassSheet>
    </Screen>
  );
}
export default function Page() { return <Suspense><Detail /></Suspense>; }
