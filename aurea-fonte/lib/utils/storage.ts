import type { StateStorage } from 'zustand/middleware';
/** localStorage blindado: navegação privada / bloqueio não quebra o protótipo */
const mem = new Map<string, string>();
export const safeStorage: StateStorage = {
  getItem: (k) => { try { return window.localStorage.getItem(k); } catch { return mem.get(k) ?? null; } },
  setItem: (k, v) => { try { window.localStorage.setItem(k, v); } catch { mem.set(k, v); } },
  removeItem: (k) => { try { window.localStorage.removeItem(k); } catch { mem.delete(k); } },
};
