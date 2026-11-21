import type { FeedEvent } from './types';
const h = (n: number) => new Date(Date.now() - n * 3600000).toISOString();
const e = (id: string, friendId: string, kind: FeedEvent['kind'], text: string, hrs: number, r: Record<string, number> = {}, comments: FeedEvent['comments'] = []): FeedEvent => ({ id, friendId, kind, text, date: h(hrs), reactions: r, comments });
export const FEED: FeedEvent[] = [
  e('f1', 'ana', 'barra', 'completou a barra Viagem para Noronha', 1, { '🏆': 12, '✨': 5 }, [{ id: 'c1', author: 'Pedro', text: 'Que orgulho!' }]),
  e('f2', 'pedro', 'nivel', 'subiu para o nível Ouro', 3, { '👑': 9 }),
  e('f3', 'bia', 'sequencia', 'poupou 12 semanas seguidas', 5, { '🔥': 18, '💛': 4 }),
  e('f4', 'joao', 'meta', 'criou um cofre para a primeira moto', 8, { '💪': 3 }),
  e('f5', 'rafa', 'ouro', 'guardou o primeiro grama de ouro digital', 11, { '✨': 7 }),
  e('f6', 'carol', 'barra', 'completou a barra Reserva de emergência', 20, { '🏆': 15 }, [{ id: 'c2', author: 'Ana', text: 'Segurança total!' }]),
  e('f7', 'lucas', 'nivel', 'conquistou o nível Bronze', 26, { '👏': 6 }),
  e('f8', 'gabi', 'sequencia', 'pagou todas as contas em dia por 3 meses', 30, { '💛': 8 }),
  e('f9', 'bia', 'nivel', 'chegou ao nível Diamante', 44, { '💎': 22, '👑': 10 }),
  e('f10', 'ana', 'meta', 'bateu 50% da meta Apartamento', 52, { '🔥': 9 }),
  e('f11', 'pedro', 'sequencia', 'poupou 4 semanas seguidas', 60, { '💪': 4 }),
  e('f12', 'joao', 'barra', 'completou a barra Notebook novo', 75, { '🏆': 11 }),
  e('f13', 'rafa', 'meta', 'automatizou "guardar toda sexta"', 90, { '✨': 3 }),
  e('f14', 'carol', 'ouro', 'completou 5 gramas de ouro digital', 110, { '👑': 13 }),
  e('f15', 'gabi', 'meta', 'criou o cofre Intercâmbio', 130, { '💛': 2 }),
];
