'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, Briefcase, CalendarClock, Check, MessageCircle, Play, Plus, Receipt, Send, User, Workflow, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GlassButton, GlassPanel, GlassSheet, GoldButton, GoldNumber, LiquidFill } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { QrMock } from '@/components/app/QrMock';
import { AUTOMATION_TEMPLATES, type AutoScope } from '@/lib/mock/assessor';
import { useAurea } from '@/lib/store/aurea';
import { useSocial } from '@/lib/store/social';
import { cn, formatBRL } from '@/lib/utils/format';

const TRIGGER_LABEL = { salario: 'Quando o salário cai', venda: 'Quando entra uma venda', semanal: 'Toda semana', vencimento: 'Antes do vencimento', 'gasto-alto': 'Quando gastar demais', mensal: 'Todo mês' } as const;
const dueLabel = (iso: string) => { const d = Math.round((+new Date(iso) - Date.now()) / 86400000); return d < 0 ? `venceu há ${-d} d` : d === 0 ? 'vence hoje' : d === 1 ? 'vence amanhã' : `em ${d} dias`; };
const parse = (s: string) => Number(s.replace(/\./g, '').replace(',', '.')) || 0;

function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} onClick={onChange} className="grid h-11 w-14 shrink-0 place-items-center"><span className={cn('relative h-7 w-12 rounded-pill transition-colors', on ? 'bg-gold-metal' : 'bg-white/15')}><span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-6' : 'left-1')} /></span></button>;
}

function WhatsappCard() {
  const linked = useSocial((s) => s.whatsappLinked); const link = useSocial((s) => s.linkWhatsapp); const toast = useAurea((s) => s.toast);
  const [open, setOpen] = useState(false); const [step, setStep] = useState(0);
  return (
    <GlassPanel variant="gold" specular className="p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#7FE0A8]"><MessageCircle size={22} strokeWidth={1.5} /></span>
        <div className="flex-1">
          <p className="font-semibold">Áurea no WhatsApp</p>
          <p className="text-sm text-fg-soft">{linked ? 'Conectado · +55 11 9••••-2290' : 'Registre gastos, crie lembretes e cobre clientes mandando mensagem.'}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {linked ? <Link href="/assessor/whatsapp" className="flex-1"><GoldButton block><MessageCircle size={18} strokeWidth={1.5} /> Abrir conversa</GoldButton></Link>
          : <GoldButton block onClick={() => { setOpen(true); setStep(0); }}>Conectar WhatsApp</GoldButton>}
      </div>
      <GlassSheet open={open} onClose={() => setOpen(false)} title="Conectar WhatsApp">
        {step === 0 ? (<>
          <ol className="space-y-2 text-sm text-fg-soft"><li>1. Abra a câmera do celular</li><li>2. Aponte para o código abaixo</li><li>3. Envie a mensagem “Oi Áurea” que vai aparecer</li></ol>
          <div className="my-5 grid place-items-center"><div className="rounded-md bg-ink-800 p-4"><QrMock seed={99} size={170} /></div></div>
          <GoldButton block onClick={() => { setStep(1); setTimeout(() => { link(); toast({ title: 'WhatsApp conectado', body: 'Mande “oi” para a Áurea.', tone: 'success' }); setOpen(false); }, 1600); }}>Já enviei a mensagem</GoldButton>
          <p className="mt-3 text-center text-[11px] text-fg-soft">Simulação — nenhuma conta de WhatsApp é acessada.</p>
        </>) : <div className="grid place-items-center gap-3 py-10" role="status"><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="h-10 w-10 rounded-full border-2 border-gold-200/30 border-t-gold-200" /><p className="text-fg-soft">Confirmando seu número…</p></div>}
      </GlassSheet>
    </GlassPanel>
  );
}

