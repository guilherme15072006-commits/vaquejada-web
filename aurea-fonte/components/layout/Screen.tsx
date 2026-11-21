'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProtoFooter } from './ProtoFooter';
import { cn } from '@/lib/utils/format';
/** Tela rolável dentro do aparelho, com cabeçalho opcional e espaço para TabBar. */
export function Screen({ title, back, action, children, className, padBottom = true }: { title?: string; back?: boolean | string; action?: React.ReactNode; children: React.ReactNode; className?: string; padBottom?: boolean }) {
  const router = useRouter();
  return (
    <main className={cn('no-scrollbar h-full overflow-y-auto overscroll-contain', padBottom && 'pb-32')}>
      {title && (
        <header className="sticky top-0 z-30 flex items-center gap-2 px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]" style={{ background: 'linear-gradient(180deg, var(--ink-900) 55%, transparent)' }}>
          {back && <button onClick={() => (typeof back === 'string' ? router.push(back) : router.back())} aria-label="Voltar" className="touch -ml-2 grid place-items-center rounded-full text-fg-soft hover:text-fg"><ChevronLeft size={24} strokeWidth={1.5} /></button>}
          <h1 className="flex-1 font-serif text-[28px] leading-tight">{title}</h1>
          {action}
        </header>
      )}
      <div className={cn('px-4', className)}>{children}</div>
      <ProtoFooter />
    </main>
  );
}
