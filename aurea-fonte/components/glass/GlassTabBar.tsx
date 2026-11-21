'use client';
import { motion } from 'framer-motion';
import { Home, Lock, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/format';

const ITEMS = [
  { href: '/home', label: 'Início', Icon: Home },
  { href: '/cofres', label: 'Cofres', Icon: Lock },
  { href: '/pix', label: 'Pix', Icon: null },
  { href: '/social', label: 'Social', Icon: Users },
  { href: '/perfil', label: 'Perfil', Icon: User },
] as const;

function PixDrop() {
  return (
    <svg viewBox="0 0 40 48" className="h-8 w-7" aria-hidden>
      <path d="M20 2 C 28 14 36 22 36 31 A16 16 0 0 1 4 31 C 4 22 12 14 20 2Z" fill="url(#aurea-gold)" stroke="rgba(255,244,204,.8)" strokeWidth="1" />
      <path d="M13 30 l7 -7 l7 7 l-7 7z" fill="none" stroke="#2A1F05" strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="14" cy="24" rx="3" ry="5" fill="rgba(255,255,255,.55)" transform="rotate(25 14 24)" />
    </svg>
  );
}

export function GlassTabBar() {
  const path = usePathname() ?? '';
  const active = ITEMS.findIndex((i) => path.startsWith(i.href));
  return (
    <nav aria-label="Navegação principal" className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="glass glass-strong pointer-events-auto relative mx-auto flex h-[68px] max-w-[420px] items-center justify-around rounded-lg px-2">
        {ITEMS.map((it, i) => {
          const on = i === active;
          if (!it.Icon) return (
            <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined} aria-label="Pix" className="relative -mt-8 grid h-16 w-16 place-items-center rounded-full">
              <motion.span whileTap={{ scale: 0.92 }} className="glass glass-gold grid h-16 w-16 place-items-center rounded-full shadow-[0_12px_30px_-8px_rgba(212,175,55,.7)]"><PixDrop /></motion.span>
            </Link>
          );
          const I = it.Icon;
          return (
            <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined} className={cn('relative flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-sm text-[11px] transition-colors', on ? 'text-fg-gold' : 'text-fg-soft hover:text-fg')}>
              <I size={22} strokeWidth={1.5} aria-hidden />
              <span>{it.label}</span>
              {on && <motion.span layoutId="tab-drop" transition={{ type: 'spring', stiffness: 420, damping: 30 }} className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-gold-200 shadow-[0_0_10px_2px_rgba(245,215,122,.8)]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
