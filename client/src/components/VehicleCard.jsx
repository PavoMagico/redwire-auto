import { useNavigate } from 'react-router-dom';
import { garageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import CarSilhouette, { variantFromPlazas } from './CarSilhouette';
import EnvBadge from './EnvBadge';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function VehicleCard({ vehiculo, afinidad, onRemove }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const variant = variantFromPlazas(vehiculo.plazas);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try { await garageAPI.add(vehiculo.id_vehiculo); setSaved(true); }
    catch { setSaved(true); }
    setLoading(false);
  };

  return (
    <article
      className="hoverable"
      style={{
        background: 'var(--bg)', border: '1px solid rgba(1,0,1,.08)',
        borderRadius: 'var(--radius-l)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={() => navigate(`/vehiculo/${vehiculo.id_vehiculo}`)}
    >
      {/* Silhouette area */}
      <div style={{
        height: 180, background: 'var(--bg-3)',
        position: 'relative', display: 'grid', placeItems: 'center', padding: 20,
      }}>
        <CarSilhouette variant={variant} style={{ width: '90%', height: 'auto' }} />

        {afinidad !== undefined && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '6px 10px', background: 'var(--ink)', color: 'var(--bg)',
            borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 11,
            fontWeight: 700, letterSpacing: '.04em',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rojo)' }} />
            {afinidad}% MATCH
          </div>
        )}

        {onRemove ? (
          <button
            onClick={e => { e.stopPropagation(); onRemove(vehiculo.id_vehiculo); }}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(190,61,61,.1)', color: 'var(--rojo)',
              display: 'grid', placeItems: 'center',
              transition: 'all .3s var(--spring-bounce)', border: 0, cursor: 'pointer',
            }}
            title="Eliminar del garaje"
          >
            <HeartIcon filled />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saved || loading}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 36, height: 36, borderRadius: '50%',
              background: saved ? 'var(--rojo)' : 'rgba(255,255,255,.9)',
              color: saved ? 'white' : 'var(--ink)',
              display: 'grid', placeItems: 'center',
              transition: 'all .3s var(--spring-bounce)', border: 0, cursor: 'pointer',
            }}
          >
            <HeartIcon filled={saved} />
          </button>
        )}

        <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <EnvBadge type={vehiculo.etiqueta} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--grafito)', letterSpacing: '.08em' }}>
            {vehiculo.marca?.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, lineHeight: 1.1, marginTop: 2 }}>
            {vehiculo.modelo}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="tag">{vehiculo.motor}</span>
          <span className="tag">{vehiculo.plazas} plazas</span>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(1,0,1,.06)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
            {Number(vehiculo.precio).toLocaleString('es-ES')} €
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--rojo)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver ficha <ArrowIcon />
          </span>
        </div>
      </div>
    </article>
  );
}
