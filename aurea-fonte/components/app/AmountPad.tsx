'use client';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { formatBRL } from '@/lib/utils/format';
/** Teclado numérico de vidro. Valor em centavos (inteiro). */
export function AmountPad({ cents, onChange, max = 99_999_999 }: { cents: number; onChange: (c: number) => void; max?: number }) {
  const press = (k: string) => {
    if (k === 'del') return onChange(Math.floor(cents / 10));
    const next = k === '00' ? cents * 100 : cents * 10 + Number(k);
    if (next <= max) onChange(next);
  };
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Teclado numérico">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'].map((k) => (
        <motion.button key={k} type="button" whileTap={{ scale: 0.94 }} onClick={() => press(k)} aria-label={k === 'del' ? 'Apagar' : k}
          className="glass grid h-14 place-items-center rounded-sm text-2xl tabular">{k === 'del' ? <Delete size={22} strokeWidth={1.5} className="relative z-[1]" /> : <span className="relative z-[1]">{k}</span>}</motion.button>
      ))}
    </div>
  );
}
export function AmountDisplay({ cents, hint, error }: { cents: number; hint?: string; error?: string }) {
  return (
    <div className="py-3 text-center" aria-live="polite">
      <p className={`font-serif text-5xl tabular ${cents ? 'text-gold-metal' : 'text-white/30'}`}>{formatBRL(cents / 100)}</p>
      {(error || hint) && <p className={`mt-1 text-sm ${error ? 'text-danger' : 'text-fg-soft'}`}>{error ?? hint}</p>}
    </div>
  );
}
