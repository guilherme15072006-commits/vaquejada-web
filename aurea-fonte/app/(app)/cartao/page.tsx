'use client';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Lock, RotateCw, Snowflake, Unlock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GlassButton, GlassPanel, GoldButton, LiquidFill } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { useAurea } from '@/lib/store/aurea';
import { formatBRL } from '@/lib/utils/format';

function GoldVeins() {
  return (
    <svg viewBox="0 0 340 214" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M-20 ${60 + i * 50} C 60 ${20 + i * 40}, 140 ${140 - i * 20}, 220 ${80 + i * 30} S 360 ${40 + i * 50}, 380 ${90 + i * 30}`} fill="none" stroke="url(#aurea-gold)" strokeWidth={1.2 + i * 0.6} strokeLinecap="round" opacity={0.65 - i * 0.12}
          strokeDasharray="60 400" animate={{ strokeDashoffset: [0, -460] }} transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'linear' }} style={{ filter: 'url(#aurea-water)' }} />
      ))}
    </svg>
  );
}

export default function Cartao() {
  const user = useAurea((s) => s.user); const locked = useAurea((s) => s.cardLocked); const toggle = useAurea((s) => s.toggleCard); const limit = useAurea((s) => s.cardLimit); const used = useAurea((s) => s.cardUsed); const toast = useAurea((s) => s.toast);
  const [flip, setFlip] = useState(false); const [reveal, setReveal] = useState(false); const reduce = useReducedMotion(); const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [12, -12]), { stiffness: 160, damping: 18 }); const ry = useSpring(useTransform(mx, [0, 1], [-16, 16]), { stiffness: 160, damping: 18 });
  const glare = useTransform([mx, my], ([x, y]) => `radial-gradient(60% 50% at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,.35), transparent 60%)`);
  useEffect(() => {
    if (reduce) return;
    const onTilt = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; mx.set(Math.min(1, Math.max(0, 0.5 + e.gamma / 50))); my.set(Math.min(1, Math.max(0, 0.5 + (e.beta - 45) / 50))); };
    window.addEventListener('deviceorientation', onTilt); return () => window.removeEventListener('deviceorientation', onTilt);
  }, [mx, my, reduce]);
  const onMove = (e: React.PointerEvent) => { if (reduce || !ref.current) return; const r = ref.current.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const face = 'absolute inset-0 overflow-hidden rounded-[22px] [backface-visibility:hidden]';
  return (
    <Screen title="Cartão" back className="space-y-5">
      <div ref={ref} className="pt-2" style={{ perspective: 1000 }} onPointerMove={onMove} onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}>
        <motion.button aria-label={flip ? 'Mostrar frente do cartão' : 'Virar cartão para ver dados'} onClick={() => setFlip(!flip)} className="relative block aspect-[1.586] w-full" style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
          <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: flip ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
            <div className={`${face} glass glass-strong`} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.03))' }}>
              <GoldVeins />
              <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: glare }} />
              <div className="relative z-[2] flex h-full flex-col justify-between p-5 text-left">
                <div className="flex items-start justify-between"><span className="font-serif text-2xl text-gold-metal">Áurea</span><span className="text-xs uppercase tracking-[0.2em] text-fg-gold">Black</span></div>
                <div className="h-8 w-11 rounded-md bg-gold-metal shadow-inner" aria-hidden />
                <div className="flex items-end justify-between"><div><p className="tabular tracking-[0.2em] text-fg">•••• 4821</p><p className="mt-1 text-xs uppercase tracking-widest text-fg-soft">{user.name}</p></div><span className="text-xs text-fg-soft">virtual</span></div>
              </div>
            </div>
            <div className={`${face} glass glass-strong [transform:rotateY(180deg)]`} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.02))' }}>
              <div className="relative z-[2] mt-6 h-10 bg-black/70" />
              <div className="relative z-[2] space-y-2 p-5 text-left text-sm">
                <p className="tabular tracking-[0.18em]">{reveal ? '5213 7740 1189 4821' : '5213 •••• •••• 4821'}</p>
                <div className="flex gap-6 tabular"><span><span className="text-xs text-fg-soft">Validade </span>{reveal ? '09/31' : '••/••'}</span><span><span className="text-xs text-fg-soft">CVV </span>{reveal ? '387' : '•••'}</span></div>
                <p className="text-[11px] text-fg-soft">Número fictício — protótipo.</p>
              </div>
            </div>
          </motion.div>
          <AnimatePresence>
            {locked && (
              <motion.div className="pointer-events-none absolute inset-0 z-10 grid place-items-center overflow-hidden rounded-[22px]" style={{ transform: 'translateZ(30px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="absolute inset-0 backdrop-blur-md" style={{ background: 'linear-gradient(135deg, rgba(200,230,255,.35), rgba(255,255,255,.1))' }} initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(80% at 50% 50%)' }} exit={{ clipPath: 'circle(0% at 50% 50%)' }} transition={{ duration: 0.7 }} />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 340 214" aria-hidden>{[...Array(8)].map((_, i) => <motion.path key={i} d={`M170 107 L ${170 + Math.cos(i * 0.8) * 200} ${107 + Math.sin(i * 0.8) * 140}`} stroke="rgba(255,255,255,.6)" strokeWidth={0.8} pathLength={1} strokeDasharray={1} initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.6, delay: 0.2 + i * 0.04 }} />)}</svg>
                <span className="relative flex items-center gap-2 rounded-pill bg-black/50 px-4 py-2 text-sm"><Snowflake size={16} /> Cartão bloqueado</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <p className="mt-2 text-center text-xs text-fg-soft"><RotateCw size={12} className="mr-1 inline" aria-hidden />Toque para virar · incline para ver o reflexo</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <GlassButton onClick={() => { toggle(); toast({ title: locked ? 'Cartão desbloqueado' : 'Cartão bloqueado', body: locked ? 'Pronto para compras.' : 'Nenhuma compra será aprovada.', tone: 'gold' }); }}>{locked ? <Unlock size={18} strokeWidth={1.5} /> : <Lock size={18} strokeWidth={1.5} />}{locked ? 'Desbloquear' : 'Bloquear'}</GlassButton>
        <GlassButton onClick={() => { setReveal(!reveal); setFlip(true); }}>{reveal ? 'Ocultar dados' : 'Ver dados'}</GlassButton>
      </div>
      <GlassPanel variant="strong" refraction className="space-y-4 p-5">
        <div className="flex justify-between"><div><p className="text-sm text-fg-soft">Fatura atual</p><p className="font-serif text-3xl tabular text-gold-metal">{formatBRL(used)}</p><p className="text-xs text-fg-soft">fecha dia 28 · vence dia 05</p></div><div className="text-right"><p className="text-sm text-fg-soft">Disponível</p><p className="font-serif text-2xl tabular">{formatBRL(limit - used)}</p></div></div>
        <LiquidFill value={used / limit} className="h-4 w-full" rounded="rounded-pill" bubbles={false} wave={0.4} label={`Limite usado: ${Math.round((used / limit) * 100)}%`} />
        <p className="text-xs text-fg-soft">Limite total {formatBRL(limit)}</p>
        <GoldButton block onClick={() => toast({ title: 'Fatura paga (simulação)', body: 'Nenhum valor real foi movimentado.', tone: 'gold' })}>Pagar fatura</GoldButton>
      </GlassPanel>
    </Screen>
  );
}
