'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { PageTransition } from '@/components/layout/PageTransition';
import { GlassTabBar } from '@/components/glass/GlassTabBar';
import { AiFab } from '@/components/layout/AiFab';
import { ShimmerSkeleton } from '@/components/glass/ShimmerSkeleton';
import { useAurea, useHydrated } from '@/lib/store/aurea';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated(); const authed = useAurea((s) => s.authed); const router = useRouter();
  useEffect(() => { if (hydrated && !authed) router.replace('/login'); }, [hydrated, authed, router]);
  return (
    <DeviceFrame>
      {hydrated && authed ? <PageTransition>{children}</PageTransition> : (
        <div className="space-y-4 p-4 pt-12" aria-busy="true" aria-label="Carregando"><ShimmerSkeleton className="h-10 w-2/3" /><ShimmerSkeleton className="h-48 w-full rounded-lg" /><ShimmerSkeleton className="h-20 w-full" /><ShimmerSkeleton className="h-20 w-full" /></div>
      )}
      <AiFab />
      <GlassTabBar />
    </DeviceFrame>
  );
}
