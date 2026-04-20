export default function Logo({ size = 32, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size * 1.7} height={size} viewBox="0 0 120 60" aria-hidden>
        <path
          d="M4 38 C 10 38, 12 30, 18 30 C 24 30, 22 42, 28 42 C 34 42, 36 32, 42 34 L 56 38"
          stroke="var(--rojo)" strokeWidth="3" fill="none" strokeLinecap="round"
          style={{ strokeDasharray: 120, strokeDashoffset: 0, animation: 'wireDraw 1.2s ease-out' }}
        />
        <path
          d="M56 38 L 60 28 Q 64 22, 72 22 L 86 22 Q 92 22, 96 28 L 104 30 Q 110 30, 112 34 L 112 40 L 106 40
             A 6 6 0 0 0 94 40 L 74 40 A 6 6 0 0 0 62 40 L 56 40 Z"
          fill="var(--ink)"
        />
        <path d="M66 28 L 72 25 L 84 25 L 88 28 Z" fill="var(--bg)" opacity=".9" />
        <circle cx="68" cy="42" r="5" fill="var(--ink)" />
        <circle cx="68" cy="42" r="2" fill="var(--bg-3)" />
        <circle cx="100" cy="42" r="5" fill="var(--ink)" />
        <circle cx="100" cy="42" r="2" fill="var(--bg-3)" />
      </svg>
      {showText && (
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-.01em', lineHeight: 1 }}>
          <div>RED WIRE</div>
          <div style={{ fontSize: 11, color: 'var(--rojo)', letterSpacing: '.22em' }}>AUTO</div>
        </div>
      )}
    </div>
  );
}
