import { seeded } from '../utils/random';
import type { Category, Transaction, TxChannel } from './types';
const R = seeded(2026);
const T: { title: string; detail: string; category: Category; channel: TxChannel; min: number; max: number; kind: 'entrada' | 'saida' }[] = [
  { title: 'iFood', detail: 'Restaurante Sabor da Terra', category: 'comida', channel: 'cartao', min: 28, max: 92, kind: 'saida' },
  { title: 'Padaria Pão Dourado', detail: 'Compra no débito', category: 'comida', channel: 'cartao', min: 9, max: 34, kind: 'saida' },
  { title: 'Uber', detail: 'Viagem — Centro', category: 'transporte', channel: 'cartao', min: 14, max: 48, kind: 'saida' },
  { title: 'Supermercado Bom Preço', detail: 'Compra no crédito', category: 'mercado', channel: 'cartao', min: 80, max: 340, kind: 'saida' },
  { title: 'Cinema Estação', detail: 'Ingressos', category: 'lazer', channel: 'cartao', min: 36, max: 74, kind: 'saida' },
  { title: 'Farmácia Vida', detail: 'Compra no crédito', category: 'saude', channel: 'cartao', min: 22, max: 120, kind: 'saida' },
  { title: 'Pix para João Pedro', detail: 'Racha do almoço', category: 'pix', channel: 'pix', min: 20, max: 80, kind: 'saida' },
  { title: 'Pix de Ana Luiza', detail: 'Ingresso do show', category: 'pix', channel: 'pix', min: 40, max: 160, kind: 'entrada' },
  { title: 'Conta de luz', detail: 'Boleto — Energia', category: 'contas', channel: 'boleto', min: 140, max: 210, kind: 'saida' },
];
const iso = (daysAgo: number, h: number) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(h, Math.floor(R() * 60), 0, 0); return d.toISOString(); };
function build(): Transaction[] {
  const list: Transaction[] = [];
  list.push({ id: 't-sal', title: 'Salário — Studio Norte', detail: 'Crédito em conta', amount: 6800, kind: 'entrada', channel: 'pix', category: 'salario', date: iso(6, 8) });
  // duas cobranças iguais de streaming — base do alerta proativo da IA
  list.push({ id: 't-str1', title: 'StreamFlix', detail: 'Assinatura mensal', amount: 39.9, kind: 'saida', channel: 'cartao', category: 'streaming', date: iso(3, 2) });
  list.push({ id: 't-str2', title: 'StreamFlix', detail: 'Assinatura mensal', amount: 39.9, kind: 'saida', channel: 'cartao', category: 'streaming', date: iso(3, 2) });
  list.push({ id: 't-cof', title: 'Cofre Viagem Lisboa', detail: 'Regra: toda sexta', amount: 150, kind: 'saida', channel: 'cofre', category: 'cofre', date: iso(2, 9) });
  list.push({ id: 't-ouro', title: 'Compra de ouro digital', detail: '0,312 g', amount: 120, kind: 'saida', channel: 'ouro', category: 'ouro', date: iso(10, 14) });
  while (list.length < 40) {
    const t = T[Math.floor(R() * T.length)]!;
    const amount = +(t.min + R() * (t.max - t.min)).toFixed(2);
    list.push({ id: `t${list.length}`, title: t.title, detail: t.detail, amount, kind: t.kind, channel: t.channel, category: t.category, date: iso(Math.floor(R() * 30), 7 + Math.floor(R() * 15)) });
  }
  return list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
export const TRANSACTIONS = build();
export const CATEGORY_LABEL: Record<Category, string> = { comida: 'Comida', transporte: 'Transporte', mercado: 'Mercado', lazer: 'Lazer', streaming: 'Streaming', saude: 'Saúde', contas: 'Contas', salario: 'Salário', pix: 'Pix', cofre: 'Cofres', ouro: 'Ouro' };
export const CATEGORY_COLOR: Record<Category, string> = { comida: '#F5D77A', transporte: '#C9A44A', mercado: '#E8C15A', lazer: '#8C6A1C', streaming: '#FFF4CC', saude: '#B8912A', contas: '#6E5418', salario: '#7FE0A8', pix: '#D4AF37', cofre: '#F5D77A', ouro: '#D4AF37' };
