import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiclesAPI, garageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CarSilhouette, { variantFromPlazas } from '../components/CarSilhouette';
import EnvBadge from '../components/EnvBadge';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default function VehicleDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehiculo, setVehiculo] = useState(null);
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    vehiclesAPI.getById(id).then(r => setVehiculo(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    await garageAPI.add(vehiculo.id_vehiculo);
    setSaved(true);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!vehiculo) return <div className="page"><p>Vehículo no encontrado.</p></div>;

  const variant = variantFromPlazas(vehiculo.plazas);

  const specs = [
    ['Motor',    vehiculo.motor],
    ['Plazas',   `${vehiculo.plazas} plazas`],
    ['Etiqueta', vehiculo.etiqueta],
    ['Precio',   `${Number(vehiculo.precio).toLocaleString('es-ES')} €`],
  ];

  return (
    <div className="screen page wide">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 20, fontSize: 13 }}>
        <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}><ArrowIcon /></span>
        Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Silhouette panel */}
        <div style={{
          background: 'var(--bg-3)', borderRadius: 'var(--radius-xl)',
          padding: 40, height: 500,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .12 }} viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden>
            <path d="M-10 80 Q 120 100, 200 180 T 410 260" stroke="var(--rojo)" strokeWidth="2" fill="none" className="wire-draw" />
            <path d="M-10 380 Q 140 360, 220 420 T 410 460" stroke="var(--rojo)" strokeWidth="2" fill="none" className="wire-draw" style={{ animationDelay: '.3s' }} />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <h1 style={{ fontSize: 48, marginTop: 0, fontWeight: 600, lineHeight: .98 }}>
                {vehiculo.marca}<br />{vehiculo.modelo}
              </h1>
            </div>
            <EnvBadge type={vehiculo.etiqueta} />
          </div>
          <CarSilhouette tone="dark" variant={variant} style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--grafito)' }}>
              ID {String(vehiculo.id_vehiculo).padStart(6, '0')}
            </div>
          </div>
        </div>

        {/* Spec panel */}
        <div>
          <div className="eyebrow">Ficha técnica · completa</div>
          <h2 style={{ marginTop: 14, fontSize: 36 }}>{Number(vehiculo.precio).toLocaleString('es-ES')} €</h2>
          <div style={{ color: 'var(--grafito)', fontSize: 14, marginTop: 4 }}>
            o desde {Math.round(vehiculo.precio / 60).toLocaleString('es-ES')} €/mes · financiación 60 meses
          </div>

          {vehiculo.detalles && (
            <p style={{ marginTop: 20, fontSize: 16, color: 'var(--ink-2)' }}>{vehiculo.detalles}</p>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            marginTop: 26, background: 'rgba(1,0,1,.08)', borderRadius: 16, overflow: 'hidden',
          }}>
            {specs.map(([l, v], i) => (
              <div key={i} style={{ padding: '16px 18px', background: 'var(--bg)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--grafito)' }}>{l.toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Why this car */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            {[
              { t: 'Etiqueta ' + vehiculo.etiqueta, d: 'Acceso a zonas de bajas emisiones.', icon: '🏙️' },
              { t: vehiculo.plazas + ' plazas reales', d: 'Sin trampa ni cartón.', icon: '👥' },
            ].map((r, i) => (
              <div key={i} style={{ padding: 18, background: 'var(--bg-2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>{r.t}</div>
                <p style={{ margin: '4px 0 0', fontSize: 13 }}>{r.d}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
            <button className="btn btn-red btn-xl" style={{ flex: 1 }} onClick={handleSave} disabled={saved}>
              {saved ? '✓ Guardado en tu garaje' : 'Guardar en mi garaje'}
              {!saved && <span className="arrow">→</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
