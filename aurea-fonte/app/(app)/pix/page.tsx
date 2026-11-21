'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Mic, Search, Smile, Square, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, GlassButton, GlassPanel, GoldButton, LiquidFill } from '@/components/glass';
import { Screen } from '@/components/layout/Screen';
import { AmountDisplay, AmountPad } from '@/components/app/AmountPad';
import { Overlay } from '@/components/layout/Overlay';
import { QrMock } from '@/components/app/QrMock';
import { VoiceWave } from '@/components/app/VoiceWave';
import { FRIENDS } from '@/lib/mock/friends';
import { useAurea } from '@/lib/store/aurea';
import { cn, formatBRL } from '@/lib/utils/format';

type Tab = 'enviar' | 'receber' | 'dividir';
const STICKERS = ['🪙', '✨', '🏆', '🍕', '🎉', '💛'];

function Success({ amount, to, onDone }: { amount: number; to: string; onDone: () => void }) {
  return (
    <motion.div className="pointer-events-auto absolute inset-0 z-50 flex flex-col items-center justify-center bg-ink-900/95 px-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
      <div className="relative grid h-48 w-48 place-items-center">
        <motion.span className="absolute h-8 w-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gold-metal" initial={{ y: -260, scaleY: 1.4 }} animate={{ y: 0, scaleY: [1.4, 1.4, 0.3], opacity: [1, 1, 0] }} transition={{ duration: 0.8, times: [0, 0.85, 1], ease: 'easeIn' }} />
        {[0, 1, 2].map((i) => <motion.span key={i} className="absolute h-24 w-24 rounded-full border border-gold-200/60" style={{ scaleY: 0.4 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 2.2], opacity: [0, 0.8, 0] }} transition={{ duration: 1.6, delay: 0.75 + i * 0.25 }} />)}
        <motion.span className="glass glass-gold grid h-20 w-20 place-items-center rounded-full text-gold-100" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 1 }}><Check size={36} strokeWidth={1.5} className="relative z-[1]" /></motion.span>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <p className="font-serif text-4xl tabular text-gold-metal">{formatBRL(amount)}</p><p className="mt-2 text-fg-soft">enviado para {to}</p>
        <GoldButton className="mt-8" onClick={onDone}>Concluir</GoldButton>
      </motion.div>
    </motion.div>
  );
}

