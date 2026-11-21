'use client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AUTOMATIONS, BUSINESS, CHARGES, REMINDERS, type Automation, type AutoScope, type Charge, type Reminder } from '../mock/assessor';
import { GROUPS, type Group, type GroupKind } from '../mock/groups';
import { safeStorage } from '../utils/storage';
import { uid } from '../utils/format';
import { useAurea } from './aurea';

type Result = { ok: true } | { ok: false; error: string };
export interface WaMsg { id: string; from: 'user' | 'aurea'; text: string; date: string; card?: { title: string; lines: string[]; action?: 'pagar' | 'cobrar' | 'ok'; refId?: string; done?: boolean } }

interface S {
  automations: Automation[]; reminders: Reminder[]; charges: Charge[]; business: typeof BUSINESS; scope: AutoScope;
  whatsappLinked: boolean; wa: WaMsg[]; groups: Group[];
  setScope: (s: AutoScope) => void;
  toggleAutomation: (id: string) => void;
  addAutomation: (a: Omit<Automation, 'id' | 'runs' | 'moved' | 'active'>) => void;
  runAutomation: (id: string) => string;
  addReminder: (r: Omit<Reminder, 'id' | 'paid'>) => Result;
  payReminder: (id: string) => Result;
  addCharge: (c: { client: string; amount: number; days: number }) => Result;
  nudgeCharge: (id: string) => void; markChargePaid: (id: string) => void;
  linkWhatsapp: () => void; pushWa: (m: Omit<WaMsg, 'id' | 'date'>) => void; updateWaCard: (id: string, done: boolean) => void;
  createGroup: (g: { name: string; emoji: string; kind: GroupKind; members: string[]; goal?: number }) => Result & { id?: string };
  sendGroupMsg: (gid: string, text: string, sticker?: string) => void;
  contributeGroup: (gid: string, amount: number) => Result;
  checkInChallenge: (gid: string) => Result;
  payBill: (gid: string, billId: string) => Result;
  nudgeGroup: (gid: string, who: string) => void;
}
const r2 = (n: number) => Math.round(n * 100) / 100;
const now = () => new Date().toISOString();
const sys = (text: string) => ({ id: uid(), author: 'sys', text, date: now(), system: true });

