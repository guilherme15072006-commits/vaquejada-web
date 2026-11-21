'use client';
import { useEffect } from 'react';
import { useAurea } from '@/lib/store/aurea';
import { WaterFilterDefs } from '../effects/WaterRefraction';
import { PointerTracker } from '../effects/SpecularHighlight';
import { GoldDust } from '../effects/GoldDust';

export function Providers({ children }: { children: React.ReactNode }) {
  const rt = useAurea((s) => s.reduceTransparency); const rm = useAurea((s) => s.reduceMotion);
  useEffect(() => { const h = document.documentElement; if (rt) h.dataset.transparency = 'reduced'; else delete h.dataset.transparency; }, [rt]);
  useEffect(() => { const h = document.documentElement; if (rm) h.dataset.motion = 'reduced'; else delete h.dataset.motion; }, [rm]);
  return (<><WaterFilterDefs /><PointerTracker />{!rt && <GoldDust />}{children}</>);
}
