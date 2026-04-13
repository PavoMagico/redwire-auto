import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiclesAPI, garageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

  const campos = [
    { label: 'Marca',    value: vehiculo.marca },
    { label: 'Modelo',   value: vehiculo.modelo },
    { label: 'Precio',   value: `${Number(vehiculo.precio).toLocaleString('es-ES')} €` },
    { label: 'Motor',    value: vehiculo.motor },
    { label: 'Etiqueta', value: vehiculo.etiqueta },
    { label: 'Plazas',   value: vehiculo.plazas },
  ];

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gris)', fontSize: 14, marginBottom: 24 }}>
        ← Volver
      </button>
      <div className="card">
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--gris)', fontSize: 14, marginBottom: 4 }}>{vehiculo.marca}</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{vehiculo.modelo}</h1>
          <span className={`etiqueta etiqueta-${vehiculo.etiqueta}`}>{vehiculo.etiqueta}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {campos.map(c => (
            <div key={c.label} style={{ background: 'var(--fondo)', borderRadius: 8, padding: '14px 18px' }}>
              <p style={{ fontSize: 11, color: 'var(--gris)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>{c.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700 }}>{c.value}</p>
            </div>
          ))}
        </div>
        {vehiculo.detalles && (
          <div style={{ marginBottom: 28, padding: 16, background: 'var(--fondo)', borderRadius: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Descripción</h3>
            <p style={{ color: 'var(--gris)', fontSize: 14, lineHeight: 1.7 }}>{vehiculo.detalles}</p>
          </div>
        )}
        <button className="btn-primary" onClick={handleSave} disabled={saved} style={{ width: '100%', padding: 14 }}>
          {saved ? '✓ Guardado en tu garaje' : 'Guardar en mi garaje'}
        </button>
      </div>
    </div>
  );
}