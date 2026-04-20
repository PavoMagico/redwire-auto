import { useNavigate } from 'react-router-dom';
import CarSilhouette from '../components/CarSilhouette';

const tickerItems = [
  'Híbrido · 140 CV', 'Familiar · 7 plazas', 'Eléctrico · 340 CV', 'Etiqueta 0 · ZBE OK',
  'SUV · Off-road', 'Urbano · compacto', 'Deportivo · 5.4s 0–100', 'Desde 16.900 €',
];

const perfiles = [
  {
    name: 'Dominguero', tag: '#rural #camping', pct: '12 %',
    bg: 'var(--bg-3)', fg: 'var(--ink)', emoji: '⛺', variant: 1,
    quote: '"No todos quieren lo mismo de un coche. Algunos no necesitan hipotecas. Ni duchas."',
  },
  {
    name: 'Familia numerosa', tag: '#7plazas #xl', pct: '28 %',
    bg: 'var(--ink)', fg: 'var(--bg)', emoji: '👨‍👩‍👧‍👦', variant: 1,
    quote: '"Un Miata es precioso, pero no le caben 27 muebles y 4 niños."',
  },
  {
    name: 'Aficionado', tag: '#curvas #driving', pct: '9 %',
    bg: 'var(--rojo)', fg: 'white', emoji: '🏁', variant: 3,
    quote: '"No hay que jubilarse para tener el espíritu de un jubilado. Cómprate el Miata."',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      {/* ========= HERO ========= */}
      <section style={{ position: 'relative', padding: '72px 40px 96px', maxWidth: 1440, margin: '0 auto', overflow: 'hidden' }}>
        {/* Cable rojo de fondo */}
        <svg style={{ position: 'absolute', top: 120, left: -60, width: '120%', height: '80%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 1400 600" preserveAspectRatio="none" aria-hidden>
          <path
            d="M-20 420 C 180 400, 260 260, 420 280 C 560 300, 600 460, 760 440 C 920 420, 1000 300, 1160 320 C 1280 340, 1340 420, 1500 400"
            stroke="var(--rojo)" strokeWidth="2.5" fill="none" strokeLinecap="round"
            className="wire-draw" style={{ opacity: .22 }}
          />
          <g transform="translate(210, 380)">
            <path d="M0 0 C 10 -8, 28 -10, 32 4 C 34 14, 22 20, 12 16 C 2 12, -4 4, 0 0 Z M18 6 C 22 -2, 34 -2, 38 6 C 40 12, 34 18, 26 16 C 18 14, 14 12, 18 6 Z"
              stroke="var(--rojo)" strokeWidth="2.5" fill="none" opacity=".45" />
          </g>
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow slide-up" style={{ animationDelay: '.1s' }}>Test de compatibilidad automotriz · 2026</div>

          <h1 className="slide-up" style={{ marginTop: 20, maxWidth: '14ch', animationDelay: '.15s' }}>
            Dime qué<br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              conduces
              <svg style={{ position: 'absolute', left: 0, bottom: -8, width: '100%', height: 14 }}
                viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden>
                <path d="M2 8 Q 40 2, 80 7 T 160 6 T 240 8 T 298 6"
                  stroke="var(--rojo)" strokeWidth="3" fill="none" strokeLinecap="round"
                  strokeDasharray="400" strokeDashoffset="400"
                  style={{ animation: 'wireDraw 1.2s ease-out 1s forwards' }} />
              </svg>
            </span><br />
            y te diré quién eres.
          </h1>

          <div className="slide-up" style={{ animationDelay: '.35s', marginTop: 32, display: 'flex', gap: 60, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <p style={{ maxWidth: 440, fontSize: 17, color: 'var(--grafito)', margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>6 preguntas. 2 minutos.</strong> Te contamos qué coche encaja con tu vida real — no con la que tendrás cuando ganes la lotería.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-red btn-xl" onClick={() => navigate('/test')}>
                Empezar test <span className="arrow">→</span>
              </button>
              <button className="btn btn-ghost btn-xl" onClick={() => navigate('/concesionario')}>
                Ver concesionario
              </button>
            </div>
          </div>

          {/* Métricas */}
          <div className="slide-up" style={{
            marginTop: 72, display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
            background: 'rgba(1,0,1,.08)', borderRadius: 18, overflow: 'hidden',
            animationDelay: '.5s',
          }}>
            {[
              ['256 422', 'tests completados'],
              ['94 %', 'coincidencia media'],
              ['1 842', 'vehículos en catálogo'],
              ['3 min', 'para tu match'],
            ].map(([v, l], i) => (
              <div key={i} style={{ padding: '22px 24px', background: 'var(--bg)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, letterSpacing: '-.02em' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--grafito)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= TICKER ========= */}
      <div style={{
        borderTop: '1px solid rgba(1,0,1,.08)', borderBottom: '1px solid rgba(1,0,1,.08)',
        background: 'var(--ink)', color: 'var(--bg)',
        overflow: 'hidden', padding: '14px 0',
      }}>
        <div style={{
          display: 'flex', gap: 48, whiteSpace: 'nowrap',
          animation: 'tickerScroll 38s linear infinite',
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, opacity: .75 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rojo)', flexShrink: 0 }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ========= PERFILES ========= */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="eyebrow">Tres de los 12 perfiles</div>
            <h2 style={{ marginTop: 14, maxWidth: '20ch' }}>¿Cuál de estos eres tú?</h2>
          </div>
          <p style={{ maxWidth: 340 }}>
            Cruzamos tus respuestas con el catálogo completo para encontrar tu coche. Aquí una probadita.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {perfiles.map((p, i) => (
            <article key={p.name} className="hoverable slide-up" style={{
              animationDelay: `${.1 + i * .1}s`,
              background: p.bg, color: p.fg,
              borderRadius: 'var(--radius-l)', padding: 28,
              display: 'flex', flexDirection: 'column', gap: 16,
              minHeight: 400, position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--shadow)', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', opacity: .7 }}>{p.tag}</div>
                  <h3 style={{ marginTop: 6, color: 'inherit', fontSize: 26 }}>{p.name}</h3>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em',
                  padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,.15)',
                  border: '1px solid rgba(255,255,255,.25)', color: p.fg,
                }}>{p.pct} usuarios</div>
              </div>

              <div style={{
                marginTop: 'auto', height: 120,
                display: 'grid', placeItems: 'center',
                background: p.fg === 'white' ? 'rgba(255,255,255,.12)' : 'rgba(1,0,1,.05)',
                borderRadius: 14, padding: 14,
              }}>
                <CarSilhouette tone={p.fg === 'white' || p.fg === 'var(--bg)' ? 'light' : 'dark'} variant={p.variant} style={{ width: '90%', height: 'auto' }} />
              </div>

              <p style={{ fontStyle: 'italic', fontSize: 14, color: 'inherit', opacity: .85, margin: 0 }}>{p.quote}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 12, opacity: .7 }}>Test disponible</span>
                <span style={{ fontSize: 20 }}>{p.emoji}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========= HOW IT WORKS ========= */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="eyebrow">Cómo funciona</div>
            <h2 style={{ marginTop: 14 }}>Todo lo que necesitas, y un poco más.</h2>
            <p style={{ marginTop: 20, fontSize: 16 }}>
              Cuando no sabes qué hacer, empieza por aquí. Con nuestro test puedes hacerte una idea de qué vas a disfrutar más, y luego comparar entre tus opciones.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-red" onClick={() => navigate('/test')}>
                Empezar test <span className="arrow">→</span>
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/concesionario')}>
                Ver coches
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '01', title: 'Concesionario', desc: 'Echa un vistazo a los vehículos disponibles y a sus características. Filtra por etiqueta, plazas, motor o precio.', icon: '🔍' },
              { step: '02', title: 'Tu Test Personal', desc: '6 preguntas honestas sobre cómo vives, no sobre cómo te gustaría vivir. En 2 minutos sabemos lo tuyo.', icon: '🧭' },
              { step: '03', title: 'Garaje virtual', desc: 'Guarda tus resultados para poder ver tus vehículos. No tus preferidos, los tuyos. La vida es así.', icon: '🚗' },
            ].map((s, i) => (
              <div key={i} className="hoverable" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto',
                gap: 20, alignItems: 'center', padding: 24,
                background: 'var(--bg)', border: '1px solid rgba(1,0,1,.08)',
                borderRadius: 'var(--radius)', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, color: 'var(--rojo)', letterSpacing: '-.04em', lineHeight: 1 }}>{s.step}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>{s.title}</div>
                  <p style={{ margin: '4px 0 0', fontSize: 14 }}>{s.desc}</p>
                </div>
                <div style={{ fontSize: 32 }}>{s.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= MANIFESTO BANNER ========= */}
      <section style={{
        background: 'var(--ink)', color: 'var(--bg)',
        padding: '80px 40px', marginTop: 40,
        position: 'relative', overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', right: -60, top: -40, width: 440, height: 440, opacity: .08 }} viewBox="0 0 200 200" aria-hidden>
          <circle cx="100" cy="100" r="90" stroke="var(--rojo)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="60" stroke="var(--rojo)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="30" stroke="var(--rojo)" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', color: 'var(--rojo)', marginBottom: 18 }}>
              EL MANIFIESTO
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, maxWidth: 800 }}>
              "El coche perfecto no existe. Existe <span style={{ color: 'var(--rojo)' }}>el coche para ti</span>, y es bastante menos glamoroso de lo que crees. Ya era hora de que alguien te lo dijera."
            </div>
            <div style={{ marginTop: 28, fontSize: 13, color: 'var(--topo-2)', letterSpacing: '.04em' }}>
              — Santi, Red Wire Auto
            </div>
          </div>
          <button className="btn btn-red btn-xl" onClick={() => navigate('/test')} style={{ alignSelf: 'center', flexShrink: 0 }}>
            Hacer mi test <span className="arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
