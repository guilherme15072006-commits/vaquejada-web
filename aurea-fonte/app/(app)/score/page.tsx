'use client';
import { Check, Lock } from 'lucide-react';
import { useId } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel, LiquidFill } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { LEVELS, levelOf, MISSIONS, nextLevel } from '@/lib/mock/user';
import { useAurea } from '@/lib/store/aurea';
import { cn } from '@/lib/utils/format';

function Medallion({ color, fill, size = 150, label }: { color: [string, string, string]; fill: number; size?: number; label: string }) {
  const id = useId().replace(/:/g, ''); const y = 100 - fill * 84 - 8;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`m-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={color[0]} /><stop offset=".5" stopColor={color[1]} /><stop offset="1" stopColor={color[2]} /></linearGradient>
        <clipPath id={`c-${id}`}><path d="M50 4 L88 26 V74 L50 96 L12 74 V26 Z" /></clipPath>
      </defs>
      <path d="M50 4 L88 26 V74 L50 96 L12 74 V26 Z" fill="rgba(255,255,255,.06)" />
      <g clipPath={`url(#c-${id})`}>
        <motion.path fill={`url(#m-${id})`} initial={{ y: 60 }} animate={{ y: 0, x: [0, -40, 0] }} transition={{ y: { duration: 1.4 }, x: { duration: 4, repeat: Infinity, ease: 'linear' } }}
          d={`M-40 ${y} Q -20 ${y - 4} 0 ${y} T 40 ${y} T 80 ${y} T 120 ${y} T 160 ${y} V 110 H -40 Z`} />
      </g>
      <path d="M50 4 L88 26 V74 L50 96 L12 74 V26 Z" fill="none" stroke={color[0]} strokeOpacity=".7" strokeWidth="1.2" />
      <path d="M50 12 L80 30" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Score() {
  const points = useAurea((s) => s.user.points) + useAurea((s) => s.aiQuestions) * 20;
  const cur = levelOf(points); const nxt = nextLevel(points); const into = nxt ? (points - cur.min) / (nxt.min - cur.min) : 1;
  return (
    <Screen title="Score e níveis" back className="space-y-5">
      <GlassPanel variant="strong" refraction specular radius="lg" className="flex flex-col items-center p-6 text-center">
        <Medallion color={cur.color} fill={into} label={`Nível ${cur.name}, ${Math.round(into * 100)}% até o próximo`} />
        <p className="mt-2 text-sm text-fg-soft">Você é nível</p>
        <p className="font-serif text-4xl text-gold-metal">{cur.name}</p>
        <p className="mt-1 text-sm tabular text-fg-soft">{points.toLocaleString('pt-BR')} pontos {nxt && `· faltam ${(nxt.min - points).toLocaleString('pt-BR')} para ${nxt.name}`}</p>
      </GlassPanel>
      <section aria-labelledby="miss"><h2 id="miss" className="mb-2 font-serif text-xl">Missões de bons hábitos</h2>
        <ul className="space-y-2">{MISSIONS.map((m) => (
          <li key={m.id}><GlassPanel className="p-4">
            <div className="flex items-center gap-3"><span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full border', m.progress >= 1 ? 'border-gold-300 bg-gold-400/25 text-gold-100' : 'border-white/15 text-fg-soft')}>{m.progress >= 1 ? <Check size={16} /> : <span className="text-xs tabular">{Math.round(m.progress * 100)}%</span>}</span>
              <div className="flex-1"><p className="text-[15px]">{m.title}</p><p className="text-xs text-fg-soft">{m.detail}</p></div><span className="text-xs tabular text-fg-gold">+{m.points}</span></div>
            <LiquidFill value={m.progress} className="mt-3 h-2 w-full" rounded="rounded-pill" bubbles={false} wave={0.2} label={`${m.title}: ${Math.round(m.progress * 100)}%`} />
          </GlassPanel></li>
        ))}</ul>
      </section>
      <section aria-labelledby="lv"><h2 id="lv" className="mb-2 font-serif text-xl">Benefícios por nível</h2>
        <div className="space-y-2">{LEVELS.map((l) => { const unlocked = points >= l.min; return (
          <GlassPanel key={l.id} variant={l.id === cur.id ? 'gold' : 'soft'} className={cn('flex gap-3 p-4', !unlocked && 'opacity-70')}>
            <Medallion color={l.color} fill={unlocked ? 1 : 0.15} size={48} label={l.name} />
            <div className="flex-1"><p className="flex items-center gap-2 font-semibold">{l.name} {!unlocked && <Lock size={12} aria-label="bloqueado" />}<span className="text-xs font-normal text-fg-soft">{l.min.toLocaleString('pt-BR')} pts</span></p>
              <ul className="mt-1 text-sm text-fg-soft">{l.perks.map((p) => <li key={p}>· {p}</li>)}</ul></div>
          </GlassPanel>
        ); })}</div>
      </section>
      <p className="text-[11px] text-fg-soft/80">Benefícios ilustrativos de protótipo; limites e taxas reais dependem de análise de crédito.</p>
    </Screen>
  );
}
