import { seeded } from '../utils/random';
export const INITIAL_BALANCE = 8432.57;
/** Rendimento estimado: 100% do CDI simulado (~10,65% a.a.) — apenas simulação, não é promessa */
export const CDI_YEAR = 0.1065;
export const dailyRate = () => Math.pow(1 + CDI_YEAR, 1 / 252) - 1;
export const perSecond = (balance: number) => (balance * dailyRate()) / 86400;
export function yieldSeries(days = 14) {
  const r = seeded(77); const out: number[] = [];
  let base = 2.1; for (let i = 0; i < days; i++) { base += (r() - 0.45) * 0.4; out.push(Math.max(1.2, +base.toFixed(2))); }
  return out;
}
