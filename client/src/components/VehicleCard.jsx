import { useNavigate } from 'react-router-dom';
import { garageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function VehicleCard({ vehiculo, afinidad, onRemove }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try { await garageAPI.add(vehiculo.id_vehiculo); setSaved(true); }
    catch { setSaved(true); }
    setLoading(false);
  };

  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
      onClick={() => navigate(`/vehiculo/${vehiculo.id_vehiculo}`)}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--gris)', marginBottom: 2 }}>{vehiculo.marca}</p>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{vehiculo.modelo}</h3>
        </div>
        <span className={`etiqueta etiqueta-${vehiculo.etiqueta}`}>{vehiculo.etiqueta}</span>
      </div>

      {afinidad !== undefined && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 13, color: 'var(--gris)' }}>Afinidad</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--rojo)' }}>{afinidad}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${afinidad}%`, background: 'var(--rojo)', borderRadius: 3 }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 13, color: 'var(--gris)' }}>
        <span>{vehiculo.motor}</span><span>·</span>
        <span>{vehiculo.plazas} plazas</span><span>·</span>
        <span style={{ fontWeight: 600, color: 'var(--negro)' }}>{Number(vehiculo.precio).toLocaleString('es-ES')} €</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
          onClick={e => { e.stopPropagation(); navigate(`/vehiculo/${vehiculo.id_vehiculo}`); }}>
          Ver ficha
        </button>
        {onRemove ? (
          <button className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: 13, color: '#c0392b', borderColor: '#c0392b' }}
            onClick={e => { e.stopPropagation(); onRemove(vehiculo.id_vehiculo); }}>
            Eliminar
          </button>
        ) : (
          <button className="btn-primary" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
            onClick={handleSave} disabled={saved || loading}>
            {saved ? '✓ Guardado' : loading ? '...' : 'Guardar'}
          </button>
        )}
      </div>
    </div>
  );
}