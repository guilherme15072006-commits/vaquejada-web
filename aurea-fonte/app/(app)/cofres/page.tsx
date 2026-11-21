'use client';
import { Plus, Repeat } from 'lucide-react';
import Link from 'next/link';
import { GlassPanel, GoldNumber, Ingot } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { VaultIcon } from '@/components/app/VaultIcon';
import { CompleteSeal, GoldBurst } from '@/components/app/GoldBurst';
import { useAurea } from '@/lib/store/aurea';
import { formatBRL } from '@/lib/utils/format';
import { freqLabel } from '@/lib/utils/freq';

export default function Cofres() {
  const vaults = useAurea((s) => s.vaults); const hide = useAurea((s) => s.hideBalance);
  const total = vaults.reduce((s, v) => s + v.saved, 0);
  return (
    <Screen title="Cofres de ouro" action={<Link href="/cofres/novo" aria-label="Criar cofre" className="glass grid h-11 w-11 place-items-center rounded-full text-gold-200"><Plus size={22} strokeWidth={1.5} /></Link>} className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div><p className="text-sm text-fg-soft">Guardado em {vaults.length} barras</p><GoldNumber value={total} hidden={hide} label="Total em cofres" className="text-4xl" /></div>
        <p className="text-right text-xs text-fg-soft">rendendo<br /><span className="text-success">~100% CDI*</span></p>
      </div>
      {vaults.length === 0 && (
        <GlassPanel className="p-6 text-center"><p className="font-serif text-xl">Nenhuma barra ainda</p><p className="mt-1 text-sm text-fg-soft">Crie sua primeira meta e veja o ouro subir a cada real guardado.</p><Link href="/cofres/novo" className="mt-4 inline-block text-fg-gold">Criar cofre →</Link></GlassPanel>
      )}
      <ul className="space-y-3">
        {vaults.map((v) => { const p = v.saved / v.goal; const full = p >= 1; return (
          <li key={v.id}>
            <Link href={`/cofres/detalhe?id=${v.id}`} className="block">
              <GlassPanel specular={full} className="p-4">
                <div className="relative">
                  <Ingot value={p} className="h-24 w-full" label={`${v.name}: ${Math.round(p * 100)}% da meta`}>
                    <div className="flex h-full items-center justify-between px-[12%]">
                      <span className={`font-serif text-3xl tabular ${p > 0.55 ? 'text-[#2A1F05]' : 'text-fg'}`}>{Math.min(100, Math.round(p * 100))}%</span>
                      {full && <CompleteSeal />}
                    </div>
                  </Ingot>
                  {full && <GoldBurst />}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-gold-200"><VaultIcon icon={v.icon} /></span>
                  <p className="flex-1 truncate">{v.name}</p>
                  <p className="text-sm tabular text-fg-soft">{hide ? '••••' : `${formatBRL(v.saved)} / ${formatBRL(v.goal)}`}</p>
                </div>
                {v.rule && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-fg-gold"><Repeat size={12} aria-hidden /> {formatBRL(v.rule.amount)} {freqLabel(v.rule.frequency, v.rule.weekday)}</p>}
              </GlassPanel>
            </Link>
          </li>
        ); })}
      </ul>
      <p className="px-1 text-[11px] text-fg-soft/80">*Rendimento estimado, simulado. Não há garantia de retorno.</p>
    </Screen>
  );
}
