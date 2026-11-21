'use client';
import { motion } from 'framer-motion';
import { CheckCheck, ChevronLeft, Mic, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Orb } from '@/components/glass';
import { ProtoFooter } from '@/components/layout/ProtoFooter';
import { BOT_CHIPS, parseBot } from '@/lib/mock/assessorBot';
import { useAurea } from '@/lib/store/aurea';
import { useSocial, weeklySummary, type WaMsg } from '@/lib/store/social';
import { cn, formatBRL, formatTime } from '@/lib/utils/format';

export default function WhatsappChat() {
  const router = useRouter(); const wa = useSocial((s) => s.wa); const push = useSocial((s) => s.pushWa); const updateCard = useSocial((s) => s.updateWaCard);
  const addReminder = useSocial((s) => s.addReminder); const addCharge = useSocial((s) => s.addCharge); const reminders = useSocial((s) => s.reminders); const business = useSocial((s) => s.business); const charges = useSocial((s) => s.charges);
  const addCash = useAurea((s) => s.addCashExpense); const balance = useAurea((s) => s.balance); const toast = useAurea((s) => s.toast);
  const [input, setInput] = useState(''); const [typing, setTyping] = useState(false); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [wa, typing]);

  const reply = (text: string) => {
    const it = parseBot(text);
    switch (it.kind) {
      case 'gasto': return { text: `Anotei ✍️ ${it.title} — ${formatBRL(it.amount)} em ${it.category}. Confirma?`, card: { title: 'Registrar gasto em dinheiro', lines: [it.title, formatBRL(it.amount), `Categoria: ${it.category}`], action: 'ok' as const, refId: JSON.stringify(it) } };
      case 'lembrete': return { text: `Combinado! Vou te avisar 2 dias antes do dia ${it.day}. 🔔`, card: { title: 'Novo lembrete', lines: [it.title, `Todo dia ${it.day}`, ...(it.amount ? [formatBRL(it.amount)] : [])], action: 'ok' as const, refId: JSON.stringify(it) } };
      case 'cobrar': return it.amount > 0 ? { text: `Vou cobrar ${it.client}. Mando o link Pix e lembro em 1, 3 e 7 dias se não pagar. Posso enviar?`, card: { title: 'Cobrança', lines: [it.client, formatBRL(it.amount), 'Vence em 7 dias'], action: 'cobrar' as const, refId: JSON.stringify(it) } } : { text: 'Qual o valor da cobrança? Ex.: “cobra o Café Aroma 390”.' };
      case 'resumo': return { text: weeklySummary() };
      case 'saldo': return { text: `💰 Saldo pessoal: ${formatBRL(balance)}\n💼 Saldo do negócio: ${formatBRL(business.balance)}` };
      case 'contas': { const open = reminders.filter((r) => !r.paid).slice(0, 4); return { text: open.length ? `📅 Próximas contas:\n${open.map((r) => `• ${r.title}${r.amount ? ` — ${formatBRL(r.amount)}` : ''} (${new Date(r.due).toLocaleDateString('pt-BR')})`).join('\n')}` : 'Nenhuma conta pendente! ✨' }; }
      case 'negocio': { const rec = charges.filter((c) => c.status !== 'paga').reduce((s, c) => s + c.amount, 0); return { text: `💼 ${business.name}\n• Entradas no mês: ${formatBRL(business.monthIn)}\n• Saídas: ${formatBRL(business.monthOut)}\n• A receber: ${formatBRL(rec)}\n• Guardado p/ impostos: ${formatBRL(business.taxVault)}\nLucro do mês até agora: ${formatBRL(business.monthIn - business.monthOut)} 📈` }; }
      default: return { text: 'Não entendi 😅 Tenta assim:\n• “gastei 20 de uber”\n• “me lembra do aluguel dia 5”\n• “cobra a Padaria 850”\n• “resumo da semana”' };
    }
  };
  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return; push({ from: 'user', text: t }); setInput(''); setTyping(true);
    setTimeout(() => { setTyping(false); push({ from: 'aurea', ...reply(t) }); }, 700 + Math.random() * 500);
  };
  const confirm = (m: WaMsg) => {
    if (!m.card?.refId) return; const it = JSON.parse(m.card.refId) as ReturnType<typeof parseBot>;
    let ok = true; let err = '';
    if (it.kind === 'gasto') { const r = addCash({ title: it.title, amount: it.amount, category: it.category }); ok = r.ok; if (!r.ok) err = r.error; }
    if (it.kind === 'lembrete') { const due = new Date(); if (it.day < due.getDate()) due.setMonth(due.getMonth() + 1); due.setDate(it.day); const r = addReminder({ title: it.title, amount: it.amount, due: due.toISOString(), scope: 'pessoal', recurring: true }); ok = r.ok; if (!r.ok) err = r.error; }
    if (it.kind === 'cobrar') { const r = addCharge({ client: it.client, amount: it.amount, days: 7 }); ok = r.ok; if (!r.ok) err = r.error; }
    if (!ok) return toast({ title: err, tone: 'danger' });
    updateCard(m.id, true); push({ from: 'aurea', text: it.kind === 'cobrar' ? `✅ Cobrança enviada para ${it.client}.` : '✅ Feito! Já está no app.' });
  };
  return (
    <main className="flex h-full flex-col">
      <header className="glass glass-strong z-10 flex items-center gap-3 rounded-none px-3 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <button onClick={() => router.push('/assessor')} aria-label="Voltar" className="touch relative z-[1] grid place-items-center text-fg-soft"><ChevronLeft size={24} strokeWidth={1.5} /></button>
        <span className="relative z-[1] grid h-10 w-10 place-items-center rounded-full bg-ink-800"><Orb size={34} mode={typing ? 'talking' : 'idle'} /></span>
        <div className="relative z-[1] flex-1"><p className="font-semibold">Áurea · assessora</p><p className="text-xs text-success">{typing ? 'digitando…' : 'online'}</p></div>
        <span className="relative z-[1] rounded-pill bg-[#25D366]/15 px-2 py-1 text-[10px] uppercase tracking-wider text-[#7FE0A8]">WhatsApp</span>
      </header>
      <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3 pb-40 pt-3" style={{ backgroundImage: 'radial-gradient(rgba(212,175,55,.06) 1px, transparent 1px)', backgroundSize: '18px 18px' }} aria-live="polite">
        <p className="mx-auto w-fit rounded-pill bg-white/5 px-3 py-1 text-[11px] text-fg-soft">🔒 Simulação da conversa — nenhuma mensagem real é enviada</p>
        {wa.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[82%] px-3 py-2 text-[14.5px] leading-snug shadow', m.from === 'user' ? 'rounded-[16px_16px_4px_16px] bg-[#3A2F12] text-gold-100' : 'rounded-[16px_16px_16px_4px] bg-ink-700 text-fg')}>
              <p className="whitespace-pre-line">{m.text}</p>
              {m.card && (
                <div className="mt-2 rounded-sm border border-gold-300/30 bg-black/30 p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-fg-gold">{m.card.title}</p>
                  {m.card.lines.map((l) => <p key={l} className="tabular text-sm">{l}</p>)}
                  {m.card.done ? <p className="mt-2 text-sm text-success">✓ Confirmado</p> : (
                    <div className="mt-2 flex gap-2"><button onClick={() => confirm(m)} className="h-11 flex-1 rounded-pill bg-gold-metal text-sm font-semibold text-[#2A1F05]">{m.card.action === 'cobrar' ? 'Enviar cobrança' : 'Confirmar'}</button><button onClick={() => { updateCard(m.id, true); push({ from: 'aurea', text: 'Ok, cancelei. 👍' }); }} className="h-11 px-3 text-sm text-fg-soft">Cancelar</button></div>
                  )}
                </div>
              )}
              <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-fg-soft">{formatTime(m.date)}{m.from === 'user' && <CheckCheck size={12} className="text-[#7FC8E0]" />}</p>
            </div>
          </motion.div>
        ))}
        {typing && <div className="w-fit rounded-[16px_16px_16px_4px] bg-ink-700 px-4 py-3" aria-label="Digitando"><span className="flex gap-1">{[0, 1, 2].map((i) => <motion.span key={i} className="h-2 w-2 rounded-full bg-gold-200" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}</span></div>}
        <div ref={end} />
        <ProtoFooter />
      </div>
      <div className="absolute inset-x-0 bottom-[96px] space-y-2 px-3 pb-2 pt-2" style={{ background: 'linear-gradient(0deg, var(--ink-900) 70%, transparent)' }}>
        <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">{BOT_CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="glass h-11 shrink-0 rounded-pill px-4 text-sm"><span className="relative z-[1]">{c}</span></button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
          <label htmlFor="wa-in" className="sr-only">Mensagem</label>
          <input id="wa-in" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mensagem" autoComplete="off" className="h-12 min-w-0 flex-1 rounded-pill border border-[var(--glass-border)] bg-ink-800 px-4 outline-none focus:border-gold-300" />
          <button type="submit" aria-label={input.trim() ? 'Enviar' : 'Áudio (simulado)'} onClick={(e) => { if (!input.trim()) { e.preventDefault(); send(BOT_CHIPS[Math.floor(Math.random() * BOT_CHIPS.length)]!); } }} className="grid h-12 w-12 place-items-center rounded-full bg-gold-metal text-[#2A1F05]">{input.trim() ? <Send size={18} /> : <Mic size={20} strokeWidth={1.5} />}</button>
        </form>
      </div>
    </main>
  );
}