function Enviar() {
  const send = useAurea((s) => s.sendPix); const balance = useAurea((s) => s.balance);
  const [step, setStep] = useState<0 | 1 | 2>(0); const [to, setTo] = useState(''); const [q, setQ] = useState(''); const [cents, setCents] = useState(0);
  const [msg, setMsg] = useState(''); const [sticker, setSticker] = useState<string>(); const [rec, setRec] = useState<'idle' | 'rec' | 'done'>('idle');
  const [err, setErr] = useState<string>(); const [done, setDone] = useState<{ amount: number; to: string } | null>(null);
  const list = FRIENDS.filter((f) => (f.name + f.handle).toLowerCase().includes(q.toLowerCase()));
  const reset = () => { setStep(0); setTo(''); setQ(''); setCents(0); setMsg(''); setSticker(undefined); setRec('idle'); setErr(undefined); setDone(null); };
  const confirm = () => {
    const r = send({ to, amount: cents / 100, message: [sticker, msg, rec === 'done' ? '🎙 áudio' : ''].filter(Boolean).join(' ') });
    if (!r.ok) return setErr(r.error); setDone({ amount: cents / 100, to });
  };
  return (
    <>
      {step === 0 && (
        <div className="space-y-4">
          <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-soft" aria-hidden />
            <input aria-label="Buscar contato ou digitar chave Pix" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, CPF, e-mail, celular ou chave" className="h-12 w-full rounded-pill border border-[var(--glass-border)] bg-black/30 pl-11 pr-4 outline-none focus:border-gold-300" /></div>
          {q.length >= 5 && list.length === 0 && <GlassButton block onClick={() => { setTo(q.trim()); setStep(1); }}>Usar a chave “{q.trim()}”</GlassButton>}
          <GlassPanel className="divide-y divide-white/5 px-2">
            {list.map((f) => (
              <button key={f.id} onClick={() => { setTo(f.name.split(' ')[0]!); setStep(1); }} className="flex min-h-[60px] w-full items-center gap-3 px-2 text-left">
                <Avatar name={f.name} hue={f.hue} level={f.level} size={40} /><span className="flex-1"><span className="block">{f.name}</span><span className="text-xs text-fg-soft">{f.pixKey}</span></span>
              </button>
            ))}
          </GlassPanel>
        </div>
      )}
      {step === 1 && (
        <div>
          <p className="text-center text-sm text-fg-soft">Para <span className="text-fg">{to}</span></p>
          <AmountDisplay cents={cents} error={err} hint={`Disponível ${formatBRL(balance)}`} />
          <AmountPad cents={cents} onChange={(c) => { setCents(c); setErr(undefined); }} />
          <div className="mt-4 grid grid-cols-2 gap-3"><GlassButton onClick={() => setStep(0)}>Voltar</GlassButton><GoldButton disabled={!cents} onClick={() => cents / 100 > balance ? setErr('Saldo insuficiente.') : setStep(2)}>Continuar</GoldButton></div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <GlassPanel variant="strong" refraction className="p-5 text-center"><p className="text-sm text-fg-soft">Enviando para {to}</p><p className="font-serif text-4xl tabular text-gold-metal">{formatBRL(cents / 100)}</p></GlassPanel>
          <div><label htmlFor="msg" className="mb-1.5 block text-sm text-fg-soft">Mensagem (opcional)</label><input id="msg" maxLength={80} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Valeu pelo almoço!" className="h-12 w-full rounded-sm border border-[var(--glass-border)] bg-black/30 px-4 outline-none focus:border-gold-300" /></div>
          <fieldset><legend className="mb-2 flex items-center gap-1.5 text-sm text-fg-soft"><Smile size={14} aria-hidden /> Figurinha</legend>
            <div className="flex gap-2">{STICKERS.map((s) => <button key={s} onClick={() => setSticker(sticker === s ? undefined : s)} aria-pressed={sticker === s} aria-label={`Figurinha ${s}`} className={cn('glass grid h-12 w-12 place-items-center rounded-sm text-2xl', sticker === s && 'glass-gold')}><span className="relative z-[1]">{s}</span></button>)}</div>
          </fieldset>
          <GlassPanel className="flex items-center gap-3 p-3">
            <button onClick={() => setRec(rec === 'rec' ? 'done' : 'rec')} aria-label={rec === 'rec' ? 'Parar gravação' : 'Gravar áudio'} className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full', rec === 'rec' ? 'bg-danger/80' : 'bg-gold-metal text-[#2A1F05]')}>{rec === 'rec' ? <Square size={18} /> : <Mic size={20} strokeWidth={1.5} />}</button>
            <div className="flex-1"><VoiceWave active={rec === 'rec'} /><p className="text-center text-xs text-fg-soft">{rec === 'rec' ? 'Gravando… (simulado)' : rec === 'done' ? 'Áudio de 0:04 anexado' : 'Áudio opcional'}</p></div>
          </GlassPanel>
          {err && <p role="alert" className="text-sm text-danger">{err}</p>}
          <div className="grid grid-cols-2 gap-3"><GlassButton onClick={() => setStep(1)}>Voltar</GlassButton><GoldButton onClick={confirm}>Enviar Pix</GoldButton></div>
        </div>
      )}
      <Overlay><AnimatePresence>{done && <Success amount={done.amount} to={done.to} onDone={reset} />}</AnimatePresence></Overlay>
    </>
  );
}

function Receber() {
  const user = useAurea((s) => s.user); const toast = useAurea((s) => s.toast); const [copied, setCopied] = useState(false);
  const key = 'f3a9c2e1-aurea-demo-7b44';
  const copy = async () => { try { await navigator.clipboard.writeText(key); } catch { /* sem permissão: ok no protótipo */ } setCopied(true); toast({ title: 'Chave copiada', tone: 'gold' }); setTimeout(() => setCopied(false), 1800); };
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative grid place-items-center p-[3px]" style={{ borderRadius: 30 }}>
        <span aria-hidden className="absolute inset-0 overflow-hidden rounded-[30px]"><span className="absolute -inset-1/2 motion-safe:animate-[spin-slow_5s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent, #F5D77A, #D4AF37, transparent 40%, transparent 60%, #FFF4CC, transparent)' }} /></span>
        <GlassPanel variant="strong" radius="lg" className="p-5" style={{ background: 'var(--ink-800)' }}><QrMock size={200} /></GlassPanel>
      </div>
      <p className="text-center text-sm text-fg-soft">Mostre o QR Code ou compartilhe sua chave<br /><span className="text-fg">{user.name}</span></p>
      <GlassButton onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} strokeWidth={1.5} />} {copied ? 'Copiada' : 'Copiar chave aleatória'}</GlassButton>
    </div>
  );
}

