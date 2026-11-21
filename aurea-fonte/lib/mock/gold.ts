import { seeded } from '../utils/random';
/** Série do grama do ouro (R$) — random walk com semente fixa, 365 dias */
function series() {
  const r = seeded(1971); let p = 452; const out: { t: number; price: number }[] = [];
  const now = Date.now();
  for (let i = 364; i >= 0; i--) { p *= 1 + (r() - 0.47) * 0.018; out.push({ t: now - i * 86400000, price: +p.toFixed(2) }); }
  return out;
}
export const GOLD_SERIES = series();
export const GOLD_PRICE = GOLD_SERIES[GOLD_SERIES.length - 1]!.price;
export const goldRange = (r: '7d' | '30d' | '1a') => GOLD_SERIES.slice(r === '7d' ? -7 : r === '30d' ? -30 : 0);
export const INITIAL_GOLD_GRAMS = 1.842;
