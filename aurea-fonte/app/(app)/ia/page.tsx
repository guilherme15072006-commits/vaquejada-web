'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Mic, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GlassButton, GlassPanel, GoldButton, Orb } from '@/components/glass';
import { CategoryRing } from '@/components/charts/CategoryRing';
import { Screen } from '@/components/layout/Screen';
import { VoiceWave } from '@/components/app/VoiceWave';
import { answer, explain, findDuplicate, SUGGESTION_CHIPS, thinkDelay, type AiReply, type AiWidget } from '@/lib/mock/ai';
import { useAurea } from '@/lib/store/aurea';
import { cn, formatBRL, uid } from '@/lib/utils/format';
import { freqLabel } from '@/lib/utils/freq';

interface Msg { id: string; from: 'user' | 'ai'; text: string; widget?: AiWidget; chips?: string[]; typing?: boolean }

function Typewriter({ text, onDone }: { text: string; onDone: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => { if (n >= text.length) { onDone(); return; } const t = setTimeout(() => setN((x) => Math.min(text.length, x + 2)), 14); return () => clearTimeout(t); }, [n, text, onDone]);
  return <>{text.slice(0, n)}<span className="sr-only">{text}</span></>;
}

function Widget({ w }: { w: AiWidget }) {
  const setRule = useAurea((s) => s.setRule); const contest = useAurea((s) => s.contestTx); const dismiss = useAurea((s) => s.dismissAlert); const toast = useAurea((s) => s.toast);
  const [state, setState] = useState<'idle' | 'ok' | 'no'>('idle');
  if (w.type === 'categories') return <GlassPanel className="mt-2 p-3"><CategoryRing items={w.items} total={w.total} size={104} /></GlassPanel>;
  if (w.type === 'suggest') return <GlassPanel variant="gold" className="mt-2 p-3 text-sm"><p className="text-fg-soft">Sugestão semanal</p><p className="font-serif text-3xl tabular text-gold-metal">{formatBRL(w.weekly)}</p><p className="text-fg-soft">≈ {w.weeksLeft} semanas para completar “{w.vaultName}”</p></GlassPanel>;
  if (w.type === 'explain') return <GlassPanel className="mt-2 flex justify-between p-3 text-sm"><span>{w.tx.title}<span className="block text-xs text-fg-soft">{new Date(w.tx.date).toLocaleDateString('pt-BR')}</span></span><span className="tabular">{formatBRL(w.tx.amount)}</span></GlassPanel>;
  if (w.type === 'rule') return (
    <GlassPanel variant="gold" className="mt-2 p-3 text-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-fg-gold">Nova regra</p>
      <p className="mt-1">Guardar <b className="tabular">{formatBRL(w.amount)}</b> {freqLabel(w.frequency, w.weekday)} em “{w.vaultName}”</p>
      {state === 'idle' ? <div className="mt-3 flex gap-2"><GoldButton className="!h-11" onClick={() => { setRule(w.vaultId, { amount: w.amount, frequency: w.frequency, weekday: w.weekday }); setState('ok'); toast({ title: 'Regra criada', body: `${formatBRL(w.amount)} ${freqLabel(w.frequency, w.weekday)}`, tone: 'gold' }); }}>Confirmar</GoldButton><GlassButton size="sm" onClick={() => setState('no')}>Agora não</GlassButton></div>
        : <p className="mt-2 flex items-center gap-1.5 text-success">{state === 'ok' ? <><Check size={14} /> Regra ativa no cofre</> : <span className="text-fg-soft">Tudo bem, não criei.</span>}</p>}
    </GlassPanel>
  );
  return (
    <GlassPanel variant="gold" className="mt-2 p-3 text-sm">
      <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle size={14} aria-hidden /> {w.tx.title} · {formatBRL(w.tx.amount)} ×2</p>
      {state === 'idle' ? <div className="mt-3 flex gap-2"><GoldButton className="!h-11" onClick={() => { contest(w.tx.id); setState('ok'); toast({ title: 'Contestação aberta', body: `Estorno simulado de ${formatBRL(w.tx.amount)}.`, tone: 'success' }); }}>Contestar</GoldButton><GlassButton size="sm" onClick={() => { dismiss(w.tx.id); setState('no'); }}>Está certo</GlassButton></div>
        : <p className="mt-2 text-success">{state === 'ok' ? 'Contestação enviada. O valor voltou para sua conta (simulação).' : <span className="text-fg-soft">Ok, marquei como reconhecida.</span>}</p>}
    </GlassPanel>
  );
}

