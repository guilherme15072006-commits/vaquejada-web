'use client';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Gem, Lock, Receipt, Zap } from 'lucide-react';
import type { Transaction } from '@/lib/mock/types';
import { formatBRL, formatTime, cn } from '@/lib/utils/format';
const ICON = { pix: Zap, cartao: CreditCard, cofre: Lock, ouro: Gem, boleto: Receipt } as const;
export function TxRow({ tx, onClick, hidden }: { tx: Transaction; onClick?: () => void; hidden?: boolean }) {
  const I = ICON[tx.channel]; const inn = tx.kind === 'entrada';
  return (
    <button onClick={onClick} className="flex min-h-[60px] w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-white/[0.04]">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--glass-border)] bg-white/[0.04] text-gold-200">
        <I size={18} strokeWidth={1.5} aria-hidden />
        <span className={cn('absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full', inn ? 'bg-success text-ink-900' : 'bg-ink-700 text-fg-soft')}>{inn ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}</span>
      </span>
      <span className="min-w-0 flex-1"><span className="block truncate text-[15px]">{tx.title}</span><span className="block truncate text-xs text-fg-soft">{tx.detail} · {formatTime(tx.date)}</span></span>
      <span className={cn('tabular text-[15px]', inn ? 'text-success' : 'text-fg', hidden && 'blur-[6px]')} aria-label={hidden ? 'valor oculto' : undefined}>{inn ? '+' : '−'} {formatBRL(tx.amount)}</span>
    </button>
  );
}
