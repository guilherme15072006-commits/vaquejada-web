'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GlassButton, GlassPanel, GoldButton, Ingot } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { VAULT_ICONS } from '@/components/app/VaultIcon';
import { useAurea } from '@/lib/store/aurea';
import type { Frequency, VaultIcon } from '@/lib/mock/types';
import { cn, formatBRL } from '@/lib/utils/format';
import { WEEKDAY_NAMES } from '@/lib/utils/freq';

const parse = (s: string) => Number(s.replace(/\./g, '').replace(',', '.')) || 0;
const FREQS: { id: Frequency; label: string }[] = [{ id: 'unica', label: 'Sem regra' }, { id: 'semanal', label: 'Semanal' }, { id: 'quinzenal', label: 'Quinzenal' }, { id: 'mensal', label: 'Mensal' }];

export default function NovoCofre() {
  const router = useRouter(); const create = useAurea((s) => s.createVault); const toast = useAurea((s) => s.toast); const balance = useAurea((s) => s.balance);
  const [name, setName] = useState(''); const [icon, setIcon] = useState<VaultIcon>('plane');
  const [goal, setGoal] = useState(''); const [init, setInit] = useState(''); const [freq, setFreq] = useState<Frequency>('semanal'); const [rule, setRule] = useState('50'); const [wd, setWd] = useState(5);
  const [err, setErr] = useState<string | null>(null);
  const g = parse(goal), i = parse(init); const preview = g ? Math.min(1, i / g) : 0;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (freq !== 'unica' && parse(rule) <= 0) return setErr('Defina quanto guardar na regra.');
    const r = create({ name, icon, goal: g, initial: i, rule: freq === 'unica' ? undefined : { amount: parse(rule), frequency: freq, weekday: freq === 'semanal' ? wd : undefined } });
    if (!r.ok) return setErr(r.error);
    toast({ title: 'Cofre criado', body: `“${name.trim()}” já está rendendo.`, tone: 'gold' }); router.replace(`/cofres/detalhe?id=${r.id}`);
  };
  const field = 'h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 outline-none focus:border-gold-300';
  return (
    <Screen title="Novo cofre" back="/cofres">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <Ingot value={preview} className="mx-auto h-24 w-full" label="Prévia do cofre" />
        <div><label htmlFor="n" className="mb-1.5 block text-sm text-fg-soft">Nome</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="Ex.: Viagem para Salvador" className={field} /></div>
        <fieldset><legend className="mb-2 text-sm text-fg-soft">Ícone</legend>
          <div className="flex gap-2">{(Object.keys(VAULT_ICONS) as VaultIcon[]).map((k) => { const I = VAULT_ICONS[k]; return (
            <button key={k} type="button" onClick={() => setIcon(k)} aria-pressed={icon === k} aria-label={k} className={cn('glass grid h-12 w-12 place-items-center rounded-sm', icon === k ? 'glass-gold text-gold-100' : 'text-fg-soft')}><I size={20} strokeWidth={1.5} className="relative z-[1]" /></button>
          ); })}</div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="g" className="mb-1.5 block text-sm text-fg-soft">Meta (R$)</label><input id="g" inputMode="decimal" value={goal} onChange={(e) => setGoal(e.target.value.replace(/[^\d,]/g, ''))} placeholder="5.000" className={cn(field, 'tabular')} /></div>
          <div><label htmlFor="i" className="mb-1.5 block text-sm text-fg-soft">Valor inicial (R$)</label><input id="i" inputMode="decimal" value={init} onChange={(e) => setInit(e.target.value.replace(/[^\d,]/g, ''))} placeholder="0" className={cn(field, 'tabular')} aria-describedby="i-h" /><p id="i-h" className="mt-1 text-xs text-fg-soft">Disponível {formatBRL(balance)}</p></div>
        </div>
        <fieldset><legend className="mb-2 text-sm text-fg-soft">Guardar automaticamente</legend>
          <div className="flex flex-wrap gap-2">{FREQS.map((f) => <GlassButton key={f.id} type="button" size="sm" active={freq === f.id} onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}>{f.label}</GlassButton>)}</div>
          {freq !== 'unica' && (
            <GlassPanel className="mt-3 space-y-3 p-4">
              <div className="flex items-center gap-2"><span className="text-sm text-fg-soft">Guardar R$</span><input aria-label="Valor da regra" inputMode="decimal" value={rule} onChange={(e) => setRule(e.target.value.replace(/[^\d,]/g, ''))} className="h-11 w-24 rounded-sm border border-[var(--glass-border)] bg-black/30 px-3 tabular outline-none focus:border-gold-300" />
                {freq === 'semanal' && <><span className="text-sm text-fg-soft">toda</span><select aria-label="Dia da semana" value={wd} onChange={(e) => setWd(Number(e.target.value))} className="h-11 flex-1 rounded-sm border border-[var(--glass-border)] bg-ink-800 px-2 outline-none">{WEEKDAY_NAMES.map((w, k) => <option key={w} value={k}>{w}</option>)}</select></>}
              </div>
              {g > 0 && parse(rule) > 0 && <p className="text-xs text-fg-gold">Nesse ritmo a barra fica completa em ~{Math.ceil((g - i) / parse(rule))} {freq === 'mensal' ? 'meses' : freq === 'quinzenal' ? 'quinzenas' : 'semanas'}.</p>}
            </GlassPanel>
          )}
        </fieldset>
        {err && <p role="alert" className="text-sm text-danger">{err}</p>}
        <GoldButton type="submit" block size="lg">Criar cofre</GoldButton>
      </form>
    </Screen>
  );
}
