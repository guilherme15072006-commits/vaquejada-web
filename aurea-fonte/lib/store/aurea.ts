'use client';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INITIAL_BALANCE } from '../mock/balance';
import { FEED } from '../mock/feed';
import { GOLD_PRICE, INITIAL_GOLD_GRAMS } from '../mock/gold';
import { TRANSACTIONS } from '../mock/transactions';
import { USER } from '../mock/user';
import { VAULTS } from '../mock/vaults';
import type { FeedEvent, Frequency, Privacy, Transaction, User, Vault, VaultIcon } from '../mock/types';
import { safeStorage } from '../utils/storage';
import { uid } from '../utils/format';

export interface ToastMsg { id: string; title: string; body?: string; tone?: 'gold' | 'success' | 'danger' }
type Result = { ok: true } | { ok: false; error: string };

interface State {
  authed: boolean; onboarded: boolean;
  user: User; balance: number; hideBalance: boolean;
  vaults: Vault[]; transactions: Transaction[]; goldGrams: number;
  feed: FeedEvent[]; privacy: Privacy;
  cardLocked: boolean; cardLimit: number; cardUsed: number;
  reduceTransparency: boolean; reduceMotion: boolean;
  dismissedAlerts: string[]; aiQuestions: number;
  toasts: ToastMsg[];
  login: () => void; logout: () => void; finishOnboarding: () => void;
  toggleHide: () => void;
  createVault: (v: { name: string; icon: VaultIcon; goal: number; initial: number; rule?: { amount: number; frequency: Frequency; weekday?: number } }) => Result & { id?: string };
  deposit: (vaultId: string, amount: number) => Result;
  withdraw: (vaultId: string, amount: number) => Result;
  setRule: (vaultId: string, rule: { amount: number; frequency: Frequency; weekday?: number }) => void;
  addCashExpense: (p: { title: string; amount: number; category: Transaction['category'] }) => Result;
  sendPix: (p: { to: string; amount: number; message?: string; attachment?: string }) => Result;
  buyGold: (amount: number) => Result;
  sellGold: (grams: number) => Result;
  react: (eventId: string, emoji: string) => void;
  comment: (eventId: string, text: string) => void;
  setPrivacy: (p: Privacy) => void;
  toggleCard: () => void;
  setReduceTransparency: (v: boolean) => void; setReduceMotion: (v: boolean) => void;
  dismissAlert: (id: string) => void; contestTx: (id: string) => void; countAi: () => void;
  toast: (t: Omit<ToastMsg, 'id'>) => void; dropToast: (id: string) => void;
  reset: () => void;
}

const initial = () => ({
  authed: false, onboarded: false, user: USER, balance: INITIAL_BALANCE, hideBalance: false,
  vaults: VAULTS, transactions: TRANSACTIONS, goldGrams: INITIAL_GOLD_GRAMS, feed: FEED, privacy: 'amigos' as Privacy,
  cardLocked: false, cardLimit: 7500, cardUsed: 2318.4, reduceTransparency: false, reduceMotion: false,
  dismissedAlerts: [] as string[], aiQuestions: 1, toasts: [] as ToastMsg[],
});
const r2 = (n: number) => Math.round(n * 100) / 100;
const valid = (n: number) => Number.isFinite(n) && n > 0;
const tx = (p: Omit<Transaction, 'id' | 'date'>): Transaction => ({ ...p, id: uid(), date: new Date().toISOString() });