function Dividir() {
  const send = useAurea((s) => s.sendPix); const toast = useAurea((s) => s.toast);
  const [mode, setMode] = useState<'dividir' | 'vaquinha'>('dividir'); const [sel, setSel] = useState<string[]>(['ana', 'pedro']); const [total, setTotal] = useState('240');
  const [paid, setPaid] = useState<string[]>([]); const [goal, setGoal] = useState('600');
  const t = Number(total.replace(',', '.')) || 0; const per = sel.length ? t / (sel.length + 1) : t;
  const g = Number(goal.replace(',', '.')) || 0; const collected = paid.length * (g / Math.max(1, sel.length + 1)) + (paid.includes('eu') ? 0 : 0);
  const pct = g ? Math.min(1, collected / g) : 0;
  const toggle = (id: string) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const simulatePay = () => { const next = sel.find((id) => !paid.includes(id)); if (!next) return; setPaid((p) => [...p, next]); toast({ title: `${FRIENDS.find((f) => f.id === next)?.name.split(' ')[0]} contribuiu`, body: 'A barra coletiva subiu.', tone: 'gold' }); };
  const myShare = useMemo(() => +(g / Math.max(1, sel.length + 1)).toFixed(2), [g, sel.length]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2"><GlassButton size="sm" active={mode === 'dividir'} onClick={() => setMode('dividir')}>Dividir conta</GlassButton><GlassButton size="sm" active={mode === 'vaquinha'} onClick={() => setMode('vaquinha')}><Users size={16} /> Vaquinha</GlassButton></div>
      <fieldset><legend className="mb-2 text-sm text-fg-soft">Com quem? ({sel.length})</legend>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">{FRIENDS.map((f) => (
          <button key={f.id} onClick={() => toggle(f.id)} aria-pressed={sel.includes(f.id)} className={cn('flex w-16 shrink-0 flex-col items-center gap-1 text-xs transition-opacity', !sel.includes(f.id) && 'opacity-45')}><Avatar name={f.name} hue={f.hue} level={sel.includes(f.id) ? f.level : undefined} size={48} />{f.name.split(' ')[0]}</button>
        ))}</div>
      </fieldset>
      {mode === 'dividir' ? (
        <GlassPanel variant="strong" className="space-y-3 p-4">
          <label className="flex items-center gap-2 text-sm text-fg-soft">Total da conta R$<input aria-label="Total da conta" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value.replace(/[^\d,]/g, ''))} className="h-11 flex-1 rounded-sm border border-[var(--glass-border)] bg-black/30 px-3 tabular text-fg outline-none" /></label>
          <p className="text-sm">Cada um paga <span className="font-serif text-2xl tabular text-gold-metal">{formatBRL(per)}</span> <span className="text-fg-soft">({sel.length + 1} pessoas com você)</span></p>
          <GoldButton block disabled={!sel.length || !t} onClick={() => toast({ title: 'Cobranças enviadas', body: `${sel.length} pedidos de ${formatBRL(per)} via Pix.`, tone: 'gold' })}>Enviar cobranças</GoldButton>
        </GlassPanel>
      ) : (
        <GlassPanel variant="strong" refraction className="space-y-4 p-4">
          <label className="flex items-center gap-2 text-sm text-fg-soft">Meta da vaquinha R$<input aria-label="Meta da vaquinha" inputMode="decimal" value={goal} onChange={(e) => { setGoal(e.target.value.replace(/[^\d,]/g, '')); setPaid([]); }} className="h-11 flex-1 rounded-sm border border-[var(--glass-border)] bg-black/30 px-3 tabular text-fg outline-none" /></label>
          <LiquidFill value={pct} className="h-20 w-full" label={`Vaquinha ${Math.round(pct * 100)}%`}><div className="grid h-full place-items-center font-serif text-2xl tabular">{formatBRL(collected)} de {formatBRL(g)}</div></LiquidFill>
          <p className="text-xs text-fg-soft">Cota sugerida: {formatBRL(myShare)} por pessoa · {paid.length}/{sel.length} contribuíram</p>
          <div className="grid grid-cols-2 gap-2">
            <GlassButton onClick={simulatePay} disabled={paid.length >= sel.length}>Simular contribuição</GlassButton>
            <GoldButton onClick={() => { const r = send({ to: 'Vaquinha', amount: myShare, message: 'Minha cota' }); toast(r.ok ? { title: 'Sua cota foi enviada', tone: 'gold' } : { title: r.error, tone: 'danger' }); }}>Pagar minha cota</GoldButton>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}

export default function Pix() {
  const [tab, setTab] = useState<Tab>('enviar');
  return (
    <Screen title="Pix" className="space-y-5">
      <div role="tablist" aria-label="Pix" className="glass flex rounded-pill p-1">
        {(['enviar', 'receber', 'dividir'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('relative z-[1] h-11 flex-1 rounded-pill text-sm capitalize transition-colors', tab === t ? 'text-[#2A1F05]' : 'text-fg-soft')}>
            {tab === t && <motion.span layoutId="pix-tab" className="absolute inset-0 -z-[1] rounded-pill bg-gold-metal" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}{t === 'dividir' ? 'Dividir' : t}
          </button>
        ))}
      </div>
      {tab === 'enviar' ? <Enviar /> : tab === 'receber' ? <Receber /> : <Dividir />}
    </Screen>
  );
}
