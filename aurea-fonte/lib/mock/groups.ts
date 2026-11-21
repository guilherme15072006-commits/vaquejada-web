export type GroupKind = 'meta' | 'desafio' | 'casa' | 'viagem';
export interface GroupMsg { id: string; author: string; text: string; date: string; system?: boolean; sticker?: string }
export interface Group {
  id: string; name: string; emoji: string; kind: GroupKind; members: string[]; // ids de amigos + 'eu'
  goal?: number; saved?: number; contributions?: Record<string, number>;
  challenge?: { title: string; weeks: number; week: number; streaks: Record<string, number> };
  bills?: { id: string; title: string; amount: number; paidBy: string[] }[];
  messages: GroupMsg[];
}
const h = (n: number) => new Date(Date.now() - n * 3600000).toISOString();
export const GROUPS: Group[] = [
  { id: 'g-noronha', name: 'Noronha 2027', emoji: '🏝️', kind: 'viagem', members: ['eu', 'ana', 'pedro', 'bia'], goal: 16000, saved: 9840,
    contributions: { eu: 2600, ana: 2900, pedro: 2140, bia: 2200 },
    messages: [
      { id: 'm1', author: 'ana', text: 'Gente, achei pousada com café incluso 😍', date: h(30) },
      { id: 'm2', author: 'sys', text: 'Pedro guardou na barra do grupo', date: h(20), system: true },
      { id: 'm3', author: 'bia', text: 'Bora bater 70% até o fim do mês!', date: h(5), sticker: '🔥' },
    ] },
  { id: 'g-52', name: 'Desafio 52 semanas', emoji: '🏆', kind: 'desafio', members: ['eu', 'joao', 'carol', 'rafa', 'gabi', 'lucas'],
    challenge: { title: 'Guardar toda semana, sem pular', weeks: 52, week: 19, streaks: { eu: 18, joao: 12, carol: 19, rafa: 7, gabi: 15, lucas: 3 } },
    messages: [
      { id: 'm4', author: 'carol', text: 'Semana 19 ✅ ninguém me para', date: h(10) },
      { id: 'm5', author: 'sys', text: 'Lucas perdeu a sequência. Bora voltar, Lucas!', date: h(8), system: true },
    ] },
  { id: 'g-ape', name: 'Apê 302', emoji: '🏠', kind: 'casa', members: ['eu', 'joao', 'rafa'],
    bills: [
      { id: 'b1', title: 'Aluguel', amount: 2700, paidBy: ['eu', 'rafa'] },
      { id: 'b2', title: 'Condomínio', amount: 540, paidBy: ['eu', 'joao', 'rafa'] },
      { id: 'b3', title: 'Internet', amount: 120, paidBy: ['joao'] },
      { id: 'b4', title: 'Mercado do mês', amount: 960, paidBy: [] },
    ],
    messages: [{ id: 'm6', author: 'rafa', text: 'Já paguei minha parte do aluguel', date: h(26) }] },
];
