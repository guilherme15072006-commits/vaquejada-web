'use client';
import { motion } from 'framer-motion';
import { Flame, Hand, Send, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Avatar, GlassButton, GlassPanel, GlassSheet, GoldButton, Ingot } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { AmountDisplay, AmountPad } from '@/components/app/AmountPad';
import { CompleteSeal, GoldBurst } from '@/components/app/GoldBurst';
import { memberHue, memberName } from '@/components/app/MemberName';
import { FRIENDS } from '@/lib/mock/friends';
import type { Group } from '@/lib/mock/groups';
import { useAurea } from '@/lib/store/aurea';
import { useSocial } from '@/lib/store/social';
import { cn, formatBRL, formatTime } from '@/lib/utils/format';

const STICKERS = ['🔥', '🏆', '✨', '💛', '🪙', '🎉'];
const fullName = (id: string, me: string) => id === 'eu' ? me : FRIENDS.find((f) => f.id === id)?.name ?? id;

function GoalPanel({ g }: { g: Group }) {
  const contribute = useSocial((s) => s.contributeGroup); const toast = useAurea((s) => s.toast); const balance = useAurea((s) => s.balance); const me = useAurea((s) => s.user);
  const [open, setOpen] = useState(false); const [cents, setCents] = useState(0); const [err, setErr] = useState<string>();
  const p = (g.saved ?? 0) / (g.goal ?? 1); const full = p >= 1; const share = (g.goal ?? 0) / g.members.length;
  const ranking = Object.entries(g.contributions ?? {}).sort((a, b) => b[1] - a[1]);
  return (<>
    <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
      <div className="relative"><Ingot value={p} className="h-32 w-full" label={`Barra do grupo ${Math.round(p * 100)}%`}><div className="grid h-full place-items-center">{full ? <CompleteSeal /> : <span className={cn('font-serif text-5xl tabular', p > 0.5 && 'text-[#2A1F05]')}>{Math.round(p * 100)}%</span>}</div></Ingot>{full && <GoldBurst count={24} />}</div>
      <p className="mt-3 text-center text-sm text-fg-soft">Meta do grupo <span className="tabular text-fg">{formatBRL(g.goal ?? 0)}</span> · cota sugerida <span className="tabular text-fg-gold">{formatBRL(share)}</span> por pessoa</p>
      <GoldButton block className="mt-4" onClick={() => { setOpen(true); setCents(0); setErr(undefined); }}>Guardar na barra do grupo</GoldButton>
    </GlassPanel>
    <section aria-labelledby="h-cota"><h2 id="h-cota" className="mb-2 font-serif text-xl">Quem já guardou</h2>
      <GlassPanel className="space-y-3 p-4">
        {ranking.map(([id, v]) => { const pct = Math.min(1, v / share); return (
          <div key={id} className="flex items-center gap-3">
            <Avatar name={fullName(id, me.name)} hue={memberHue(id, me.hue)} size={34} />
            <div className="flex-1"><div className="flex justify-between text-sm"><span>{memberName(id)}</span><span className="tabular text-fg-soft">{id === 'eu' ? formatBRL(v) : `${Math.round(pct * 100)}% da cota`}</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-pill bg-white/10"><motion.div className="h-full rounded-pill bg-gold-metal" initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }} /></div></div>
          </div>
        ); })}
        <p className="text-[11px] text-fg-soft">Você vê só o seu valor; dos amigos, apenas o quanto da cota já cumpriram.</p>
      </GlassPanel>
    </section>
    <GlassSheet open={open} onClose={() => setOpen(false)} title="Guardar no grupo">
      <AmountDisplay cents={cents} error={err} hint={`Disponível ${formatBRL(balance)}`} />
      <div className="mb-3 flex justify-center gap-2">{[50, 100].map((q) => <GlassButton key={q} size="sm" onClick={() => setCents(q * 100)}>R$ {q}</GlassButton>)}<GlassButton size="sm" onClick={() => setCents(Math.round(share * 100))}>Minha cota</GlassButton></div>
      <AmountPad cents={cents} onChange={(c) => { setCents(c); setErr(undefined); }} />
      <GoldButton block size="lg" className="mt-4" disabled={!cents} onClick={() => { const r = contribute(g.id, cents / 100); if (!r.ok) return setErr(r.error); setOpen(false); toast({ title: 'Guardado no grupo', body: g.name, tone: 'gold' }); }}>Confirmar</GoldButton>
    </GlassSheet>
  </>);
}

