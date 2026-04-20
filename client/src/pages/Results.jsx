import { useLocation, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import MatchDial from '../components/MatchDial';
import EnvBadge from '../components/EnvBadge';
import CarSilhouette, { variantFromPlazas } from '../components/CarSilhouette';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Results() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const resultados = state?.resultados || [];

  if (!resultados.length) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <p style={{ marginBottom: 20, color: 'var(--grafito)' }}>No hay resultados. Realiza el test primero.</p>
      <button className="btn btn-red" onClick={() => navigate('/test')}>Ir al test</button>
    </div>
  );

  const top  = resultados[0];
  const rest = resultados.slice(1);
  const topVariant = variantFromPlazas(top.plazas);

  return (
    <div className="screen page wide">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Test completado · hace unos segundos</div>
          <h2 style={{ marginTop: 14 }}>Tu match está listo.</h2>
          <p style={{ marginTop: 8, maxWidth: 520 }}>
            Hemos cruzado tus respuestas con el catálogo. Esto es lo que más encaja con tu vida real.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/test')}>Repetir test</button>
          <button className="btn btn-dark" onClick={() => navigate('/garaje')}>
            Ver mi garaje <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* TOP MATCH HERO */}
      <section style={{
        background: 'var(--ink)', color: 'var(--bg)',
        borderRadius: 'var(--radius-xl)', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }} className="bounce-in">
        <svg style={{ position: 'absolute', right: -20, top: -20, width: 360, height: 360, opacity: .12 }} viewBox="0 0 200 200" aria-hidden>
          <circle cx="100" cy="100" r="90" stroke="var(--rojo)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="55" stroke="var(--rojo)" strokeWidth="2" fill="none" />
        </svg>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', color: 'var(--rojo)' }}>
              ★ TU MATCH #1
            </div>
            <h1 style={{ fontSize: 64, fontWeight: 600, marginTop: 12, color: 'var(--bg)', lineHeight: 1 }}>
              {top.marca}<br />{top.modelo}
            </h1>
            {top.detalles && (
              <p style={{ marginTop: 16, color: 'var(--topo-2)', maxWidth: 440, fontSize: 16 }}>
                {top.detalles}
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <span className="tag" style={{ background: 'rgba(255,255,255,.1)', color: 'var(--bg)' }}>{top.motor}</span>
              <span className="tag" style={{ background: 'rgba(255,255,255,.1)', color: 'var(--bg)' }}>{top.plazas} plazas</span>
              <span className="tag tag-dot" style={{ background: 'rgba(190,61,61,.2)', color: '#ff8585' }}>
                Etiqueta {top.etiqueta}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
            <MatchDial value={top.afinidad || 80} />
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--topo-2)' }}>COINCIDENCIA</div>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1,
          marginTop: 32, background: 'rgba(255,255,255,.1)', borderRadius: 16, overflow: 'hidden',
        }}>
          {[
            ['PRECIO', `${Number(top.precio).toLocaleString('es-ES')} €`],
            ['MOTOR', top.motor],
            ['PLAZAS', `${top.plazas} plazas`],
            ['ETIQUETA', <EnvBadge key="e" type={top.etiqueta} />],
          ].map(([l, v], i) => (
            <div key={i} style={{ padding: '18px 16px', background: 'var(--ink)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--topo-2)' }}>{l}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginTop: 6, color: 'var(--bg)' }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Otros candidatos */}
      {rest.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 22 }}>
            <h3 style={{ fontSize: 24 }}>Otros {rest.length} que también te pegan</h3>
            <div style={{ fontSize: 13, color: 'var(--grafito)' }}>Ordenados por coincidencia</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 }}>
            {rest.map(v => (
              <VehicleCard key={v.id_vehiculo} vehiculo={v} afinidad={v.afinidad} />
            ))}
          </div>
        </section>
      )}

      {/* Compare teaser */}
      <section style={{
        marginTop: 64, background: 'var(--bg-2)', borderRadius: 'var(--radius-xl)',
        padding: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40,
        flexWrap: 'wrap',
      }}>
        <div>
          <h3>¿Dudas entre dos? Compáralos.</h3>
          <p style={{ marginTop: 6, maxWidth: 480 }}>
            Precio real, consumo real, lo que cabe de verdad. Sin humo comercial.
          </p>
        </div>
        <button className="btn btn-dark btn-xl" onClick={() => navigate('/concesionario')}>
          Ver catálogo completo <span className="arrow">→</span>
        </button>
      </section>
    </div>
  );
}
