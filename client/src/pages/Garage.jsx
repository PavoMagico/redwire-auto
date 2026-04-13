import { useState, useEffect } from 'react';
import { garageAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import { useNavigate } from 'react-router-dom';

export default function Garage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    garageAPI.get().then(r => setVehiculos(r.data)).catch(() => setVehiculos([])).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    await garageAPI.remove(id);
    setVehiculos(v => v.filter(x => x.id_vehiculo !== id));
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Mi Garaje</h1>
      <p style={{ color: 'var(--gris)', marginBottom: 32 }}>Tus vehículos guardados</p>
      {loading ? <div className="spinner" /> : vehiculos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 16, color: 'var(--gris)', marginBottom: 24 }}>El garaje está vacío. Realiza el test para descubrir tu vehículo ideal.</p>
          <button className="btn-primary" onClick={() => navigate('/test')}>Hacer el test</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 20 }}>
          {vehiculos.map(v => <VehicleCard key={v.id_vehiculo} vehiculo={v} onRemove={handleRemove} />)}
        </div>
      )}
    </div>
  );
}