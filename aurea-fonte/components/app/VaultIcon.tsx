import { Car, Gift, GraduationCap, Home, Plane, ShieldCheck } from 'lucide-react';
import type { VaultIcon as V } from '@/lib/mock/types';
export const VAULT_ICONS: Record<V, typeof Plane> = { plane: Plane, car: Car, shield: ShieldCheck, home: Home, gift: Gift, graduation: GraduationCap };
export function VaultIcon({ icon, size = 18 }: { icon: V; size?: number }) { const I = VAULT_ICONS[icon]; return <I size={size} strokeWidth={1.5} aria-hidden />; }
