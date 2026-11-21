import type { Level, User } from './types';
export const USER: User = { name: 'Marina Albuquerque', firstName: 'Marina', cpf: '***.482.917-**', handle: '@marina.alb', level: 'ouro', points: 2840, hue: 38, email: 'marina@exemplo.com' };
export const LEVELS: { id: Level; name: string; min: number; color: [string, string, string]; perks: string[] }[] = [
  { id: 'bronze', name: 'Bronze', min: 0, color: ['#F3C9A0', '#B87333', '#6E3F1A'], perks: ['Conta que rende', 'Cofres ilimitados'] },
  { id: 'prata', name: 'Prata', min: 1000, color: ['#F4F6F8', '#B8BEC6', '#6B7380'], perks: ['+R$ 500 de limite', 'Pix agendado grátis'] },
  { id: 'ouro', name: 'Ouro', min: 2500, color: ['#FFF4CC', '#D4AF37', '#8C6A1C'], perks: ['+R$ 1.500 de limite', 'Taxa de saque 0', 'Cartão Áurea Black'] },
  { id: 'diamante', name: 'Diamante', min: 5000, color: ['#F2FBFF', '#9FD8F2', '#3C7FA0'], perks: ['Gerente dedicado', 'Cartão de metal', 'Taxas mínimas no ouro'] },
];
export const levelOf = (points: number) => [...LEVELS].reverse().find((l) => points >= l.min) ?? LEVELS[0]!;
export const nextLevel = (points: number) => LEVELS.find((l) => l.min > points);
export const MISSIONS = [
  { id: 'm1', title: 'Pagar todas as contas em dia', detail: '3 de 3 neste mês', progress: 1, points: 300 },
  { id: 'm2', title: 'Poupar 4 semanas seguidas', detail: '3 de 4 semanas', progress: 0.75, points: 400 },
  { id: 'm3', title: 'Conversar com a Áurea IA', detail: '1 de 5 perguntas', progress: 0.2, points: 100 },
  { id: 'm4', title: 'Completar uma barra de ouro', detail: 'Reserva concluída', progress: 1, points: 500 },
  { id: 'm5', title: 'Comprar ouro digital', detail: 'qualquer valor a partir de R$ 1', progress: 0, points: 150 },
];
