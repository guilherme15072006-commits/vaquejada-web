import { seeded } from '@/lib/utils/random';
/** QR Code fictício (padrão visual, não decodificável) com marcadores de canto. */
export function QrMock({ seed = 5, size = 180 }: { seed?: number; size?: number }) {
  const r = seeded(seed); const n = 25; const cells: [number, number][] = [];
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && r() > 0.52) cells.push([x, y]);
  const F = ({ x, y }: { x: number; y: number }) => <g><rect x={x} y={y} width={7} height={7} fill="#07070A" /><rect x={x + 1} y={y + 1} width={5} height={5} fill="#FAF7EE" /><rect x={x + 2} y={y + 2} width={3} height={3} fill="#07070A" /></g>;
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} role="img" aria-label="QR Code Pix fictício" shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#FAF7EE" rx={1} />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#07070A" />)}
      <F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />
    </svg>
  );
}
