'use client';
/** Defs SVG globais: filtro de água (feTurbulence + feDisplacementMap) animado devagar. */
export function WaterFilterDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="aurea-water" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={7} result="noise">
            <animate attributeName="baseFrequency" dur="18s" values="0.012 0.018;0.016 0.012;0.012 0.018" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="aurea-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF4CC" /><stop offset="35%" stopColor="#D4AF37" /><stop offset="60%" stopColor="#8C6A1C" /><stop offset="100%" stopColor="#F5D77A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Camada de cáusticas dourada distorcida pelo filtro — vai atrás do conteúdo do painel. */
export function WaterRefraction({ intensity = 1 }: { intensity?: number }) {
  return (
    <div aria-hidden className="fx-layer pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" style={{ zIndex: -1 }}>
      <div
        className="absolute -inset-[15%] motion-safe:animate-[spin-slow_60s_linear_infinite]"
        style={{
          filter: 'url(#aurea-water)', opacity: 0.55 * intensity,
          background:
            'radial-gradient(40% 30% at 25% 30%, rgba(245,215,122,0.35), transparent 70%), radial-gradient(35% 40% at 75% 70%, rgba(212,175,55,0.25), transparent 70%), radial-gradient(25% 20% at 60% 20%, rgba(255,255,255,0.18), transparent 70%)',
        }}
      />
    </div>
  );
}
