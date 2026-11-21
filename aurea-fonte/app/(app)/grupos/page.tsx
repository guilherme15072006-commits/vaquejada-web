'use client';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, GlassButton, GlassPanel, GlassSheet, GoldButton, LiquidFill } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { memberHue, memberName } from '@/components/app/MemberName';
import { FRIENDS } from '@/lib/mock/friends';
import type { Group, GroupKind } from '@/lib/mock/groups';
import { useAurea } from '@/lib/store/aurea';
import { useSocial } from '@/lib/store/social';
import { cn } from '@/lib/utils/format';

const KINDS: { id: GroupKind; label: string; emoji: string; desc: string }[] = [
  { id: 'viagem', label: 'Viagem', emoji: '🏝️', desc: 'Barra coletiva para a viagem da galera.' },
  { id: 'meta', label: 'Meta juntos', emoji: '🎯', desc: 'Qualquer objetivo em grupo: festa, presente, show.' },
  { id: 'desafio', label: 'Desafio', emoji: '🏆', desc: 'Guardar toda semana. Quem quebrar a sequência leva cutucão.' },
  { id: 'casa', label: 'Casa', emoji: '🏠', desc: 'Contas da república ou da família divididas.' },
];
function subtitle(g: Group) {
  if (g.goal) return `${Math.round(((g.saved ?? 0) / g.goal) * 100)}% da barra`;
  if (g.challenge) return `Semana ${g.challenge.week} de ${g.challenge.weeks}`;
  if (g.bills) { const pend = g.bills.filter((b) => b.paidBy.length < g.members.length).length; return pend ? `${pend} conta(s) em aberto` : 'Tudo pago ✓'; }
  return '';
}

export default function Grupos() {
  const groups = useSocial((s) => s.groups); const create = useSocial((s) => s.createGroup); const me = useAurea((s) => s.user); const toast = useAurea((s) => s.toast); const router = useRouter();
  const [open, setOpen] = useState(false); const [kind, setKind] = useState<GroupKind>('viagem'); const [name, setName] = useState(''); const [sel, setSel] = useState<string[]>([]); const [goal, setGoal] = useState(''); const [err, setErr] = useState<string>();
  const k = KINDS.find((x) => x.id === kind)!;
  const submit = () => { const r = create({ name, emoji: k.emoji, kind, members: sel, goal: Number(goal.replace(/\./g, '').replace(',', '.')) || undefined }); if (!r.ok) return setErr(r.error); setOpen(false); toast({ title: 'Grupo criado', body: `Convite enviado para ${sel.length} amigo(s).`, tone: 'gold' }); router.push(`/grupos/detalhe?id=${r.id}`); };
  return (
    <Screen title="Grupos" back="/social" action={<button onClick={() => { setOpen(true); setErr(undefined); }} aria-label="Criar grupo" className="glass grid h-11 w-11 place-items-center rounded-full text-gold-200"><Plus size={22} strokeWidth={1.5} className="relative z-[1]" /></button>} className="space-y-4">
      <p className="-mt-2 text-sm text-fg-soft">Junte a galera para guardar, viajar, desafiar e dividir contas.</p>
      {groups.length === 0 && <GlassPanel className="p-6 text-center"><p className="font-serif text-xl">Nenhum grupo ainda</p><p className="mt-1 text-sm text-fg-soft">Crie o primeiro e chame os amigos.</p></GlassPanel>}
      <ul className="space-y-3">{groups.map((g) => (
        <li key={g.id}><Link href={`/grupos/detalhe?id=${g.id}`} className="block">
          <GlassPanel className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-white/5 text-2xl">{g.emoji}</span>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{g.name}</p><p className="text-xs text-fg-soft">{g.members.length} pessoas · {subtitle(g)}</p></div>
              <ChevronRight size={18} className="text-fg-soft" aria-hidden />
            </div>
            {g.goal != null && <LiquidFill value={(g.saved ?? 0) / g.goal} className="mt-3 h-3 w-full" rounded="rounded-pill" bubbles={false} wave={0.3} label={`${g.name}: ${subtitle(g)}`} />}
            <div className="mt-3 flex -space-x-2">{g.members.slice(0, 6).map((m) => <Avatar key={m} name={m === 'eu' ? me.name : FRIENDS.find((f) => f.id === m)?.name ?? m} hue={memberHue(m, me.hue)} size={28} />)}</div>
            {g.messages.length > 0 && <p className="mt-2 truncate text-xs text-fg-soft">💬 {g.messages[g.messages.length - 1]!.system ? '' : `${memberName(g.messages[g.messages.length - 1]!.author)}: `}{g.messages[g.messages.length - 1]!.text}</p>}
          </GlassPanel>
        </Link></li>
      ))}</ul>
      <GlassSheet open={open} onClose={() => setOpen(false)} title="Novo grupo">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">{KINDS.map((x) => <button key={x.id} onClick={() => setKind(x.id)} aria-pressed={kind === x.id} className={cn('glass rounded-md p-3 text-left', kind === x.id && 'glass-gold')}><span className="relative z-[1] block text-2xl">{x.emoji}</span><span className="relative z-[1] block text-sm font-semibold">{x.label}</span></button>)}</div>
          <p className="text-xs text-fg-soft">{k.desc}</p>
          <div><label htmlFor="gn" className="mb-1.5 block text-sm text-fg-soft">Nome do grupo</label><input id="gn" value={name} onChange={(e) => { setName(e.target.value); setErr(undefined); }} maxLength={30} placeholder="Ex.: Réveillon na praia" className="h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 outline-none focus:border-gold-300" /></div>
          {(kind === 'viagem' || kind === 'meta') && <div><label htmlFor="gg" className="mb-1.5 block text-sm text-fg-soft">Meta do grupo (R$)</label><input id="gg" inputMode="decimal" value={goal} onChange={(e) => setGoal(e.target.value.replace(/[^\d,]/g, ''))} className="h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 tabular outline-none focus:border-gold-300" /></div>}
          <fieldset><legend className="mb-2 text-sm text-fg-soft">Chamar amigos ({sel.length})</legend>
            <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">{FRIENDS.map((f) => <button key={f.id} onClick={() => setSel((s) => s.includes(f.id) ? s.filter((x) => x !== f.id) : [...s, f.id])} aria-pressed={sel.includes(f.id)} className={cn('flex w-14 shrink-0 flex-col items-center gap-1 text-xs', !sel.includes(f.id) && 'opacity-45')}><Avatar name={f.name} hue={f.hue} level={sel.includes(f.id) ? f.level : undefined} size={44} />{f.name.split(' ')[0]}</button>)}</div>
          </fieldset>
          {err && <p role="alert" className="text-sm text-danger">{err}</p>}
          <GoldButton block onClick={submit}>Criar e convidar</GoldButton>
          <GlassButton block size="sm" onClick={() => toast({ title: 'Link copiado', body: 'aurea.app/g/convite (simulado)', tone: 'gold' })}>Copiar link de convite</GlassButton>
        </div>
      </GlassSheet>
    </Screen>
  );
}