function ChallengePanel({ g }: { g: Group }) {
  const check = useSocial((s) => s.checkInChallenge); const nudge = useSocial((s) => s.nudgeGroup); const toast = useAurea((s) => s.toast); const me = useAurea((s) => s.user);
  const c = g.challenge!; const board = Object.entries(c.streaks).sort((a, b) => b[1] - a[1]); const done = (c.streaks.eu ?? 0) >= c.week;
  return (<>
    <GlassPanel variant="strong" refraction specular radius="lg" className="p-5 text-center">
      <p className="text-sm text-fg-soft">{c.title}</p>
      <p className="mt-1 font-serif text-5xl tabular text-gold-metal">Semana {c.week}<span className="text-2xl text-fg-soft">/{c.weeks}</span></p>
      <div className="mx-auto mt-3 flex max-w-[280px] flex-wrap justify-center gap-1" aria-label={`Sua sequência: ${c.streaks.eu ?? 0} semanas`}>{Array.from({ length: Math.min(c.week, 26) }, (_, i) => <span key={i} className={cn('h-2.5 w-2.5 rounded-full', i < (c.streaks.eu ?? 0) ? 'bg-gold-300 shadow-[0_0_6px_rgba(245,215,122,.7)]' : 'bg-white/10')} />)}</div>
      <GoldButton block className="mt-4" disabled={done} onClick={() => { const r = check(g.id); toast(r.ok ? { title: `Semana ${c.week} ✅`, body: 'R$ 50 guardados. Sequência mantida!', tone: 'gold' } : { title: r.error, tone: 'danger' }); }}>{done ? 'Semana garantida ✓' : 'Guardar R$ 50 desta semana'}</GoldButton>
    </GlassPanel>
    <section aria-labelledby="h-rank"><h2 id="h-rank" className="mb-2 font-serif text-xl">Ranking de sequência</h2>
      <GlassPanel className="divide-y divide-white/5 px-4">{board.map(([id, s], i) => { const broke = s < c.week - 1; return (
        <div key={id} className="flex items-center gap-3 py-3">
          <span className={cn('w-5 text-center font-serif text-lg tabular', i < 3 ? 'text-gold-200' : 'text-fg-soft')}>{i + 1}</span>
          <Avatar name={fullName(id, me.name)} hue={memberHue(id, me.hue)} size={36} />
          <span className="flex-1">{memberName(id)}</span>
          <span className="flex items-center gap-1 tabular text-sm"><Flame size={14} className={broke ? 'text-fg-soft' : 'text-gold-200'} aria-hidden />{s}</span>
          {broke && id !== 'eu' && <button onClick={() => { nudge(g.id, memberName(id)); toast({ title: `Cutucão enviado para ${memberName(id)}`, tone: 'gold' }); }} aria-label={`Cutucar ${memberName(id)}`} className="touch grid place-items-center rounded-full text-fg-gold"><Hand size={18} strokeWidth={1.5} /></button>}
        </div>
      ); })}</GlassPanel>
      <p className="mt-2 text-[11px] text-fg-soft">O ranking mostra só sequências, nunca valores.</p>
    </section>
  </>);
}

function HousePanel({ g }: { g: Group }) {
  const pay = useSocial((s) => s.payBill); const toast = useAurea((s) => s.toast); const me = useAurea((s) => s.user);
  const share = (v: number) => v / g.members.length;
  const mine = (g.bills ?? []).filter((b) => !b.paidBy.includes('eu')).reduce((s, b) => s + share(b.amount), 0);
  return (<>
    <GlassPanel variant="strong" refraction specular radius="lg" className="p-5">
      <p className="text-sm text-fg-soft">Sua parte pendente</p>
      <p className="font-serif text-4xl tabular text-gold-metal">{formatBRL(mine)}</p>
      <p className="mt-1 text-xs text-fg-soft">Dividido igualmente entre {g.members.length} pessoas</p>
    </GlassPanel>
    <section aria-labelledby="h-bills"><h2 id="h-bills" className="mb-2 font-serif text-xl">Contas da casa</h2>
      <GlassPanel className="divide-y divide-white/5 px-4">{(g.bills ?? []).length === 0 && <p className="py-4 text-sm text-fg-soft">Nenhuma conta ainda.</p>}
        {(g.bills ?? []).map((b) => { const paid = b.paidBy.includes('eu'); return (
          <div key={b.id} className="py-3">
            <div className="flex items-center gap-3"><div className="flex-1"><p>{b.title}</p><p className="text-xs text-fg-soft">{formatBRL(b.amount)} · {formatBRL(share(b.amount))} cada</p></div>
              {paid ? <span className="text-sm text-success">Pago ✓</span> : <button onClick={() => { const r = pay(g.id, b.id); toast(r.ok ? { title: 'Sua parte foi paga', body: b.title, tone: 'success' } : { title: r.error, tone: 'danger' }); }} className="touch rounded-pill bg-gold-200/15 px-4 text-sm text-fg-gold">Pagar parte</button>}</div>
            <div className="mt-2 flex gap-1.5">{g.members.map((m) => <span key={m} title={memberName(m)} className={cn('rounded-full ring-2', b.paidBy.includes(m) ? 'ring-success' : 'ring-transparent opacity-50')}><Avatar name={fullName(m, me.name)} hue={memberHue(m, me.hue)} size={24} /></span>)}</div>
          </div>
        ); })}</GlassPanel>
    </section>
  </>);
}

