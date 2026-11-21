'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useAurea } from '@/lib/store/aurea';
import { cn } from '@/lib/utils/format';
/** Toasts de vidro que entram como uma gota caindo. */
export function ToastHost() {
  const toasts = useAurea((s) => s.toasts); const drop = useAurea((s) => s.dropToast);
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button key={t.id} onClick={() => drop(t.id)} layout
            initial={{ y: -80, scaleY: 1.4, scaleX: 0.6, opacity: 0, borderRadius: 999 }}
            animate={{ y: 0, scaleY: 1, scaleX: 1, opacity: 1, borderRadius: 22 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className={cn('glass glass-strong pointer-events-auto w-full max-w-[360px] px-4 py-3 text-left', t.tone === 'danger' && 'ring-1 ring-danger/40')}>
            <p className={cn('relative z-[1] text-sm font-semibold', t.tone === 'danger' ? 'text-danger' : t.tone === 'success' ? 'text-success' : 'text-fg-gold')}>{t.title}</p>
            {t.body && <p className="relative z-[1] mt-0.5 text-[13px] text-fg-soft">{t.body}</p>}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
