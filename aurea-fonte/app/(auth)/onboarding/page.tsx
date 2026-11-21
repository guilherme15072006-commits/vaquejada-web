'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GlassButton, GoldButton, Avatar, Orb } from '@/components/glass';
import { Ingot } from '@/components/glass/Ingot';
import { FRIENDS } from '@/lib/mock/friends';
import { useAurea } from '@/lib/store/aurea';
import { cn } from '@/lib/utils/format';

function FillingIngot() {
  return <Ingot value={0.72} className="h-28 w-64" label="Barra de ouro enchendo" />;
}
function Friends() {
  const ps = [[50, 14], [86, 46], [72, 88], [28, 88], [14, 46]] as const;
  return (
    <div className="relative h-56 w-56">
      <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
        {ps.map((a, i) => ps.slice(i + 1).map((b, j) => <motion.line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="url(#aurea-gold)" strokeWidth={0.5} pathLength={1} strokeDasharray={1} initial={{ strokeDashoffset: 1, opacity: 0 }} animate={{ strokeDashoffset: 0, opacity: 0.7 }} transition={{ duration: 1.2, delay: 0.2 + (i + j) * 0.12 }} />))}
      </svg>
      {ps.map((p, i) => <motion.div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p[0]}%`, top: `${p[1]}%` }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.1 }}><Avatar name={FRIENDS[i]!.name} hue={FRIENDS[i]!.hue} level={FRIENDS[i]!.level} size={52} /></motion.div>)}
    </div>
  );
}
const SLIDES = [
  { title: 'Seu dinheiro vira ouro', body: 'Separe metas em barras de ouro que enchem a cada real guardado.', Art: FillingIngot },
  { title: 'Conheça a Áurea IA', body: 'Pergunte, peça e entenda cada cobrança — por voz ou por texto.', Art: () => <Orb size={170} mode="talking" /> },
  { title: 'Dinheiro entre amigos', body: 'Divida a conta, faça vaquinha e comemore conquistas — sem expor valores.', Art: Friends },
];

export default function Onboarding() {
  const [i, setI] = useState(0); const router = useRouter(); const finish = useAurea((s) => s.finishOnboarding);
  const s = SLIDES[i]!; const last = i === SLIDES.length - 1;
  const go = (to: string) => { finish(); router.push(to); };
  return (
    <main className="flex h-full flex-col px-6 pb-8 pt-14">
      <div className="flex justify-end"><button onClick={() => go('/login')} className="touch text-sm text-fg-soft hover:text-fg">Pular</button></div>
      <motion.div className="flex flex-1 flex-col" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.x < -60 && !last) setI(i + 1); if (info.offset.x > 60 && i > 0) setI(i - 1); }}>
        <AnimatePresence mode="wait">
          <motion.section key={i} className="flex flex-1 flex-col items-center justify-center text-center" initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -40, filter: 'blur(6px)' }} transition={{ duration: 0.35 }} aria-roledescription="slide" aria-label={`${i + 1} de ${SLIDES.length}`}>
            <div className="mb-12 grid h-60 place-items-center"><s.Art /></div>
            <h1 className="font-serif text-[40px] leading-[1.05]">{s.title}</h1>
            <p className="mt-4 max-w-[290px] text-[15px] leading-relaxed text-fg-soft">{s.body}</p>
          </motion.section>
        </AnimatePresence>
      </motion.div>
      <div className="mb-6 flex justify-center gap-2" role="tablist" aria-label="Slides">
        {SLIDES.map((_, k) => <button key={k} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="grid h-11 w-8 place-items-center"><span className={cn('h-1.5 rounded-full transition-all', k === i ? 'w-6 bg-gold-200' : 'w-1.5 bg-white/25')} /></button>)}
      </div>
      {last ? (
        <div className="space-y-3"><GoldButton block size="lg" onClick={() => go('/login?novo=1')}>Criar conta</GoldButton><GlassButton block size="lg" onClick={() => go('/login')}>Já tenho conta</GlassButton></div>
      ) : <GoldButton block size="lg" onClick={() => setI(i + 1)}>Continuar</GoldButton>}
    </main>
  );
}
