'use client';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassSheet, GoldButton } from '@/components/glass';
import { CATEGORY_LABEL } from '@/lib/mock/transactions';
import type { Transaction } from '@/lib/mock/types';
import { formatBRL } from '@/lib/utils/format';
const CH = { pix: 'Pix', cartao: 'Cartão', cofre: 'Cofre', ouro: 'Ouro digital', boleto: 'Boleto' };
export function TxSheet({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  const router = useRouter();
  return (
    <GlassSheet open={!!tx} onClose={onClose} title="Detalhes">
      {tx && (<>
        <p className="text-sm text-fg-soft">{tx.title}</p>
        <p className={`mt-1 font-serif text-4xl tabular ${tx.kind === 'entrada' ? 'text-success' : 'text-gold-metal'}`}>{tx.kind === 'entrada' ? '+' : '−'} {formatBRL(tx.amount)}</p>
        <dl className="mt-5 divide-y divide-white/5 text-sm">
          {[['Descrição', tx.detail], ['Categoria', CATEGORY_LABEL[tx.category]], ['Meio', CH[tx.channel]], ['Data', new Date(tx.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })], ['Identificador', tx.id.toUpperCase()]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-fg-soft">{k}</dt><dd className="text-right">{v}</dd></div>
          ))}
        </dl>
        <GoldButton block className="mt-5" onClick={() => router.push(`/ia?tx=${tx.id}`)}><Sparkles size={18} strokeWidth={1.5} /> Perguntar à Áurea IA</GoldButton>
      </>)}
    </GlassSheet>
  );
}
