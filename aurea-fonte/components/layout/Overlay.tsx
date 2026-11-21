'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
/** Portal para a camada acima da TabBar dentro do aparelho. */
export function Overlay({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.getElementById('aurea-overlay')), []);
  return host ? createPortal(children, host) : null;
}