function Chat() {
  const params = useSearchParams(); const txs = useAurea((s) => s.transactions); const vaults = useAurea((s) => s.vaults); const balance = useAurea((s) => s.balance);
  const dismissed = useAurea((s) => s.dismissedAlerts); const countAi = useAurea((s) => s.countAi); const firstName = useAurea((s) => s.user.firstName);
  const [msgs, setMsgs] = useState<Msg[]>([]); const [input, setInput] = useState(''); const [thinking, setThinking] = useState(false); const [listening, setListening] = useState(false); const [talking, setTalking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null); const booted = useRef(false);
  const ctx = useMemo(() => ({ transactions: txs, vaults, balance }), [txs, vaults, balance]);
  const pushAi = useCallback((r: AiReply) => { setTalking(true); setMsgs((m) => [...m, { id: uid(), from: 'ai', text: r.text, widget: r.widget, chips: r.chips, typing: true }]); }, []);
  const ask = useCallback((text: string, focusId?: string) => {
    const t = text.trim(); if (!t || thinking) return;
    setMsgs((m) => [...m, { id: uid(), from: 'user', text: t }]); setInput(''); setThinking(true); countAi();
    const focusTx = focusId ? txs.find((x) => x.id === focusId) : undefined;
    setTimeout(() => { setThinking(false); pushAi(focusTx ? { text: explain(focusTx), widget: { type: 'explain', tx: focusTx } } : answer(t, ctx)); }, thinkDelay());
  }, [thinking, txs, ctx, pushAi, countAi]);
  useEffect(() => {
    if (booted.current) return; booted.current = true;
    const txId = params?.get('tx'); const dup = findDuplicate(txs);
    setMsgs([{ id: uid(), from: 'ai', text: `Oi, ${firstName}! Pergunte sobre seus gastos, peça para guardar dinheiro ou toque numa sugestão.` }]);
    if (txId) { const tx = txs.find((x) => x.id === txId); if (tx) setTimeout(() => ask(`O que é essa cobrança de ${tx.title}?`, txId), 300); }
    else if (dup && !dismissed.includes(dup.id)) setTimeout(() => pushAi({ text: `Notei duas cobranças iguais de ${dup.title} (${formatBRL(dup.amount)}) no mesmo dia. Quer contestar?`, widget: { type: 'duplicate', tx: dup } }), params?.get('alerta') ? 300 : 1400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, thinking]);
  const doneTyping = useCallback((id: string) => { setMsgs((m) => m.map((x) => x.id === id ? { ...x, typing: false } : x)); setTalking(false); }, []);
  const holdStart = () => { setListening(true); };
  const holdEnd = () => { if (!listening) return; setListening(false); const pool = SUGGESTION_CHIPS; ask(pool[Math.floor(Math.random() * pool.length)]!); };
  const last = msgs[msgs.length - 1];
  return (
    <Screen padBottom={false} className="flex min-h-full flex-col">
      <div className="sticky top-0 z-20 -mx-4 flex flex-col items-center px-4 pb-3 pt-[max(18px,env(safe-area-inset-top))]" style={{ background: 'linear-gradient(180deg, var(--ink-900) 70%, transparent)' }}>
        <Orb size={108} mode={listening ? 'listening' : talking || thinking ? 'talking' : 'idle'} level={listening ? 0.62 : 0.52} />
        <h1 className="mt-1 font-serif text-2xl">Áurea IA</h1>
        <p className="text-xs text-fg-soft" aria-live="polite">{listening ? 'Ouvindo…' : thinking ? 'Pensando…' : talking ? 'Respondendo…' : 'Pronta para ajudar'}</p>
      </div>
      <ol className="flex-1 space-y-3 pb-4" aria-live="polite" aria-label="Conversa">
        {msgs.map((m) => (
          <motion.li key={m.id} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[86%]', m.from === 'user' && 'text-right')}>
              <div className={cn('inline-block px-4 py-2.5 text-left text-[15px] leading-relaxed', m.from === 'user' ? 'rounded-[20px_20px_6px_20px] bg-gold-metal text-[#2A1F05]' : 'glass rounded-[20px_20px_20px_6px]')}>
                <span className="relative z-[1]">{m.typing ? <Typewriter text={m.text} onDone={() => doneTyping(m.id)} /> : m.text}</span>
              </div>
              {!m.typing && m.widget && <Widget w={m.widget} />}
              {!m.typing && m.chips && m === last && <div className="mt-2 flex flex-wrap gap-2">{m.chips.map((c) => <GlassButton key={c} size="sm" onClick={() => ask(c)}>{c}</GlassButton>)}</div>}
            </div>
          </motion.li>
        ))}
        {thinking && <li className="flex"><div className="glass flex gap-1 rounded-[20px_20px_20px_6px] px-4 py-3.5" aria-label="Digitando">{[0, 1, 2].map((i) => <motion.span key={i} className="relative z-[1] h-2 w-2 rounded-full bg-gold-200" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}</div></li>}
        <div ref={endRef} />
      </ol>
      <div className="sticky bottom-0 -mx-4 space-y-2 px-4 pb-[104px] pt-2" style={{ background: 'linear-gradient(0deg, var(--ink-900) 75%, transparent)' }}>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{SUGGESTION_CHIPS.map((c) => <GlassButton key={c} size="sm" className="shrink-0" onClick={() => ask(c)}>{c}</GlassButton>)}</div>
        <AnimatePresence>{listening && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><VoiceWave active /></motion.div>}</AnimatePresence>
        <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="glass flex items-center gap-2 rounded-pill p-1.5 pl-4">
          <label htmlFor="ai-in" className="sr-only">Mensagem para a Áurea IA</label>
          <input id="ai-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pergunte à Áurea…" className="relative z-[1] h-11 min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-soft" autoComplete="off" />
          {input.trim() ? (
            <button type="submit" aria-label="Enviar" className="relative z-[1] grid h-11 w-11 place-items-center rounded-full bg-gold-metal text-[#2A1F05]"><Send size={18} strokeWidth={1.75} /></button>
          ) : (
            <button type="button" aria-label="Segure para falar" onPointerDown={holdStart} onPointerUp={holdEnd} onPointerLeave={holdEnd} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!listening) holdStart(); } }} onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') holdEnd(); }}
              className={cn('relative z-[1] grid h-11 w-11 touch-none select-none place-items-center rounded-full transition-colors', listening ? 'scale-110 bg-gold-200 text-[#2A1F05]' : 'bg-white/10 text-gold-200')}><Mic size={20} strokeWidth={1.5} /></button>
          )}
        </form>
      </div>
    </Screen>
  );
}
export default function Page() { return <Suspense><Chat /></Suspense>; }
