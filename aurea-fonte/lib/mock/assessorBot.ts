import type { Category } from './types';
/** Intérprete de mensagens estilo WhatsApp (mock por regras). */
export type BotIntent =
  | { kind: 'gasto'; amount: number; title: string; category: Category }
  | { kind: 'lembrete'; title: string; day: number; amount?: number }
  | { kind: 'cobrar'; client: string; amount: number }
  | { kind: 'resumo' } | { kind: 'saldo' } | { kind: 'contas' } | { kind: 'negocio' } | { kind: 'ajuda' };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const num = (t: string) => { const m = t.match(/(\d+(?:[.,]\d{1,2})?)/); return m ? parseFloat(m[1]!.replace(',', '.')) : undefined; };
const CAT: [RegExp, Category][] = [[/almoco|janta|lanche|comida|restaurante|feira|padaria|cafe/, 'comida'], [/uber|onibus|gasolina|taxi|metro/, 'transporte'], [/mercado|supermercado/, 'mercado'], [/remedio|farmacia|medico/, 'saude'], [/cinema|bar|show|festa/, 'lazer']];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export function parseBot(input: string): BotIntent {
  const t = norm(input);
  if (/(lembra|lembrar|avisa)/.test(t)) {
    const day = Number(t.match(/dia (\d{1,2})/)?.[1] ?? new Date().getDate() + 3);
    const title = input.replace(/.*?(pagar|de|do|da)\s+/i, '').replace(/\s*dia \d{1,2}.*$/i, '').replace(/\d+[.,]?\d*\s*(reais)?/i, '').trim() || 'Lembrete';
    return { kind: 'lembrete', title: cap(title), day: Math.min(28, Math.max(1, day)), amount: num(t.replace(/dia \d{1,2}/, '')) };
  }
  if (/(cobra|cobrar|cobranca)/.test(t)) {
    const amount = num(t) ?? 0; const client = input.replace(/.*?cobr\w*\s+(a |o |da |do )?/i, '').replace(/\s*(r\$)?\s*\d+.*$/i, '').trim();
    return { kind: 'cobrar', client: cap(client || 'Cliente'), amount };
  }
  if (/(gastei|paguei|comprei)/.test(t) && num(t)) {
    const cat = CAT.find(([r]) => r.test(t))?.[1] ?? 'lazer'; const what = t.match(/(?:de|no|na|com)\s+([a-z ]+?)(?:\s+em|\s+no|\s*$)/)?.[1]?.trim();
    return { kind: 'gasto', amount: num(t)!, category: cat, title: cap(what || 'Gasto em dinheiro') };
  }
  if (/resumo|semana/.test(t)) return { kind: 'resumo' };
  if (/saldo|quanto tenho/.test(t)) return { kind: 'saldo' };
  if (/contas|vencimento|pagar/.test(t)) return { kind: 'contas' };
  if (/negocio|empresa|mei|caixa|vendas/.test(t)) return { kind: 'negocio' };
  return { kind: 'ajuda' };
}
export const BOT_CHIPS = ['gastei 35 de almoço em dinheiro', 'me lembra de pagar a internet dia 10', 'cobra a Padaria Pão Dourado 850', 'resumo da semana', 'como está o negócio?', 'quais contas vencem?'];
