'use client';
import { useEffect, useState } from 'react';
import { perSecond } from '@/lib/mock/balance';
/** Rendimento estimado “ao vivo” do dia (simulação) — atualiza a cada segundo. */
export function useLiveYield(balance: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0); const ps = perSecond(balance);
    const tick = () => setV(((Date.now() - +start) / 1000) * ps); tick();
    const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [balance]);
  return v;
}
