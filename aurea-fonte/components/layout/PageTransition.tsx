'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
/** Conteúdo atravessa a água: leve blur + deslocamento + escala 0,98 → 1. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={path} className="h-full"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99, filter: 'blur(6px)' }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
