import { useState, useEffect } from 'react';
import { garageAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function Garage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();
  const { user }  = useAuth();

  useEffect(() => {
    garageAPI.get().then(r => setVehiculos(r.data)).catch(() => setVehiculos([])).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    await garageAPI.remove(id);
    setVehiculos(v => v.filter(x => x.id_vehiculo !== id));
  };

  return (
    <div className="screen page wide">
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--ink) 0%, #2a1010 100%)',
        color: 'var(--bg)', padding: 40, borderRadius: 'var(--radius-xl)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: 24,
      }}>
        <svg style={{ position: 'absolute', right: -40, top: -40, width: 300, height: 300, opacity: .15 }} viewBox="0 0 200 200" aria-hidden>
          <circle cx="100" cy="100" r="90" stroke="var(--rojo)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="var(--rojo)" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', color: 'var(--rojo)' }}>TU GARAJE</div>
          <h1 style={{ fontSize: 56, fontWeight: 600, color: 'var(--bg)', marginTop: 10 }}>
            Hola, {user?.nombre?.split(' ')[0] || 'usuario'}.
          </h1>
          <p style={{ color: 'var(--topo-2)', marginTop: 8, maxWidth: 480 }}>
            {vehiculos.length > 0
              ? `Tienes ${vehiculos.length} vehículo${vehiculos.length > 1 ? 's' : ''} guardado${vehiculos.length > 1 ? 's' : ''}. Respira, no hay prisa.`
              : 'Todavía no has guardado nada. Un buen sitio para empezar es el test.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 28, position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--rojo)', letterSpacing: '-.02em' }}>{vehiculos.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--topo-2)', textTransform: 'uppercase', marginTop: 2 }}>Guardados</div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 20 }}>
          <h3 style={{ fontSize: 24 }}>Tus vehículos guardados</h3>
          <button className="btn btn-ghost" onClick={() => navigate('/concesionario')} style={{ fontSize: 13 }}>
            <PlusIcon /> Añadir desde el catálogo
          </button>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : vehiculos.length === 0 ? (
          <div className="bounce-in" style={{
            padding: 60, textAlign: 'center', background: 'var(--bg-2)',
            borderRadius: 'var(--radius-xl)', border: '2px dashed rgba(1,0,1,.1)',
          }}>
            <div style={{ fontSize: 64 }}>🔌</div>
            <h3 style={{ marginTop: 16 }}>Garaje vacío — enchúfate al test</h3>
            <p style={{ marginTop: 8, maxWidth: 360, margin: '8px auto 24px' }}>
              Unas cuantas preguntas honestas y sabemos qué cabe en tu vida.
            </p>
            <button className="btn btn-red btn-xl" onClick={() => navigate('/test')}>
              Empezar mi test <span className="arrow">→</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 }}>
            {vehiculos.map(v => <VehicleCard key={v.id_vehiculo} vehiculo={v} onRemove={handleRemove} />)}
          </div>
        )}
      </section>
    </div>
  );
}
