'use client';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Bottom sheet de vidro com alça, arrastável para fechar, foco preso e Esc. */
export function GlassSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const controls = useDragControls(); const id = useId(); const ref = useRef<HTMLDivElement>(null); const prev = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return; prev.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>('input,button,[tabindex]')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hasAttribute('disabled'));
        if (!f.length) return; const first = f[0]!, last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); prev.current?.focus?.(); };
  }, [open, onClose]);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.getElementById('aurea-overlay')), []);
  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="pointer-events-auto absolute inset-0">
          <motion.button aria-label="Fechar" className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id}
            className="glass glass-strong absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-lg px-5 pb-8 pt-2"
            style={{ background: 'color-mix(in srgb, var(--ink-800) 82%, transparent)' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            drag="y" dragControls={controls} dragListener={false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 600) onClose(); }}>
            <div onPointerDown={(e) => controls.start(e)} className="mx-auto mb-2 flex h-6 w-24 cursor-grab touch-none items-center justify-center" aria-hidden><span className="h-1.5 w-11 rounded-full bg-gold-200/50" /></div>
            <div className="mb-4 flex items-center justify-between">
              <h2 id={id} className="font-serif text-2xl">{title}</h2>
              <button onClick={onClose} aria-label="Fechar" className="touch grid place-items-center rounded-full text-fg-soft hover:text-fg"><X size={20} strokeWidth={1.5} /></button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>, host,
  );
}