function Chat({ g }: { g: Group }) {
  const send = useSocial((s) => s.sendGroupMsg); const me = useAurea((s) => s.user); const [t, setT] = useState(''); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [g.messages.length]);
  return (
    <section aria-labelledby="h-chat"><h2 id="h-chat" className="mb-2 font-serif text-xl">Conversa</h2>
      <GlassPanel className="p-3">
        <ol className="max-h-80 space-y-2 overflow-y-auto pr-1" aria-live="polite">{g.messages.map((m) => m.system ? (
          <li key={m.id} className="mx-auto w-fit max-w-[90%] rounded-pill bg-gold-400/10 px-3 py-1 text-center text-xs text-fg-gold">{m.text}</li>
        ) : (
          <li key={m.id} className={cn('flex gap-2', m.author === 'eu' && 'flex-row-reverse')}>
            {m.author !== 'eu' && <Avatar name={fullName(m.author, me.name)} hue={memberHue(m.author, me.hue)} size={28} />}
            <div className={cn('max-w-[78%] rounded-[16px] px-3 py-2 text-sm', m.author === 'eu' ? 'bg-[#3A2F12] text-gold-100' : 'bg-ink-700')}>
              {m.author !== 'eu' && <p className="text-[11px] text-fg-gold">{memberName(m.author)}</p>}
              {m.sticker && <p className="text-3xl">{m.sticker}</p>}{m.text && <p>{m.text}</p>}
              <p className="mt-0.5 text-right text-[10px] text-fg-soft">{formatTime(m.date)}</p>
            </div>
          </li>
        ))}<div ref={end} /></ol>
        <div className="mt-3 flex gap-1">{STICKERS.map((s) => <button key={s} onClick={() => send(g.id, '', s)} aria-label={`Enviar figurinha ${s}`} className="grid h-11 w-11 place-items-center rounded-sm text-xl hover:bg-white/5">{s}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); send(g.id, t); setT(''); }} className="mt-2 flex gap-2">
          <label htmlFor="gm" className="sr-only">Mensagem para o grupo</label>
          <input id="gm" value={t} onChange={(e) => setT(e.target.value)} maxLength={280} placeholder="Mensagem para a galera" className="h-11 flex-1 rounded-pill border border-[var(--glass-border)] bg-black/30 px-4 text-sm outline-none focus:border-gold-300" />
          <button type="submit" disabled={!t.trim()} aria-label="Enviar" className="grid h-11 w-11 place-items-center rounded-full bg-gold-metal text-[#2A1F05] disabled:opacity-40"><Send size={16} /></button>
        </form>
      </GlassPanel>
    </section>
  );
}

function Detail() {
  const id = useSearchParams()?.get('id') ?? ''; const g = useSocial((s) => s.groups.find((x) => x.id === id)); const me = useAurea((s) => s.user);
  if (!g) return <Screen title="Grupo" back="/grupos"><GlassPanel className="p-6 text-center">Grupo não encontrado. <Link href="/grupos" className="text-fg-gold">Ver grupos</Link></GlassPanel></Screen>;
  return (
    <Screen title={`${g.emoji} ${g.name}`} back="/grupos" className="space-y-5">
      <div className="-mt-1 flex items-center gap-2"><div className="flex -space-x-2">{g.members.map((m) => <Avatar key={m} name={fullName(m, me.name)} hue={memberHue(m, me.hue)} size={30} />)}</div><span className="flex items-center gap-1 text-sm text-fg-soft"><Users size={14} aria-hidden /> {g.members.length}</span></div>
      {g.goal != null && <GoalPanel g={g} />}
      {g.challenge && <ChallengePanel g={g} />}
      {g.bills && <HousePanel g={g} />}
      <Chat g={g} />
    </Screen>
  );
}
export default function Page() { return <Suspense><Detail /></Suspense>; }
