'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Orb } from '../glass/Orb';
export function AiFab() {
  const p = usePathname() ?? ''; if (p.startsWith('/ia') || p.startsWith('/assessor/whatsapp')) return null;
  return (
    <motion.div className="absolute bottom-[104px] right-4 z-40" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}>
      <Link href="/ia" aria-label="Abrir Áurea IA" className="glass grid h-14 w-14 place-items-center rounded-full"><Orb size={44} /></Link>
    </motion.div>
  );
}
