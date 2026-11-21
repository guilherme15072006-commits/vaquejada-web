import type { Vault } from './types';
const d = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
export const VAULTS: Vault[] = [
  { id: 'viagem', name: 'Viagem Lisboa', icon: 'plane', goal: 12000, saved: 7350, rule: { amount: 150, frequency: 'semanal', weekday: 5 }, createdAt: d(120),
    history: [{ id: 'h1', date: d(2), amount: 150 }, { id: 'h2', date: d(9), amount: 150 }, { id: 'h3', date: d(16), amount: 400 }, { id: 'h4', date: d(23), amount: 150 }] },
  { id: 'reserva', name: 'Reserva de emergência', icon: 'shield', goal: 6000, saved: 6000, createdAt: d(300),
    history: [{ id: 'h5', date: d(5), amount: 500 }, { id: 'h6', date: d(35), amount: 800 }] },
  { id: 'carro', name: 'Carro novo', icon: 'car', goal: 40000, saved: 9800, rule: { amount: 600, frequency: 'mensal' }, createdAt: d(200),
    history: [{ id: 'h7', date: d(1), amount: 600 }, { id: 'h8', date: d(31), amount: 600 }] },
  { id: 'curso', name: 'Pós-graduação', icon: 'graduation', goal: 8000, saved: 1240, rule: { amount: 50, frequency: 'semanal', weekday: 5 }, createdAt: d(40),
    history: [{ id: 'h9', date: d(3), amount: 50 }] },
];
