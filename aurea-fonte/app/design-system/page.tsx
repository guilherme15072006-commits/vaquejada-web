'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, GlassButton, GlassPanel, GlassSheet, GoldButton, GoldNumber, Ingot, LiquidFill, Orb, ShimmerSkeleton } from '@/components/glass';
import { GoldLineChart } from '@/components/charts/GoldLineChart';
import { CategoryRing } from '@/components/charts/CategoryRing';
import { ToastHost } from '@/components/glass/Toast';
import { goldRange } from '@/lib/mock/gold';
import { useAurea } from '@/lib/store/aurea';

const TOKENS = ['--gold-100', '--gold-200', '--gold-300', '--gold-400', '--gold-500', '--gold-600', '--ink-900', '--ink-800', '--ink-700', '--success', '--danger'];
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4"><h2 className="font-serif text-3xl">{title}</h2>{children}</section>;
}
export default function DesignSystem() {
  const [fill, setFill] = useState(0.62); const [sheet, setSheet] = useState(false); const [v, setV] = useState(8432.57);
  const toast = useAurea((s) => s.toast); const rt = useAurea((s) => s.reduceTransparency); const setRt = useAurea((s) => s.setReduceTransparency);
  return (
    <div className="relative z-[1] mx-auto max-w-5xl space-y-14 px-4 py-12 sm:px-8">
      <div className="fixed inset-x-0 top-0 z-50"><ToastHost /></div>
      <header><p className="text-sm uppercase tracking-[0.3em] text-fg-gold">Áurea · Liquid Gold Glass</p><h1 className="mt-2 font-serif text-6xl text-gold-metal">Design system</h1><p className="mt-3 max-w-xl text-fg-soft">Vidro com água e ouro: superfícies translúcidas, refração, reflexos que acompanham o movimento e ouro líquido que enche e ondula.</p>
        <div className="mt-4 flex gap-2"><GlassButton size="sm" active={rt} onClick={() => setRt(!rt)}>Reduzir transparência: {rt ? 'ligado' : 'desligado'}</GlassButton><Link href="/home" className="glass inline-flex h-11 items-center rounded-pill px-4 text-sm"><span className="relative z-[1]">Abrir o app →</span></Link></div>
      </header>
      <Section title="Tokens">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{TOKENS.map((t) => <div key={t} className="space-y-1.5"><div className="h-16 rounded-sm border border-white/10" style={{ background: `var(${t})` }} /><p className="font-mono text-[11px] text-fg-soft">{t}</p></div>)}<div className="space-y-1.5"><div className="h-16 rounded-sm bg-gold-metal" /><p className="font-mono text-[11px] text-fg-soft">--gold-metal</p></div></div>
        <div className="flex flex-wrap items-baseline gap-6"><p className="font-serif text-5xl">Cormorant Garamond</p><p className="text-xl">Manrope — interface e texto corrido</p><GoldNumber value={1234.56} className="text-4xl" /></div>
      </Section>
      <Section title="GlassPanel">
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassPanel className="p-5"><p className="font-semibold">soft</p><p className="text-sm text-fg-soft">Padrão para cards.</p></GlassPanel>
          <GlassPanel variant="strong" refraction className="p-5"><p className="font-semibold">strong + refraction</p><p className="text-sm text-fg-soft">Filtro de água atrás do conteúdo.</p></GlassPanel>
          <GlassPanel variant="gold" specular className="p-5"><p className="font-semibold">gold + specular</p><p className="text-sm text-fg-soft">Mova o mouse: o reflexo acompanha.</p></GlassPanel>
        </div>
      </Section>
      <Section title="Botões">
        <div className="flex flex-wrap gap-3"><GoldButton>GoldButton</GoldButton><GoldButton size="lg">Grande</GoldButton><GoldButton loading>…</GoldButton><GoldButton disabled>Desabilitado</GoldButton><GlassButton>GlassButton</GlassButton><GlassButton active>Ativo</GlassButton><GlassButton size="sm">Pequeno</GlassButton></div>
      </Section>
      <Section title="Ouro líquido">
        <div className="grid items-center gap-6 sm:grid-cols-3">
          <LiquidFill value={fill} className="h-40 w-full" label="Demonstração"><div className="grid h-full place-items-center font-serif text-4xl tabular">{Math.round(fill * 100)}%</div></LiquidFill>
          <Ingot value={fill} className="h-24 w-full" label="Lingote" />
          <div className="flex justify-center"><Orb size={140} mode="talking" /></div>
        </div>
        <input type="range" min={0} max={1} step={0.01} value={fill} onChange={(e) => setFill(Number(e.target.value))} aria-label="Nível de ouro" className="w-full accent-[#D4AF37]" />
      </Section>
      <Section title="GoldNumber, Avatar, Skeleton">
        <div className="flex flex-wrap items-center gap-6"><GoldNumber value={v} className="text-5xl" /><GlassButton size="sm" onClick={() => setV(v + 150)}>+ R$ 150</GlassButton>
          <Avatar name="Marina Albuquerque" hue={38} level="ouro" size={56} /><Avatar name="Beatriz Rocha" hue={270} level="diamante" size={56} /><Avatar name="Lucas Martins" hue={20} level="bronze" size={56} /><Avatar name="João Pedro" hue={150} level="prata" size={56} />
          <div className="w-48 space-y-2"><ShimmerSkeleton className="h-4 w-full" /><ShimmerSkeleton className="h-4 w-2/3" /></div></div>
      </Section>
      <Section title="Gráficos">
        <div className="grid gap-4 sm:grid-cols-2">
          <GlassPanel className="p-4"><GoldLineChart data={goldRange('30d').map((x) => x.price)} label="Ouro 30 dias" /></GlassPanel>
          <GlassPanel className="p-4"><CategoryRing total={1000} items={[{ category: 'comida', label: 'Comida', value: 420 }, { category: 'mercado', label: 'Mercado', value: 300 }, { category: 'transporte', label: 'Transporte', value: 180 }, { category: 'lazer', label: 'Lazer', value: 100 }]} /></GlassPanel>
        </div>
      </Section>
      <Section title="Toast e GlassSheet">
        <div className="flex gap-3"><GoldButton onClick={() => toast({ title: 'Gota de ouro', body: 'Toast entrando como uma gota caindo.', tone: 'gold' })}>Disparar toast</GoldButton><GlassButton onClick={() => setSheet(true)}>Abrir sheet</GlassButton></div>
        <div className="relative h-[360px] overflow-hidden rounded-lg border border-white/10"><div id="aurea-overlay" className="pointer-events-none absolute inset-0 z-50" /><p className="p-4 text-sm text-fg-soft">Área de pré-visualização do sheet (arraste a alça para fechar).</p>
          <GlassSheet open={sheet} onClose={() => setSheet(false)} title="GlassSheet"><p className="text-fg-soft">Bottom sheet de vidro, arrastável, com foco preso e Esc.</p><GoldButton block className="mt-4" onClick={() => setSheet(false)}>Fechar</GoldButton></GlassSheet></div>
      </Section>
      <p className="text-center text-xs text-fg-soft/80">Protótipo — dados fictícios</p>
    </div>
  );
}