export const useSocial = create<S>()(persist((set, get) => ({
  automations: AUTOMATIONS, reminders: REMINDERS, charges: CHARGES, business: BUSINESS, scope: 'pessoal', whatsappLinked: false, groups: GROUPS,
  wa: [{ id: 'w0', from: 'aurea', date: now(), text: 'Oi! Sou a Áurea, sua assessora. Me mande coisas como:\n• “gastei 35 de almoço em dinheiro”\n• “me lembra de pagar a internet dia 10”\n• “cobra a Padaria 850 reais”\n• “resumo da semana”' }],
  setScope: (scope) => set({ scope }),
  toggleAutomation: (id) => set((s) => ({ automations: s.automations.map((a) => a.id === id ? { ...a, active: !a.active } : a) })),
  addAutomation: (a) => set((s) => ({ automations: [{ ...a, id: uid(), runs: 0, moved: 0, active: true }, ...s.automations] })),
  runAutomation: (id) => {
    const a = get().automations.find((x) => x.id === id); if (!a) return 'Automação não encontrada.';
    const aurea = useAurea.getState(); let moved = 0; let msg = '';
    if (a.trigger === 'salario' || a.trigger === 'venda') {
      const base = a.trigger === 'salario' ? 6800 : 480; const pct = a.trigger === 'salario' ? 0.1 : 0.06; moved = r2(base * pct);
      const target = aurea.vaults.find((v) => v.saved < v.goal) ?? aurea.vaults[0];
      if (a.scope === 'pessoal' && target) { const r = aurea.deposit(target.id, moved); if (!r.ok) return r.error; msg = `${moved.toFixed(2).replace('.', ',')} guardados em “${target.name}”.`; }
      else { set((s) => ({ business: { ...s.business, taxVault: r2(s.business.taxVault + moved) } })); msg = `R$ ${moved.toFixed(2).replace('.', ',')} separados para impostos.`; }
    } else if (a.trigger === 'mensal' && a.scope === 'negocio') {
      moved = 3000; set((s) => ({ business: { ...s.business, balance: r2(s.business.balance - moved) } })); useAurea.setState((st) => ({ balance: r2(st.balance + moved) })); msg = 'Pró-labore de R$ 3.000 transferido para sua conta pessoal.';
    } else if (a.trigger === 'semanal') { msg = 'Resumo enviado no WhatsApp.'; get().pushWa({ from: 'aurea', text: weeklySummary() }); }
    else if (a.trigger === 'vencimento') { const n = get().reminders.filter((r) => !r.paid).length; msg = `${n} lembretes conferidos; avisos enviados.`; }
    else msg = 'Nenhum gasto fora do padrão hoje.';
    set((s) => ({ automations: s.automations.map((x) => x.id === id ? { ...x, runs: x.runs + 1, moved: r2(x.moved + moved), lastRun: now() } : x) }));
    return msg;
  },
  addReminder: (r) => { if (r.title.trim().length < 2) return { ok: false, error: 'Dê um nome ao lembrete.' }; set((s) => ({ reminders: [...s.reminders, { ...r, id: uid(), paid: false }].sort((a, b) => +new Date(a.due) - +new Date(b.due)) })); return { ok: true }; },
  payReminder: (id) => {
    const r = get().reminders.find((x) => x.id === id); if (!r) return { ok: false, error: 'Lembrete não encontrado.' };
    if (r.amount) {
      if (r.scope === 'pessoal') { const ok = useAurea.getState().sendPix({ to: r.title, amount: r.amount, message: 'Pago pelo assessor' }); if (!ok.ok) return ok; }
      else { if (r.amount > get().business.balance) return { ok: false, error: 'Saldo do negócio insuficiente.' }; set((s) => ({ business: { ...s.business, balance: r2(s.business.balance - r.amount!), monthOut: r2(s.business.monthOut + r.amount!) } })); }
    }
    set((s) => ({ reminders: s.reminders.map((x) => x.id === id ? { ...x, paid: true } : x) })); return { ok: true };
  },
  addCharge: ({ client, amount, days }) => {
    if (client.trim().length < 2) return { ok: false, error: 'Informe o cliente.' }; if (!(amount > 0)) return { ok: false, error: 'Informe o valor.' };
    const due = new Date(); due.setDate(due.getDate() + days);
    set((s) => ({ charges: [{ id: uid(), client: client.trim(), amount: r2(amount), due: due.toISOString(), status: 'aberta', remindersSent: 0 }, ...s.charges] })); return { ok: true };
  },
  nudgeCharge: (id) => set((s) => ({ charges: s.charges.map((c) => c.id === id ? { ...c, remindersSent: c.remindersSent + 1 } : c) })),
  markChargePaid: (id) => {
    const c = get().charges.find((x) => x.id === id); if (!c || c.status === 'paga') return;
    const tax = r2(c.amount * 0.06);
    set((s) => ({ charges: s.charges.map((x) => x.id === id ? { ...x, status: 'paga' } : x), business: { ...s.business, balance: r2(s.business.balance + c.amount - tax), monthIn: r2(s.business.monthIn + c.amount), taxVault: r2(s.business.taxVault + tax) } }));
  },
  linkWhatsapp: () => set({ whatsappLinked: true }),
  pushWa: (m) => set((s) => ({ wa: [...s.wa, { ...m, id: uid(), date: now() }].slice(-80) })),
  updateWaCard: (id, done) => set((s) => ({ wa: s.wa.map((m) => m.id === id && m.card ? { ...m, card: { ...m.card, done } } : m) })),
  createGroup: ({ name, emoji, kind, members, goal }) => {
    if (name.trim().length < 2) return { ok: false, error: 'Dê um nome ao grupo.' }; if (members.length < 1) return { ok: false, error: 'Chame pelo menos 1 amigo.' };
    if ((kind === 'meta' || kind === 'viagem') && !(goal && goal > 0)) return { ok: false, error: 'Defina a meta do grupo.' };
    const id = `g-${uid()}`; const all = ['eu', ...members];
    const g: Group = { id, name: name.trim(), emoji, kind, members: all, messages: [sys(`Grupo criado. ${all.length} pessoas.`)],
      ...(kind === 'meta' || kind === 'viagem' ? { goal, saved: 0, contributions: Object.fromEntries(all.map((m) => [m, 0])) } : {}),
      ...(kind === 'desafio' ? { challenge: { title: 'Guardar toda semana, sem pular', weeks: 52, week: 1, streaks: Object.fromEntries(all.map((m) => [m, 0])) } } : {}),
      ...(kind === 'casa' ? { bills: [] } : {}) };
    set((s) => ({ groups: [g, ...s.groups] })); return { ok: true, id };
  },
  sendGroupMsg: (gid, text, sticker) => { const t = text.trim().slice(0, 280); if (!t && !sticker) return; set((s) => ({ groups: s.groups.map((g) => g.id === gid ? { ...g, messages: [...g.messages, { id: uid(), author: 'eu', text: t, sticker, date: now() }] } : g) })); },
  contributeGroup: (gid, amount) => {
    const g = get().groups.find((x) => x.id === gid); if (!g || g.goal == null) return { ok: false, error: 'Grupo sem meta.' };
    const r = useAurea.getState().sendPix({ to: `Grupo ${g.name}`, amount, message: 'Barra do grupo' }); if (!r.ok) return r;
    const full = (g.saved ?? 0) + amount >= g.goal && (g.saved ?? 0) < g.goal;
    set((s) => ({ groups: s.groups.map((x) => x.id === gid ? { ...x, saved: r2((x.saved ?? 0) + amount), contributions: { ...x.contributions, eu: r2((x.contributions?.eu ?? 0) + amount) }, messages: [...x.messages, sys(full ? '✦ Barra do grupo completa! Parabéns, galera.' : 'Você guardou na barra do grupo')] } : x) }));
    return { ok: true };
  },
  checkInChallenge: (gid) => {
    const g = get().groups.find((x) => x.id === gid); if (!g?.challenge) return { ok: false, error: 'Sem desafio.' };
    if ((g.challenge.streaks.eu ?? 0) >= g.challenge.week) return { ok: false, error: 'Você já guardou nesta semana.' };
    const r = useAurea.getState().sendPix({ to: `Desafio ${g.name}`, amount: 50, message: 'Semana do desafio' }); if (!r.ok) return r;
    set((s) => ({ groups: s.groups.map((x) => x.id === gid && x.challenge ? { ...x, challenge: { ...x.challenge, streaks: { ...x.challenge.streaks, eu: x.challenge.week } }, messages: [...x.messages, sys(`Você marcou a semana ${x.challenge.week} ✅`)] } : x) }));
    return { ok: true };
  },
  payBill: (gid, billId) => {
    const g = get().groups.find((x) => x.id === gid); const b = g?.bills?.find((x) => x.id === billId); if (!g || !b) return { ok: false, error: 'Conta não encontrada.' };
    if (b.paidBy.includes('eu')) return { ok: false, error: 'Você já pagou sua parte.' };
    const share = r2(b.amount / g.members.length); const r = useAurea.getState().sendPix({ to: `${g.name} — ${b.title}`, amount: share, message: 'Minha parte' }); if (!r.ok) return r;
    set((s) => ({ groups: s.groups.map((x) => x.id === gid ? { ...x, bills: x.bills?.map((y) => y.id === billId ? { ...y, paidBy: [...y.paidBy, 'eu'] } : y), messages: [...x.messages, sys(`Você pagou sua parte de ${b.title}`)] } : x) }));
    return { ok: true };
  },
  nudgeGroup: (gid, who) => set((s) => ({ groups: s.groups.map((x) => x.id === gid ? { ...x, messages: [...x.messages, sys(`Você deu um cutucão dourado em ${who} 👉✨`)] } : x) })),
}), { name: 'aurea-social-v1', version: 1, storage: createJSONStorage(() => safeStorage) }));

export function weeklySummary() {
  const a = useAurea.getState(); const week = Date.now() - 7 * 86400000;
  const tx = a.transactions.filter((t) => +new Date(t.date) >= week);
  const out = tx.filter((t) => t.kind === 'saida' && !['cofre', 'ouro'].includes(t.category)).reduce((s, t) => s + t.amount, 0);
  const saved = tx.filter((t) => t.channel === 'cofre' && t.kind === 'saida').reduce((s, t) => s + t.amount, 0);
  const best = [...a.vaults].filter((v) => v.saved < v.goal).sort((x, y) => y.saved / y.goal - x.saved / x.goal)[0];
  const f = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return `📊 Resumo da semana\n• Gastou ${f(out)}\n• Guardou ${f(saved)}\n• Saldo ${f(a.balance)}${best ? `\n• Barra “${best.name}” em ${Math.round((best.saved / best.goal) * 100)}%` : ''}\nBoa semana! ✨`;
}