function Automations({ scope }: { scope: AutoScope }) {
  const list = useSocial((s) => s.automations.filter((a) => a.scope === scope)); const toggle = useSocial((s) => s.toggleAutomation); const run = useSocial((s) => s.runAutomation); const add = useSocial((s) => s.addAutomation); const toast = useAurea((s) => s.toast);
  const [open, setOpen] = useState(false); const [ran, setRan] = useState<string | null>(null);
  const active = list.filter((a) => a.active).length; const moved = list.reduce((s, a) => s + a.moved, 0);
  return (
    <section aria-labelledby="h-auto" className="space-y-3">
      <div className="flex items-center justify-between"><h2 id="h-auto" className="flex items-center gap-2 font-serif text-xl"><Workflow size={18} className="text-gold-200" aria-hidden /> Automações</h2><GlassButton size="sm" onClick={() => setOpen(true)}><Plus size={16} /> Nova</GlassButton></div>
      <p className="text-sm text-fg-soft">{active} ativas · já movimentaram <span className="tabular text-fg-gold">{formatBRL(moved)}</span> por você</p>
      <ul className="space-y-2">
        {list.map((a) => (
          <li key={a.id}>
            <GlassPanel className={cn('p-4 transition-opacity', !a.active && 'opacity-60')}>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-fg-gold">{TRIGGER_LABEL[a.trigger]}</p>
                  <p className="mt-0.5 font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-sm text-fg-soft">{a.detail}</p>
                </div>
                <Switch on={a.active} onChange={() => toggle(a.id)} label={`${a.active ? 'Desligar' : 'Ligar'} ${a.title}`} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-fg-soft">
                <span className="tabular">{a.runs} execuções{a.lastRun ? ` · última ${new Date(a.lastRun).toLocaleDateString('pt-BR')}` : ''}</span>
                <button disabled={!a.active} onClick={() => { const m = run(a.id); setRan(a.id); toast({ title: 'Automação executada', body: m, tone: 'gold' }); setTimeout(() => setRan(null), 1400); }} className="touch flex items-center gap-1 rounded-pill px-3 text-fg-gold disabled:opacity-40">
                  {ran === a.id ? <><Check size={14} /> Feito</> : <><Play size={14} /> Rodar agora</>}
                </button>
              </div>
            </GlassPanel>
          </li>
        ))}
      </ul>
      <GlassSheet open={open} onClose={() => setOpen(false)} title="Nova automação">
        <p className="mb-3 text-sm text-fg-soft">Escolha um modelo. Você pode desligar quando quiser.</p>
        <ul className="space-y-2">{AUTOMATION_TEMPLATES.filter((t) => t.scope === scope).map((t) => (
          <li key={t.title}><button onClick={() => { add(t); setOpen(false); toast({ title: 'Automação criada', body: t.title, tone: 'gold' }); }} className="glass w-full rounded-md p-4 text-left"><span className="relative z-[1] block"><span className="text-[11px] uppercase tracking-[0.14em] text-fg-gold">{TRIGGER_LABEL[t.trigger]}</span><span className="mt-0.5 block font-semibold">{t.title}</span><span className="block text-sm text-fg-soft">{t.detail}</span></span></button></li>
        ))}</ul>
        <p className="mt-4 text-center text-xs text-fg-soft">Ou peça no chat: “guarda 50 toda sexta”.</p>
      </GlassSheet>
    </section>
  );
}

function Reminders({ scope }: { scope: AutoScope }) {
  const all = useSocial((s) => s.reminders); const pay = useSocial((s) => s.payReminder); const add = useSocial((s) => s.addReminder); const toast = useAurea((s) => s.toast);
  const list = all.filter((r) => r.scope === scope && !r.paid);
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [amount, setAmount] = useState(''); const [day, setDay] = useState('10'); const [err, setErr] = useState<string>();
  const save = () => { const due = new Date(); const d = Math.min(28, Math.max(1, Number(day) || 1)); if (d < due.getDate()) due.setMonth(due.getMonth() + 1); due.setDate(d); const r = add({ title, amount: parse(amount) || undefined, due: due.toISOString(), scope, recurring: true }); if (!r.ok) return setErr(r.error); setOpen(false); setTitle(''); setAmount(''); toast({ title: 'Lembrete criado', body: `Aviso 2 dias antes do dia ${d}.`, tone: 'gold' }); };
  const field = 'h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 outline-none focus:border-gold-300';
  return (
    <section aria-labelledby="h-rem" className="space-y-3">
      <div className="flex items-center justify-between"><h2 id="h-rem" className="flex items-center gap-2 font-serif text-xl"><CalendarClock size={18} className="text-gold-200" aria-hidden /> Próximas contas</h2><GlassButton size="sm" onClick={() => setOpen(true)}><Plus size={16} /> Lembrete</GlassButton></div>
      <GlassPanel className="divide-y divide-white/5 px-4">
        {list.length === 0 && <p className="py-4 text-sm text-fg-soft">Tudo em dia. Nenhuma conta pendente. ✨</p>}
        <AnimatePresence initial={false}>
          {list.map((r) => { const late = +new Date(r.due) < Date.now(); return (
            <motion.div key={r.id} layout exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 py-3">
              <BellRing size={18} strokeWidth={1.5} className={late ? 'text-danger' : 'text-gold-200'} aria-hidden />
              <div className="min-w-0 flex-1"><p className="truncate">{r.title}</p><p className={cn('text-xs', late ? 'text-danger' : 'text-fg-soft')}>{dueLabel(r.due)}{r.recurring ? ' · todo mês' : ''}</p></div>
              {r.amount != null && <span className="tabular text-sm">{formatBRL(r.amount)}</span>}
              <button onClick={() => { const x = pay(r.id); toast(x.ok ? { title: r.amount ? 'Conta paga' : 'Marcado como feito', body: r.title, tone: 'success' } : { title: x.error, tone: 'danger' }); }} className="touch rounded-pill bg-gold-200/15 px-3 text-sm text-fg-gold">{r.amount ? 'Pagar' : 'Feito'}</button>
            </motion.div>
          ); })}
        </AnimatePresence>
      </GlassPanel>
      <GlassSheet open={open} onClose={() => setOpen(false)} title="Novo lembrete">
        <div className="space-y-4">
          <div><label htmlFor="rt" className="mb-1.5 block text-sm text-fg-soft">O quê</label><input id="rt" value={title} onChange={(e) => { setTitle(e.target.value); setErr(undefined); }} placeholder="Ex.: Aluguel" className={field} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="ra" className="mb-1.5 block text-sm text-fg-soft">Valor (opcional)</label><input id="ra" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ''))} className={cn(field, 'tabular')} /></div>
            <div><label htmlFor="rd" className="mb-1.5 block text-sm text-fg-soft">Todo dia</label><input id="rd" inputMode="numeric" value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))} className={cn(field, 'tabular')} /></div>
          </div>
          {err && <p role="alert" className="text-sm text-danger">{err}</p>}
          <GoldButton block onClick={save}>Criar lembrete</GoldButton>
        </div>
      </GlassSheet>
    </section>
  );
}

