export type Level = 'bronze' | 'prata' | 'ouro' | 'diamante';
export type Category = 'comida' | 'transporte' | 'mercado' | 'lazer' | 'streaming' | 'saude' | 'contas' | 'salario' | 'pix' | 'cofre' | 'ouro';
export type TxKind = 'entrada' | 'saida';
export type TxChannel = 'pix' | 'cartao' | 'cofre' | 'ouro' | 'boleto';
export interface Transaction { id: string; title: string; detail: string; amount: number; kind: TxKind; channel: TxChannel; category: Category; date: string; }
export type Frequency = 'unica' | 'semanal' | 'quinzenal' | 'mensal';
export interface Vault { id: string; name: string; icon: VaultIcon; goal: number; saved: number; rule?: { amount: number; frequency: Frequency; weekday?: number }; createdAt: string; history: { id: string; date: string; amount: number }[]; }
export type VaultIcon = 'plane' | 'car' | 'shield' | 'home' | 'gift' | 'graduation';
export interface Friend { id: string; name: string; handle: string; level: Level; hue: number; pixKey: string; }
export type Privacy = 'publico' | 'amigos' | 'so-eu';
export interface FeedEvent { id: string; friendId: string; kind: 'barra' | 'nivel' | 'sequencia' | 'ouro' | 'meta'; text: string; date: string; reactions: Record<string, number>; mine?: string[]; comments: { id: string; author: string; text: string }[]; }
export interface User { name: string; firstName: string; cpf: string; handle: string; level: Level; points: number; hue: number; email: string; }
export type { Automation, Reminder, Charge, AutoScope } from './assessor';
export type { Group, GroupMsg, GroupKind } from './groups';
