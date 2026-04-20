const shapes = [
  // Sedán
  "M10 60 L18 40 Q24 30 38 28 L62 28 Q72 28 80 36 L92 40 Q102 42 104 50 L104 60 L96 60 A8 8 0 0 0 80 60 L40 60 A8 8 0 0 0 24 60 Z",
  // SUV
  "M10 62 L14 40 Q20 28 36 26 L72 26 Q84 26 90 34 L100 40 Q106 42 106 52 L106 62 L98 62 A8 8 0 0 0 82 62 L38 62 A8 8 0 0 0 22 62 Z",
  // Compacto
  "M12 58 L18 42 Q26 32 42 30 L62 30 Q74 30 82 40 L96 44 Q100 46 100 52 L100 58 L92 58 A7 7 0 0 0 78 58 L38 58 A7 7 0 0 0 24 58 Z",
  // Deportivo
  "M6 56 L14 44 Q22 34 40 32 L72 32 Q86 32 98 42 L108 46 Q112 48 112 54 L112 58 L100 58 A7 7 0 0 0 86 58 L34 58 A7 7 0 0 0 20 58 Z",
];

export function variantFromPlazas(plazas) {
  if (plazas >= 7) return 1;
  if (plazas <= 2) return 3;
  return 0;
}

export default function CarSilhouette({ variant = 0, tone = 'dark', style = {}, className = '' }) {
  const fill = tone === 'dark' ? 'var(--ink)' : 'var(--bg)';
  const rim  = tone === 'dark' ? 'var(--topo-2)' : 'rgba(255,255,255,.4)';
  const shape = shapes[variant % shapes.length];
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden>
      <path d={shape} fill={fill} />
      <circle cx="32" cy="60" r="7" fill={fill} />
      <circle cx="32" cy="60" r="2.5" fill={rim} />
      <circle cx="88" cy="60" r="7" fill={fill} />
      <circle cx="88" cy="60" r="2.5" fill={rim} />
    </svg>
  );
}
