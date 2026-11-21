'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, BellRing, Bot, ChevronRight, CreditCard, Eye, EyeOff, Gem, Lock, Sparkles, Users, Zap } from 'lucide-react';
import { useSocial } from '@/lib/store/social';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Avatar, GlassPanel, GoldNumber, Ingot } from '@/components/glass';
import { Sparkline } from '@/components/charts/GoldLineChart';
import { Screen } from '@/components/layout/Screen';
import { TxRow } from '@/components/app/TxRow';
import { TxSheet } from '@/components/app/TxSheet';
import { VaultIcon } from '@/components/app/VaultIcon';
import { useLiveYield } from '@/components/app/LiveYield';
import { yieldSeries } from '@/lib/mock/balance';
import { findDuplicate } from '@/lib/mock/ai';
import { useAurea } from '@/lib/store/aurea';
import type { Transaction } from '@/lib/mock/types';
import { formatBRL } from '@/lib/utils/format';

const SHORTCUTS = [
  { href: '/pix', label: 'Pix', I: Zap }, { href: '/cofres', label: 'Cofres', I: Lock }, { href: '/ouro', label: 'Ouro', I: Gem },
  { href: '/cartao', label: 'Cartão', I: CreditCard }, { href: '/assessor', label: 'Assessor', I: Bot }, { href: '/grupos', label: 'Grupos', I: Users },
];
const TIPS = ['Você gastou 18% menos com transporte que no mês passado. Que tal mandar a diferença para o cofre Viagem?', 'Sextas são seu dia de maior gasto com comida. Uma regra “guardar R$ 30 toda sexta” equilibraria isso.', 'Faltam R$ 4.650 para a barra Viagem Lisboa. No seu ritmo atual, ela fica completa em março.'];
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };

