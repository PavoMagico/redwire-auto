import { useEffect, useState } from 'react';

export default function MatchDial({ value = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const r = 100;
  const c = 2 * Math.PI * r;
  const off = c - (displayed / 100) * c;

  return (
    <svg width="260" height="260" viewBox="-130 -130 260 260" style={{ transform: 'rotate(-90deg)' }}>
      <circle r={r} stroke="rgba(255,255,255,.08)" strokeWidth="14" fill="none" />
      <circle r={r} stroke="var(--rojo)" strokeWidth="14" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset 1.6s var(--spring-bounce)' }} />
      <g transform="rotate(90)">
        <text textAnchor="middle" dominantBaseline="central" style={{
          fontFamily: 'var(--font-display)', fontSize: 76, fontWeight: 700, fill: 'var(--bg)'
        }}>{displayed}</text>
        <text textAnchor="middle" y="44" style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '.1em', fill: 'var(--rojo)'
        }}>% MATCH</text>
      </g>
    </svg>
  );
}
