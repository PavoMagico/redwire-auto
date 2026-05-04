import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../hooks/useCompare';
import EnvBadge from '../components/EnvBadge';
import CarSilhouette, { variantFromPlazas } from '../components/CarSilhouette';

const SPECS = [
  { label: 'Precio', key: v => `${Number(v.precio).toLocaleString('es-ES')} €` },
  { label: 'Motor', key: v => v.motor },
  { label: 'Etiqueta', key: v => v.etiqueta },
  { label: 'Plazas', key: v => `${v.plazas} plazas` },
  { label: 'Detalles', key: v => v.detalles || '—' },
];

export default function Compare() {
  const [list, setList] = useState([]);
  const { getList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  useEffect(() => {
    setList(getList());
    window.addEventListener('compare-updated', () => setList(getList()));
  }, []);

  if (list.length === 0) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 64 }}>⇄</div>
      <h3 style={{ marginTop: 16 }}>No hay vehículos para comparar</h3>
      <p style={{ marginTop: 8, color: 'var(--grafito)' }}>
        Añade vehículos desde el catálogo o los resultados del test.
      </p>
      <button className="btn btn-red" style={{ marginTop: 24 }} onClick={() => navigate('/concesionario')}>
        Ir al catálogo →
      </button>
    </div>
  );

  const cols = `repeat(${list.length}, 1fr)`;

  return (
    <div className="screen page wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32 }}>
        <div>
          <div className="eyebrow">Comparador</div>
          <h1 style={{ fontSize: 40, fontWeight: 600, marginTop: 10 }}>
            {list.map(v => `${v.marca} ${v.modelo}`).join(' vs ')}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/concesionario')}>
            Añadir más
          </button>
          <button className="btn btn-ghost" onClick={() => { clearCompare(); navigate('/concesionario'); }}>
            Limpiar
          </button>
        </div>
      </div>

      {/* Silhouettes */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, marginBottom: 8 }}>
        {list.map(v => (
          <div key={v.id_vehiculo} style={{
            background: 'var(--bg-3)', borderRadius: 'var(--radius-l)',
            padding: 28, textAlign: 'center', position: 'relative',
          }}>
            <button
              onClick={() => removeFromCompare(v.id_vehiculo)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(190,61,61,.1)', border: 'none',
                color: 'var(--rojo)', width: 28, height: 28,
                borderRadius: '50%', cursor: 'pointer', fontSize: 14,
              }}
            >✕</button>
            <CarSilhouette variant={variantFromPlazas(v.plazas)} style={{ width: '80%', height: 'auto' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--grafito)', marginTop: 12 }}>
              {v.marca?.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
              {v.modelo}
            </div>
            <div style={{ marginTop: 8 }}>
              <EnvBadge type={v.etiqueta} />
            </div>
          </div>
        ))}
      </div>

      {/* Specs table */}
      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-l)', border: '1px solid rgba(1,0,1,.08)', overflow: 'hidden', marginTop: 8 }}>
        {SPECS.map((spec, si) => {
          const values = list.map(v => spec.key(v));
          const allSame = values.every(val => val === values[0]);
          return (
            <div key={si} style={{
              display: 'grid',
              gridTemplateColumns: `160px ${cols}`,
              borderTop: si === 0 ? 'none' : '1px solid rgba(1,0,1,.06)',
            }}>
              <div style={{
                padding: '16px 20px', background: 'var(--bg-2)',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '.08em', color: 'var(--grafito)',
                textTransform: 'uppercase', display: 'flex', alignItems: 'center',
              }}>
                {spec.label}
              </div>
              {list.map((v, vi) => (
                <div key={v.id_vehiculo} style={{
                  padding: '16px 20px', fontSize: 15, fontWeight: 500,
                  background: !allSame && vi === 0 ? 'rgba(190,61,61,.04)' : 'var(--bg)',
                  borderLeft: '1px solid rgba(1,0,1,.06)',
                  color: !allSame ? 'var(--ink)' : 'var(--grafito)',
                }}>
                  {spec.key(v)}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* CTA row */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, marginTop: 16 }}>
        {list.map(v => (
          <button key={v.id_vehiculo} className="btn btn-red" style={{ width: '100%' }}
            onClick={() => navigate(`/vehiculo/${v.id_vehiculo}`)}>
            Ver ficha {v.modelo} →
          </button>
        ))}
      </div>
    </div>
  );
}
