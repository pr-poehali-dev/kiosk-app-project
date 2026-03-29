import { useEffect, useRef, useState } from 'react';

interface VehicleMarker {
  id: string;
  label: string;
  progress: number;
  color: string;
  isOwn?: boolean;
}

const ROUTE_STOPS_COORDS = [
  { x: 15, y: 80 }, { x: 20, y: 72 }, { x: 27, y: 62 },
  { x: 35, y: 52 }, { x: 42, y: 43 }, { x: 48, y: 36 },
  { x: 55, y: 30 }, { x: 63, y: 24 }, { x: 72, y: 19 },
  { x: 82, y: 14 },
];

const VEHICLES: VehicleMarker[] = [
  { id: 'v1', label: 'ТМ-3405', progress: 0.15, color: '#22c55e' },
  { id: 'v2', label: 'ТМ-3407', progress: 0.38, color: '#3b82f6', isOwn: true },
  { id: 'v3', label: 'ТМ-3410', progress: 0.55, color: '#f59e0b' },
  { id: 'v4', label: 'ТМ-3412', progress: 0.72, color: '#a78bfa' },
  { id: 'v5', label: 'ТМ-3415', progress: 0.88, color: '#f43f5e' },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getPosOnRoute(progress: number) {
  const total = ROUTE_STOPS_COORDS.length - 1;
  const segIdx = Math.min(Math.floor(progress * total), total - 1);
  const segProgress = (progress * total) - segIdx;
  const from = ROUTE_STOPS_COORDS[segIdx];
  const to = ROUTE_STOPS_COORDS[segIdx + 1] || ROUTE_STOPS_COORDS[total];
  return {
    x: lerp(from.x, to.x, segProgress),
    y: lerp(from.y, to.y, segProgress),
  };
}

interface Props {
  currentStopIndex: number;
  speed: number;
}

export default function MapWidget({ currentStopIndex, speed }: Props) {
  const [vehicles, setVehicles] = useState(VEHICLES);
  const animRef = useRef<number>();
  const lastTime = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;
      setVehicles(prev => prev.map(v => ({
        ...v,
        progress: (v.progress + delta * 0.008) % 1,
      })));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const routePath = ROUTE_STOPS_COORDS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="map-container w-full h-full rounded-xl overflow-hidden relative">
      <div className="map-grid" />

      {/* Street labels decoration */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background street lines */}
        <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1="0" y1="55" x2="100" y2="55" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1="60" y1="0" x2="60" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* Route track */}
        <path d={routePath} fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={routePath} fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="2 4" />
        {/* Glow */}
        <path d={routePath} fill="none" stroke="#3b82f6" strokeWidth="0.5"
          filter="drop-shadow(0 0 4px rgba(59,130,246,0.8))" strokeLinecap="round" strokeLinejoin="round" />

        {/* Stop markers */}
        {ROUTE_STOPS_COORDS.map((stop, i) => (
          <g key={i}>
            <circle cx={stop.x} cy={stop.y} r="1.2" fill={i <= currentStopIndex ? '#22c55e' : '#64748b'} />
            <circle cx={stop.x} cy={stop.y} r="2.2" fill="none"
              stroke={i === currentStopIndex ? '#22c55e' : 'transparent'} strokeWidth="0.5" />
          </g>
        ))}

        {/* Vehicle markers */}
        {vehicles.map(v => {
          const pos = getPosOnRoute(v.progress);
          return (
            <g key={v.id}>
              {v.isOwn && (
                <>
                  <circle cx={pos.x} cy={pos.y} r="3.5" fill={v.color} opacity="0.15" />
                  <circle cx={pos.x} cy={pos.y} r="2.5" fill={v.color} opacity="0.25" />
                </>
              )}
              <rect
                x={pos.x - 1.8} y={pos.y - 1}
                width="3.6" height="2"
                rx="0.5"
                fill={v.color}
                filter={v.isOwn ? `drop-shadow(0 0 3px ${v.color})` : undefined}
              />
            </g>
          );
        })}
      </svg>

      {/* Map overlay info */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white text-xs flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>GPS активен</span>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white text-xs">
          Маршрут №5 · Линия А
        </div>
      </div>

      {/* Speed */}
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl p-2.5 text-center min-w-[64px]">
        <div className="text-2xl font-bold text-white tabular-nums leading-none">{Math.round(speed)}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">км/ч</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-2 space-y-1">
        {vehicles.map(v => (
          <div key={v.id} className="flex items-center gap-1.5">
            <div className="w-2.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: v.color }} />
            <span className="text-[10px] text-gray-300">{v.label}{v.isOwn ? ' (вы)' : ''}</span>
          </div>
        ))}
      </div>

      {/* Compass */}
      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-[10px] font-bold">
          <span className="text-red-400 block text-center leading-tight">С</span>
          <span className="text-gray-400 text-[8px] block text-center leading-tight">↑</span>
        </div>
      </div>
    </div>
  );
}
