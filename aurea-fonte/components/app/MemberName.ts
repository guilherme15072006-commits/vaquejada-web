import { friendById } from '@/lib/mock/friends';
export const memberName = (id: string, me = 'Você') => id === 'eu' ? me : friendById(id)?.name.split(' ')[0] ?? id;
export const memberHue = (id: string, myHue: number) => id === 'eu' ? myHue : friendById(id)?.hue ?? 40;
