import { CATEGORY_LABEL } from './transactions';
import type { Category, Frequency, Transaction, Vault } from './types';
import { formatBRL } from '../utils/format';

export type AiWidget =
  | { type: 'categories'; items: { category: Category; label: string; value: number }[]; total: number }
  | { type: 'rule'; amount: number; frequency: Frequency; weekday?: number; vaultId: string; vaultName: string }
  | { type: 'explain'; tx: Transaction }
  | { type: 'suggest'; weekly: number; vaultName: string; weeksLeft: number }
  | { type: 'duplicate'; tx: Transaction };
export interface AiReply { text: string; widget?: AiWidget; chips?: string[] }
export interface AiContext { transactions: Transaction[]; vaults: Vault[]; balance: number; focusTx?: Transaction }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const WEEKDAYS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
const NUM_WORDS: Record<string, number> = { dez: 10, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, cem: 100, duzentos: 200 };

function parseAmount(t: string): number | undefined {
  const m = t.match(/(\d+[.,]?\d*)/); if (m) return parseFloat(m[1]!.replace(',', '.'));
  for (const [w, v] of Object.entries(NUM_WORDS)) if (t.includes(w)) return v;
  return undefined;
}
const monthTx = (txs: Transaction[]) => { const now = new Date(); return txs.filter((x) => { const d = new Date(x.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }); };

export const SUGGESTION_CHIPS = ['Quanto gastei com comida esse mês?', 'Guarda 50 reais toda sexta', 'O que é essa cobrança?', 'Quanto devo guardar por semana?'];

export function findDuplicate(txs: Transaction[]): Transaction | undefined {
  const seen = new Map<string, Transaction>();
  for (const t of txs) { if (t.kind !== 'saida' || t.channel !== 'cartao') continue; const k = `${t.title}|${t.amount}|${t.date.slice(0, 10)}`; if (seen.has(k)) return t; seen.set(k, t); }
  return undefined;
}

export function answer(input: string, ctx: AiContext): AiReply {
  const t = norm(input);
  if (/(gastei|gasto|gastos)/.test(t)) {
    const out = monthTx(ctx.transactions).filter((x) => x.kind === 'saida' && !['cofre', 'ouro'].includes(x.category));
    const by = new Map<Category, number>(); out.forEach((x) => by.set(x.category, (by.get(x.category) ?? 0) + x.amount));
    const items = [...by.entries()].map(([category, value]) => ({ category, label: CATEGORY_LABEL[category], value: +value.toFixed(2) })).sort((a, b) => b.value - a.value);
    const total = items.reduce((s, i) => s + i.value, 0);
    const cat = (Object.keys(CATEGORY_LABEL) as Category[]).find((c) => t.includes(norm(CATEGORY_LABEL[c])) || (c === 'comida' && /(comida|aliment|restaurante|ifood)/.test(t)));
    if (cat) {
      const v = by.get(cat) ?? 0; const share = total ? Math.round((v / total) * 100) : 0;
      return { text: `Neste mês você gastou ${formatBRL(v)} com ${CATEGORY_LABEL[cat].toLowerCase()} — ${share}% das suas saídas. ${share > 25 ? 'Está um pouco acima do que costuma ser saudável; quer que eu crie um limite semanal?' : 'Está dentro do esperado. Bom trabalho!'}`, widget: { type: 'categories', items, total }, chips: ['Quanto devo guardar por semana?'] };
    }
    return { text: `No mês você gastou ${formatBRL(total)}. Veja a divisão por categoria:`, widget: { type: 'categories', items, total } };
  }
  if (/(guarda|guardar|separa|poupa)/.test(t) && /(toda|todo|cada|semana|mes|dia)/.test(t)) {
    const amount = parseAmount(t) ?? 50;
    const wd = WEEKDAYS.findIndex((w) => t.includes(w));
    const frequency: Frequency = /mes/.test(t) ? 'mensal' : /quinzen/.test(t) ? 'quinzenal' : 'semanal';
    const vault = ctx.vaults.find((v) => v.saved < v.goal) ?? ctx.vaults[0]!;
    return { text: `Combinado. Vou guardar ${formatBRL(amount)} ${frequency === 'mensal' ? 'todo mês' : frequency === 'quinzenal' ? 'a cada 15 dias' : `toda ${WEEKDAYS[wd >= 0 ? wd : 5]}`} no cofre “${vault.name}”. Confirma?`, widget: { type: 'rule', amount, frequency, weekday: frequency === 'semanal' ? (wd >= 0 ? wd : 5) : undefined, vaultId: vault.id, vaultName: vault.name } };
  }
  if (/(cobranca|cobraram|o que e|que e essa|debito|explica)/.test(t)) {
    const tx = ctx.focusTx ?? ctx.transactions.find((x) => x.category === 'streaming') ?? ctx.transactions[0]!;
    return { text: explain(tx), widget: { type: 'explain', tx } };
  }
  if (/(quanto devo|por semana|guardar por|poupar)/.test(t)) {
    const v = ctx.vaults.filter((x) => x.saved < x.goal).sort((a, b) => a.goal - a.saved - (b.goal - b.saved))[0];
    if (!v) return { text: 'Todas as suas barras estão completas! Que tal criar uma nova meta?' };
    const missing = v.goal - v.saved; const weeks = 26; const weekly = Math.ceil(missing / weeks / 5) * 5;
    return { text: `Olhando seu histórico, você costuma sobrar uns ${formatBRL(weekly * 1.6)} por semana. Guardando ${formatBRL(weekly)} por semana, a barra “${v.name}” fica completa em cerca de ${weeks} semanas.`, widget: { type: 'suggest', weekly, vaultName: v.name, weeksLeft: weeks }, chips: [`Guarda ${weekly} reais toda sexta`] };
  }
  if (/(saldo|quanto tenho)/.test(t)) return { text: `Seu saldo disponível é ${formatBRL(ctx.balance)}. Em cofres você tem ${formatBRL(ctx.vaults.reduce((s, v) => s + v.saved, 0))}.` };
  if (/(duplicad|repetid|igual)/.test(t)) {
    const d = findDuplicate(ctx.transactions);
    return d ? { text: `Encontrei duas cobranças iguais de ${d.title} (${formatBRL(d.amount)}) no mesmo dia.`, widget: { type: 'duplicate', tx: d } } : { text: 'Não encontrei cobranças duplicadas nos últimos 30 dias.' };
  }
  if (/(oi|ola|bom dia|boa tarde|boa noite)/.test(t)) return { text: 'Oi! Eu sou a Áurea. Posso responder sobre seus gastos, criar regras de poupança e explicar qualquer cobrança.', chips: SUGGESTION_CHIPS };
  return { text: 'Ainda estou aprendendo essa. Experimente uma destas perguntas:', chips: SUGGESTION_CHIPS };
}

export function explain(tx: Transaction): string {
  const v = formatBRL(tx.amount);
  switch (tx.channel) {
    case 'cartao': return `“${tx.title}” é uma compra de ${v} no seu cartão Áurea (${tx.detail.toLowerCase()}). ${tx.category === 'streaming' ? 'É a sua assinatura mensal de streaming — renova sozinha todo mês.' : 'Ela entra na sua próxima fatura.'}`;
    case 'pix': return tx.kind === 'entrada' ? `Você recebeu ${v} por Pix: “${tx.detail}”. O dinheiro caiu na hora.` : `Você enviou ${v} por Pix (${tx.detail.toLowerCase()}). Pix é instantâneo e não tem tarifa.`;
    case 'cofre': return `Foram ${v} guardados automaticamente num cofre por uma regra que você criou. O dinheiro continua seu e rende.`;
    case 'ouro': return `Você converteu ${v} em ouro digital (${tx.detail}). O valor acompanha a cotação do grama.`;
    default: return `Pagamento de ${v} via boleto: ${tx.detail}.`;
  }
}
export const thinkDelay = () => 600 + Math.random() * 600;
