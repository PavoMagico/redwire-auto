import { useLocation, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';

export default function Results() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const resultados = state?.resultados || [];

  if (!resultados.length) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
      <p style={{ marginBottom: 20, color: 'var(--gris)' }}>No hay resultados. Realiza el test primero.</p>
      <button className="btn-primary" onClick={() => navigate('/test')}>Ir al test</button>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Tus resultados</h1>
        <p style={{ color: 'var(--gris)' }}>{resultados.length} vehículos compatibles con tu perfil</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 20 }}>
        {resultados.map(v => <VehicleCard key={v.id_vehiculo} vehiculo={v} afinidad={v.afinidad} />)}
      </div>
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('/test')}>Repetir test</button>
      </div>
    </div>
  );
}