export default function Home() {
  const user = useAurea((s) => s.user); const balance = useAurea((s) => s.balance); const hide = useAurea((s) => s.hideBalance); const toggle = useAurea((s) => s.toggleHide);
  const vaults = useAurea((s) => s.vaults); const txs = useAurea((s) => s.transactions); const dismissed = useAurea((s) => s.dismissedAlerts); const dismiss = useAurea((s) => s.dismissAlert);
  const [sel, setSel] = useState<Transaction | null>(null); const router = useRouter();
  const live = useLiveYield(balance); const series = useMemo(() => yieldSeries(), []);
  const dup = useMemo(() => findDuplicate(txs), [txs]); const showDup = dup && !dismissed.includes(dup.id);
  const tip = TIPS[new Date().getDate() % TIPS.length]!;
  const nextBill = useSocial((s) => s.reminders.find((r) => !r.paid)); const activeAuto = useSocial((s) => s.automations.filter((a) => a.active).length);
  return (
    <Screen className="space-y-6 pt-[max(16px,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3 pt-2">
        <Link href="/perfil" aria-label="Perfil"><Avatar name={user.name} hue={user.hue} level={user.level} size={46} /></Link>
        <div className="flex-1"><p className="text-sm text-fg-soft">{greet()},</p><p className="font-serif text-2xl leading-tight">{user.firstName}</p></div>
        <Link href="/score" className="glass rounded-pill px-3 py-2 text-xs text-fg-gold">Nível Ouro</Link>
      </header>

      <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-fg-soft">Saldo total</p>
          <button onClick={toggle} aria-label={hide ? 'Mostrar saldo' : 'Ocultar saldo'} aria-pressed={hide} className="touch -mr-2 grid place-items-center rounded-full text-fg-soft hover:text-fg">{hide ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}</button>
        </div>
        <GoldNumber value={balance} hidden={hide} label="Saldo total" className="mt-1 text-[44px] leading-none" />
        <div className="mt-5 flex items-end justify-between gap-3 rounded-sm bg-black/25 p-3">
          <div>
            <p className="text-xs text-fg-soft">Rendimento estimado hoje*</p>
            <p className="mt-0.5 tabular text-lg text-success" aria-live="off">{hide ? '••••' : `+ ${live.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 4, maximumFractionDigits: 4 })}`}</p>
          </div>
          <Sparkline data={series} label="Rendimento dos últimos 14 dias, em alta" />
        </div>
        <p className="mt-2 text-[11px] text-fg-soft/80">*Simulação a 100% do CDI. Não é promessa de retorno.</p>
      </GlassPanel>

      <nav aria-label="Atalhos" className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {SHORTCUTS.map(({ href, label, I }) => (
          <Link key={href} href={href} className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-[12px] text-fg-soft hover:text-fg">
            <motion.span whileTap={{ scale: 0.92 }} className="glass grid h-14 w-14 place-items-center rounded-md text-gold-200"><I size={22} strokeWidth={1.5} aria-hidden /></motion.span>{label}
          </Link>
        ))}
      </nav>

      {showDup && dup && (
        <GlassPanel variant="gold" className="flex gap-3 p-4" role="alert">
          <AlertTriangle size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-200" aria-hidden />
          <div className="flex-1 text-sm"><p className="font-semibold">Duas cobranças iguais de {dup.title}</p><p className="mt-0.5 text-fg-soft">{formatBRL(dup.amount)} cobrado duas vezes no mesmo dia.</p>
            <div className="mt-3 flex gap-2"><button onClick={() => router.push('/ia?alerta=1')} className="touch rounded-pill bg-gold-200/15 px-4 text-fg-gold">Ver com a IA</button><button onClick={() => dismiss(dup.id)} className="touch px-3 text-fg-soft">Ignorar</button></div></div>
        </GlassPanel>
      )}

      <Link href="/assessor" className="block">
        <GlassPanel className="flex items-center gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-200"><BellRing size={20} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-[0.16em] text-fg-gold">Seu assessor · {activeAuto} automações ativas</p>
            <p className="truncate text-[15px]">{nextBill ? `${nextBill.title}${nextBill.amount ? ` · ${formatBRL(nextBill.amount)}` : ''} vence ${new Date(nextBill.due).toLocaleDateString('pt-BR')}` : 'Nenhuma conta pendente ✨'}</p></div>
          <ChevronRight size={18} className="text-fg-soft" aria-hidden />
        </GlassPanel>
      </Link>

      <section aria-labelledby="h-cofres">
        <div className="mb-3 flex items-center justify-between"><h2 id="h-cofres" className="font-serif text-xl">Cofres de ouro</h2><Link href="/cofres" className="touch flex items-center text-sm text-fg-gold">Ver todos <ChevronRight size={16} /></Link></div>
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
          {vaults.map((v) => (
            <Link key={v.id} href={`/cofres/detalhe?id=${v.id}`} className="snap-start">
              <GlassPanel className="w-[152px] p-3">
                <Ingot value={v.saved / v.goal} className="h-16 w-full" label={`${v.name}: ${Math.round((v.saved / v.goal) * 100)}%`} />
                <p className="mt-3 flex items-center gap-1.5 truncate text-sm"><span className="text-gold-200"><VaultIcon icon={v.icon} size={14} /></span>{v.name}</p>
                <p className="text-xs text-fg-soft tabular">{hide ? '••••' : formatBRL(v.saved)} · {Math.round((v.saved / v.goal) * 100)}%</p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-tx">
        <div className="mb-2 flex items-center justify-between"><h2 id="h-tx" className="font-serif text-xl">Últimas transações</h2><Link href="/extrato" className="touch flex items-center text-sm text-fg-gold">Extrato <ChevronRight size={16} /></Link></div>
        <GlassPanel className="p-1.5">{txs.slice(0, 5).map((t) => <TxRow key={t.id} tx={t} hidden={hide} onClick={() => setSel(t)} />)}</GlassPanel>
      </section>

      <Link href="/ia" className="block">
        <GlassPanel variant="gold" specular className="flex gap-3 p-4">
          <Sparkles size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-200" aria-hidden />
          <div><p className="text-xs uppercase tracking-[0.18em] text-fg-gold">Dica da Áurea IA</p><p className="mt-1 text-[15px] leading-relaxed">{tip}</p></div>
        </GlassPanel>
      </Link>
      <TxSheet tx={sel} onClose={() => setSel(null)} />
    </Screen>
  );
}