function Business() {
  const b = useSocial((s) => s.business); const charges = useSocial((s) => s.charges); const nudge = useSocial((s) => s.nudgeCharge); const paid = useSocial((s) => s.markChargePaid); const addCharge = useSocial((s) => s.addCharge); const pushWa = useSocial((s) => s.pushWa); const toast = useAurea((s) => s.toast);
  const [open, setOpen] = useState(false); const [client, setClient] = useState(''); const [amount, setAmount] = useState(''); const [days, setDays] = useState(7); const [err, setErr] = useState<string>();
  const receivable = charges.filter((c) => c.status !== 'paga').reduce((s, c) => s + c.amount, 0);
  const dasYear = 75.9 * 12; const taxPct = Math.min(1, b.taxVault / dasYear);
  const status = (c: { status: string; due: string }) => c.status === 'paga' ? 'paga' : +new Date(c.due) < Date.now() ? 'atrasada' : 'aberta';
  const field = 'h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 outline-none focus:border-gold-300';
  return (<>
    <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
      <p className="flex items-center gap-2 text-sm text-fg-soft"><Briefcase size={14} aria-hidden /> {b.name} · CNPJ {b.cnpj}</p>
      <GoldNumber value={b.balance} label="Saldo do negócio" className="mt-1 text-4xl" />
      <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-white/5 text-sm">
        <div className="bg-ink-900/60 p-3"><dt className="text-[11px] text-fg-soft">Entradas no mês</dt><dd className="tabular text-success">{formatBRL(b.monthIn)}</dd></div>
        <div className="bg-ink-900/60 p-3"><dt className="text-[11px] text-fg-soft">Saídas no mês</dt><dd className="tabular">{formatBRL(b.monthOut)}</dd></div>
        <div className="bg-ink-900/60 p-3"><dt className="text-[11px] text-fg-soft">A receber</dt><dd className="tabular text-fg-gold">{formatBRL(receivable)}</dd></div>
      </dl>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs"><span className="text-fg-soft">Cofre de impostos (DAS do ano)</span><span className="tabular text-fg-gold">{formatBRL(b.taxVault)} / {formatBRL(dasYear)}</span></div>
        <LiquidFill value={taxPct} className="h-4 w-full" rounded="rounded-pill" bubbles={false} wave={0.4} label={`Cofre de impostos ${Math.round(taxPct * 100)}%`} />
      </div>
    </GlassPanel>
    <section aria-labelledby="h-ch" className="space-y-3">
      <div className="flex items-center justify-between"><h2 id="h-ch" className="flex items-center gap-2 font-serif text-xl"><Receipt size={18} className="text-gold-200" aria-hidden /> Cobranças</h2><GlassButton size="sm" onClick={() => setOpen(true)}><Plus size={16} /> Cobrar</GlassButton></div>
      <GlassPanel className="divide-y divide-white/5 px-4">
        {charges.map((c) => { const st = status(c); return (
          <div key={c.id} className="py-3">
            <div className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate">{c.client}</p><p className={cn('text-xs', st === 'atrasada' ? 'text-danger' : st === 'paga' ? 'text-success' : 'text-fg-soft')}>{st === 'paga' ? 'Paga ✓' : `${st === 'atrasada' ? 'Atrasada' : 'Vence'} ${new Date(c.due).toLocaleDateString('pt-BR')}`}{c.remindersSent ? ` · ${c.remindersSent} lembrete(s) enviados` : ''}</p></div><span className="tabular">{formatBRL(c.amount)}</span></div>
            {st !== 'paga' && <div className="mt-2 flex gap-2">
              <button onClick={() => { nudge(c.id); pushWa({ from: 'aurea', text: `📤 Enviei para ${c.client}: “Olá! Passando para lembrar da cobrança de ${formatBRL(c.amount)}. Pix: doces-da-marina@aurea. Obrigada!”` }); toast({ title: 'Lembrete enviado no WhatsApp', body: c.client, tone: 'gold' }); }} className="touch flex items-center gap-1 rounded-pill bg-gold-200/15 px-3 text-sm text-fg-gold"><Send size={14} /> Cobrar no WhatsApp</button>
              <button onClick={() => { paid(c.id); toast({ title: 'Recebido!', body: `${formatBRL(c.amount)} · 6% já foi para o cofre de impostos.`, tone: 'success' }); }} className="touch px-3 text-sm text-fg-soft">Marcar paga</button>
            </div>}
          </div>
        ); })}
      </GlassPanel>
    </section>
    <GlassSheet open={open} onClose={() => setOpen(false)} title="Nova cobrança">
      <div className="space-y-4">
        <div><label htmlFor="cc" className="mb-1.5 block text-sm text-fg-soft">Cliente</label><input id="cc" value={client} onChange={(e) => { setClient(e.target.value); setErr(undefined); }} className={field} /></div>
        <div><label htmlFor="cv" className="mb-1.5 block text-sm text-fg-soft">Valor (R$)</label><input id="cv" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d,]/g, ''))} className={cn(field, 'tabular')} /></div>
        <div className="flex gap-2">{[3, 7, 15, 30].map((d) => <GlassButton key={d} size="sm" active={days === d} onClick={() => setDays(d)}>{d} dias</GlassButton>)}</div>
        <p className="text-xs text-fg-soft">O assessor manda link Pix e lembra o cliente 1, 3 e 7 dias após o vencimento.</p>
        {err && <p role="alert" className="text-sm text-danger">{err}</p>}
        <GoldButton block onClick={() => { const r = addCharge({ client, amount: parse(amount), days }); if (!r.ok) return setErr(r.error); setOpen(false); setClient(''); setAmount(''); toast({ title: 'Cobrança criada', tone: 'gold' }); }}>Criar cobrança</GoldButton>
      </div>
    </GlassSheet>
  </>);
}

