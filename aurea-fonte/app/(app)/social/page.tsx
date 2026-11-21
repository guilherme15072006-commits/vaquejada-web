'use client';
import { ChevronRight, Globe, Lock, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useSocial } from '@/lib/store/social';
import { useState } from 'react';
import { Avatar, GlassButton, GlassPanel } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { friendById } from '@/lib/mock/friends';
import type { Privacy } from '@/lib/mock/types';
import { useAurea } from '@/lib/store/aurea';
import { cn } from '@/lib/utils/format';

const EMOJIS = ['🏆', '✨', '🔥', '💛', '👑'];
const PRIV: { id: Privacy; label: string; I: typeof Globe; desc: string }[] = [
  { id: 'publico', label: 'Público', I: Globe, desc: 'Qualquer pessoa na Áurea vê suas conquistas.' },
  { id: 'amigos', label: 'Amigos', I: Users, desc: 'Só seus amigos veem suas conquistas.' },
  { id: 'so-eu', label: 'Só eu', I: Lock, desc: 'Nada é compartilhado no feed.' },
];
const ago = (iso: string) => { const h = Math.round((Date.now() - +new Date(iso)) / 3600000); return h < 1 ? 'agora' : h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} d`; };

export default function Social() {
  const feed = useAurea((s) => s.feed); const react = useAurea((s) => s.react); const comment = useAurea((s) => s.comment); const privacy = useAurea((s) => s.privacy); const setPrivacy = useAurea((s) => s.setPrivacy);
  const [open, setOpen] = useState<string | null>(null); const [draft, setDraft] = useState('');
  const cur = PRIV.find((p) => p.id === privacy)!; const groups = useSocial((s) => s.groups);
  return (
    <Screen title="Social" className="space-y-4">
      <Link href="/grupos" className="block"><GlassPanel variant="gold" specular className="flex items-center gap-3 p-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400/20 text-gold-100"><Users size={20} strokeWidth={1.5} /></span>
        <div className="flex-1"><p className="font-semibold">Seus grupos</p><p className="text-sm text-fg-soft">{groups.length} grupos · {groups.map((g) => g.emoji).join(' ')} · viagens, desafios e contas da casa</p></div><ChevronRight size={18} className="text-fg-soft" />
      </GlassPanel></Link>
      <GlassPanel className="p-4">
        <p className="mb-2 text-sm text-fg-soft">Quem vê suas conquistas</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Privacidade do feed">{PRIV.map(({ id, label, I }) => <GlassButton key={id} size="sm" role="radio" aria-checked={privacy === id} active={privacy === id} onClick={() => setPrivacy(id)}><I size={14} strokeWidth={1.5} />{label}</GlassButton>)}</div>
        <p className="mt-2 text-xs text-fg-soft">{cur.desc} Valores nunca aparecem — só conquistas.</p>
      </GlassPanel>
      <ul className="space-y-3">
        {feed.map((e) => { const f = friendById(e.friendId); if (!f) return null; const isOpen = open === e.id; return (
          <li key={e.id}>
            <GlassPanel className="p-4">
              <div className="flex gap-3">
                <Avatar name={f.name} hue={f.hue} level={f.level} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-snug"><b className="font-semibold">{f.name.split(' ')[0]}</b> {e.text}</p>
                  <p className="mt-0.5 text-xs text-fg-soft">{ago(e.date)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {EMOJIS.map((em) => { const n = e.reactions[em] ?? 0; const mine = e.mine?.includes(em); return (
                  <button key={em} onClick={() => react(e.id, em)} aria-pressed={!!mine} aria-label={`Reagir com ${em}${n ? `, ${n} reações` : ''}`} className={cn('flex h-11 min-w-11 items-center justify-center gap-1 rounded-pill border px-2.5 text-sm transition-colors', mine ? 'border-gold-300/70 bg-gold-400/20' : 'border-white/10 bg-white/[0.03]', !n && !mine && 'opacity-60')}>
                    <span className="drop-shadow-[0_0_6px_rgba(245,215,122,.6)]">{em}</span>{n > 0 && <span className="tabular text-xs">{n}</span>}
                  </button>
                ); })}
                <button onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen} className="ml-auto flex h-11 items-center gap-1 px-2 text-sm text-fg-soft"><MessageCircle size={16} strokeWidth={1.5} /> {e.comments.length}</button>
              </div>
              {isOpen && (
                <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                  {e.comments.map((c) => <p key={c.id} className="text-sm"><b className="font-semibold">{c.author}</b> <span className="text-fg-soft">{c.text}</span></p>)}
                  <form onSubmit={(ev) => { ev.preventDefault(); comment(e.id, draft); setDraft(''); }} className="flex gap-2">
                    <input aria-label="Comentar" value={draft} onChange={(ev) => setDraft(ev.target.value)} maxLength={140} placeholder="Comentário curto…" className="h-11 flex-1 rounded-pill border border-[var(--glass-border)] bg-black/30 px-4 text-sm outline-none focus:border-gold-300" />
                    <GlassButton size="sm" type="submit" disabled={!draft.trim()}>Enviar</GlassButton>
                  </form>
                </div>
              )}
            </GlassPanel>
          </li>
        ); })}
      </ul>
    </Screen>
  );
}
