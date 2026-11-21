import { ToastHost } from '../glass/Toast';
/** Celular: tela cheia. Desktop: app centralizado num "aparelho" de vidro de 390×844. */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[1] flex min-h-[100dvh] items-center justify-center sm:py-8">
      <div className="relative h-[100dvh] w-full overflow-hidden sm:h-[844px] sm:max-h-[calc(100dvh-4rem)] sm:w-[390px] sm:rounded-[48px] sm:shadow-[0_0_0_1px_rgba(245,215,122,.25),0_0_0_10px_rgba(255,255,255,.03),0_40px_120px_-30px_rgba(212,175,55,.35)]"
        style={{ background: 'radial-gradient(120% 60% at 50% 0%, rgba(212,175,55,.08), transparent 60%), var(--ink-900)' }}>
        <ToastHost />
        {children}
        <div id="aurea-overlay" className="pointer-events-none absolute inset-0 z-50" />
      </div>
    </div>
  );
}