export default function Assessor() {
  const scope = useSocial((s) => s.scope); const setScope = useSocial((s) => s.setScope);
  return (
    <Screen title="Assessor" back className="space-y-5">
      <p className="-mt-2 text-sm text-fg-soft">Sua Áurea trabalhando sozinha: guarda, lembra, cobra e resume — na vida pessoal e no seu negócio.</p>
      <div role="tablist" aria-label="Escopo" className="glass flex rounded-pill p-1">
        {([['pessoal', 'Pessoal', User], ['negocio', 'Meu negócio', Briefcase]] as const).map(([id, label, I]) => (
          <button key={id} role="tab" aria-selected={scope === id} onClick={() => setScope(id)} className={cn('relative z-[1] flex h-11 flex-1 items-center justify-center gap-2 rounded-pill text-sm', scope === id ? 'text-[#2A1F05]' : 'text-fg-soft')}>
            {scope === id && <motion.span layoutId="scope-tab" className="absolute inset-0 -z-[1] rounded-pill bg-gold-metal" />}<I size={16} strokeWidth={1.5} />{label}
          </button>
        ))}
      </div>
      <WhatsappCard />
      {scope === 'negocio' && <Business />}
      <Reminders scope={scope} />
      <Automations scope={scope} />
      <GlassPanel className="flex gap-3 p-4 text-sm"><Zap size={18} className="mt-0.5 shrink-0 text-gold-200" aria-hidden /><p className="text-fg-soft">Toda automação que mexe em dinheiro pede confirmação na primeira vez e pode ser desligada a qualquer momento. Simulação — nada é movimentado de verdade.</p></GlassPanel>
    </Screen>
  );
}
