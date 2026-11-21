import type { Frequency } from '../mock/types';
export const WEEKDAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const freqLabel = (f: Frequency, wd?: number) => f === 'semanal' ? `toda ${WEEKDAY_NAMES[wd ?? 5]}` : f === 'quinzenal' ? 'a cada 15 dias' : f === 'mensal' ? 'todo mês' : 'uma vez';
