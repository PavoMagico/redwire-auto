import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';

const MOTORES   = ['Gasolina', 'Diesel', 'Hibrid', 'Electrico'];
const ETIQUETAS = ['ZERO', 'ECO', 'C'];

export default function Dealership() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filtros,   setFiltros]   = useState({ motor: '', etiqueta: '', precio_max: '', plazas_min: '' });

  useEffect(() => { fetchVehiculos(); }, [filtros]);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filtros).filter(([,v]) => v !== ''));
      const { data } = await vehiclesAPI.getAll(params);
      setVehiculos(data);
    } catch { setVehiculos([]); }
    setLoading(false);
  };

  const reset = () => setFiltros({ motor: '', etiqueta: '', precio_max: '', plazas_min: '' });

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Concesionario</h1>
      <p style={{ color: 'var(--gris)', marginBottom: 32 }}>Catálogo completo de vehículos disponibles</p>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
        <aside>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Filtros</h3>
            {[
              { label: 'MOTOR',    key: 'motor',    opts: MOTORES,   placeholder: 'Todos' },
              { label: 'ETIQUETA', key: 'etiqueta', opts: ETIQUETAS, placeholder: 'Todas' },
            ].map(({ label, key, opts, placeholder }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 6 }}>{label}</label>
                <select value={filtros[key]} onChange={e => setFiltros({ ...filtros, [key]: e.target.value })}>
                  <option value="">{placeholder}</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 6 }}>PRECIO MÁX. (€)</label>
              <input type="number" placeholder="Ej: 30000" value={filtros.precio_max}
                onChange={e => setFiltros({ ...filtros, precio_max: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 6 }}>PLAZAS MÍNIMAS</label>
              <select value={filtros.plazas_min} onChange={e => setFiltros({ ...filtros, plazas_min: e.target.value })}>
                <option value="">Sin filtro</option>
                <option value="2">2+</option>
                <option value="5">5+</option>
                <option value="7">7+</option>
              </select>
            </div>
            <button onClick={reset} style={{ width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'var(--gris)' }}>
              Limpiar filtros
            </button>
          </div>
        </aside>
        <div>
          {loading ? <div className="spinner" /> : vehiculos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gris)' }}>
              <p>No hay vehículos con esos filtros.</p>
              <button onClick={reset} style={{ marginTop: 12, color: 'var(--rojo)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver todos</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, color: 'var(--gris)', marginBottom: 20 }}>{vehiculos.length} vehículos</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 20 }}>
                {vehiculos.map(v => <VehicleCard key={v.id_vehiculo} vehiculo={v} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}