export const useAurea = create<State>()(persist((set, get) => ({
  ...initial(),
  login: () => set({ authed: true }),
  logout: () => set({ authed: false }),
  finishOnboarding: () => set({ onboarded: true }),
  toggleHide: () => set((s) => ({ hideBalance: !s.hideBalance })),
  createVault: ({ name, icon, goal, initial: init, rule }) => {
    const s = get(); const clean = name.trim();
    if (clean.length < 2) return { ok: false, error: 'Dê um nome com pelo menos 2 letras.' };
    if (!valid(goal)) return { ok: false, error: 'Defina uma meta maior que zero.' };
    if (init < 0 || init > s.balance) return { ok: false, error: 'Saldo insuficiente para o valor inicial.' };
    if (init > goal) return { ok: false, error: 'O valor inicial passa da meta.' };
    const id = `${clean.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${uid().slice(0, 4)}`;
    const v: Vault = { id, name: clean, icon, goal: r2(goal), saved: r2(init), rule, createdAt: new Date().toISOString(), history: init ? [{ id: uid(), date: new Date().toISOString(), amount: r2(init) }] : [] };
    set({ vaults: [v, ...s.vaults], balance: r2(s.balance - init), transactions: init ? [tx({ title: `Cofre ${clean}`, detail: 'Valor inicial', amount: r2(init), kind: 'saida', channel: 'cofre', category: 'cofre' }), ...s.transactions] : s.transactions });
    return { ok: true, id };
  },
  deposit: (vaultId, amount) => {
    const s = get(); const v = s.vaults.find((x) => x.id === vaultId);
    if (!v) return { ok: false, error: 'Cofre não encontrado.' };
    if (!valid(amount)) return { ok: false, error: 'Informe um valor válido.' };
    if (amount > s.balance) return { ok: false, error: 'Saldo insuficiente.' };
    const a = r2(amount);
    set({
      balance: r2(s.balance - a),
      vaults: s.vaults.map((x) => x.id === vaultId ? { ...x, saved: r2(x.saved + a), history: [{ id: uid(), date: new Date().toISOString(), amount: a }, ...x.history] } : x),
      transactions: [tx({ title: `Cofre ${v.name}`, detail: 'Guardado manualmente', amount: a, kind: 'saida', channel: 'cofre', category: 'cofre' }), ...s.transactions],
    });
    return { ok: true };
  },
  withdraw: (vaultId, amount) => {
    const s = get(); const v = s.vaults.find((x) => x.id === vaultId);
    if (!v) return { ok: false, error: 'Cofre não encontrado.' };
    if (!valid(amount) || amount > v.saved) return { ok: false, error: 'Valor acima do que há no cofre.' };
    set({
      balance: r2(s.balance + amount),
      vaults: s.vaults.map((x) => x.id === vaultId ? { ...x, saved: r2(x.saved - amount), history: [{ id: uid(), date: new Date().toISOString(), amount: -r2(amount) }, ...x.history] } : x),
      transactions: [tx({ title: `Resgate ${v.name}`, detail: 'Resgate do cofre', amount: r2(amount), kind: 'entrada', channel: 'cofre', category: 'cofre' }), ...s.transactions],
    });
    return { ok: true };
  },
  setRule: (vaultId, rule) => set((s) => ({ vaults: s.vaults.map((x) => x.id === vaultId ? { ...x, rule } : x) })),
  addCashExpense: ({ title, amount, category }) => {
    if (!valid(amount)) return { ok: false, error: 'Valor inválido.' };
    set((s) => ({ transactions: [tx({ title, detail: 'Dinheiro vivo · registrado pelo assessor', amount: r2(amount), kind: 'saida', channel: 'boleto', category }), ...s.transactions] }));
    return { ok: true };
  },
  sendPix: ({ to, amount, message }) => {
    const s = get();
    if (!to.trim()) return { ok: false, error: 'Escolha um contato ou chave.' };
    if (!valid(amount)) return { ok: false, error: 'Informe um valor.' };
    if (amount > s.balance) return { ok: false, error: 'Saldo insuficiente.' };
    set({ balance: r2(s.balance - amount), transactions: [tx({ title: `Pix para ${to}`, detail: message?.trim() || 'Pix enviado', amount: r2(amount), kind: 'saida', channel: 'pix', category: 'pix' }), ...s.transactions] });
    return { ok: true };
  },
  buyGold: (amount) => {
    const s = get();
    if (!valid(amount) || amount < 1) return { ok: false, error: 'O mínimo é R$ 1,00.' };
    if (amount > s.balance) return { ok: false, error: 'Saldo insuficiente.' };
    const g = amount / GOLD_PRICE;
    set({ balance: r2(s.balance - amount), goldGrams: +(s.goldGrams + g).toFixed(4), transactions: [tx({ title: 'Compra de ouro digital', detail: `${g.toFixed(3).replace('.', ',')} g`, amount: r2(amount), kind: 'saida', channel: 'ouro', category: 'ouro' }), ...s.transactions] });
    return { ok: true };
  },
  sellGold: (grams) => {
    const s = get();
    if (!valid(grams) || grams > s.goldGrams) return { ok: false, error: 'Você não tem esse tanto de ouro.' };
    const v = r2(grams * GOLD_PRICE);
    set({ balance: r2(s.balance + v), goldGrams: +(s.goldGrams - grams).toFixed(4), transactions: [tx({ title: 'Venda de ouro digital', detail: `${grams.toFixed(3).replace('.', ',')} g`, amount: v, kind: 'entrada', channel: 'ouro', category: 'ouro' }), ...s.transactions] });
    return { ok: true };
  },
  react: (eventId, emoji) => set((s) => ({ feed: s.feed.map((e) => {
    if (e.id !== eventId) return e; const mine = e.mine ?? []; const has = mine.includes(emoji);
    return { ...e, mine: has ? mine.filter((m) => m !== emoji) : [...mine, emoji], reactions: { ...e.reactions, [emoji]: Math.max(0, (e.reactions[emoji] ?? 0) + (has ? -1 : 1)) } };
  }) })),
  comment: (eventId, text) => { const t = text.trim().slice(0, 140); if (!t) return; set((s) => ({ feed: s.feed.map((e) => e.id === eventId ? { ...e, comments: [...e.comments, { id: uid(), author: s.user.firstName, text: t }] } : e) })); },
  setPrivacy: (privacy) => set({ privacy }),
  toggleCard: () => set((s) => ({ cardLocked: !s.cardLocked })),
  setReduceTransparency: (v) => set({ reduceTransparency: v }),
  setReduceMotion: (v) => set({ reduceMotion: v }),
  dismissAlert: (id) => set((s) => ({ dismissedAlerts: [...new Set([...s.dismissedAlerts, id])] })),
  contestTx: (id) => {
    const s = get(); const t = s.transactions.find((x) => x.id === id); if (!t) return;
    set({ dismissedAlerts: [...s.dismissedAlerts, id], balance: r2(s.balance + t.amount), transactions: [tx({ title: `Estorno ${t.title}`, detail: 'Contestação aprovada (simulada)', amount: t.amount, kind: 'entrada', channel: 'cartao', category: t.category }), ...s.transactions] });
  },
  countAi: () => set((s) => ({ aiQuestions: s.aiQuestions + 1 })),
  toast: (t) => { const id = uid(); set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] })); setTimeout(() => get().dropToast(id), 3600); },
  dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  reset: () => set({ ...initial(), authed: true, onboarded: true }),
}), {
  name: 'aurea-proto-v1', version: 1, storage: createJSONStorage(() => safeStorage),
  partialize: ({ toasts: _t, ...rest }) => rest,
}));

export const useHydrated = () => {
  // evita flash de estado default antes da reidratação do localStorage
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useAurea.persist.onFinishHydration(() => setH(true));
    if (useAurea.persist.hasHydrated()) setH(true);
    return unsub;
  }, []);
  return h;
};
