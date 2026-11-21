const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatBRL = (v: number) => brl.format(v);
export const formatGrams = (g: number) => `${g.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} g`;
export const formatPct = (v: number) => `${(v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
export const formatDay = (iso: string) => {
  const d = new Date(iso); const today = new Date(); const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hoje';
  if (d.toDateString() === y.toDateString()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
};
export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
export const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
export const uid = () => Math.random().toString(36).slice(2, 10);
