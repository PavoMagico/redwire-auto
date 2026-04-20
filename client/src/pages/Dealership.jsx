import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import { useNavigate } from 'react-router-dom';

const MOTORES   = ['Gasolina', 'Diesel', 'Hibrid', 'Electrico'];
const ETIQUETAS = ['ZERO', 'ECO', 'C'];

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            padding: '6px 12px', borderRadius: 999,
            background: value === o.value ? 'var(--ink)' : 'var(--bg-2)',
            color: value === o.value ? 'var(--bg)' : 'var(--ink)',
            fontSize: 12, fontWeight: 600, border: 0, cursor: 'pointer',
            transition: 'all .3s var(--spring-bounce)',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(.94)'}
            onMouseUp={e => e.currentTarget.style.transform = ''}
          >{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export default function Dealership() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [motor,     setMotor]     = useState('');
  const [etiqueta,  setEtiqueta]  = useState('');
  const [plazas,    setPlazas]    = useState('');
  const [precioMax, setPrecioMax] = useState(60000);

  useEffect(() => { fetchVehiculos(); }, [motor, etiqueta, plazas]);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (motor)   params.motor   = motor;
      if (etiqueta) params.etiqueta = etiqueta;
      if (plazas)  params.plazas_min = plazas;
      const { data } = await vehiclesAPI.getAll(params);
      setVehiculos(data);
    } catch { setVehiculos([]); }
    setLoading(false);
  };

  const reset = () => { setMotor(''); setEtiqueta(''); setPlazas(''); setPrecioMax(60000); setQuery(''); };

  const filtered = vehiculos.filter(v => {
    if (query && !(`${v.marca} ${v.modelo}`).toLowerCase().includes(query.toLowerCase())) return false;
    if (Number(v.precio) > precioMax) return false;
    return true;
  });

  return (
    <div className="screen page wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Concesionario · catálogo completo</div>
          <h1 style={{ fontSize: 56, marginTop: 12, fontWeight: 600 }}>El Garaje</h1>
          <p style={{ marginTop: 6, maxWidth: 520 }}>Todo el catálogo en un sitio. Filtra sin miedo, los numeritos no muerden.</p>
        </div>
        <button className="btn btn-red" onClick={() => navigate('/test')}>
          Personalizar con test <span className="arrow">→</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
        {/* SIDEBAR */}
        <aside style={{
          position: 'sticky', top: 90, alignSelf: 'start',
          background: 'var(--bg)', padding: 24, borderRadius: 'var(--radius-l)',
          border: '1px solid rgba(1,0,1,.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FilterIcon /> Filtros
            </div>
            <button style={{ fontSize: 12, color: 'var(--rojo)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }} onClick={reset}>Limpiar</button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 4 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--grafito)', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              value={query} onChange={e => setQuery(e.target.value)} placeholder="Marca o modelo…"
              className="field-input"
              style={{ paddingLeft: 40 }}
            />
          </div>

          <FilterGroup label="Motor" value={motor} onChange={setMotor}
            options={[{ label: 'Todos', value: '' }, ...MOTORES.map(m => ({ label: m, value: m }))]} />
          <FilterGroup label="Etiqueta ambiental" value={etiqueta} onChange={setEtiqueta}
            options={[{ label: 'Todas', value: '' }, ...ETIQUETAS.map(e => ({ label: e, value: e }))]} />
          <FilterGroup label="Plazas" value={plazas} onChange={setPlazas}
            options={[
              { label: 'Todas', value: '' },
              { label: '2+', value: '2' },
              { label: '5+', value: '5' },
              { label: '7+', value: '7' },
            ]} />

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Precio máx. · <span style={{ color: 'var(--ink)' }}>{precioMax.toLocaleString('es-ES')} €</span>
            </div>
            <input type="range" min={5000} max={60000} step={500} value={precioMax}
              onChange={e => setPrecioMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--rojo)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--grafito)', marginTop: 4 }}>
              <span>5k €</span><span>60k €</span>
            </div>
          </div>

          <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-2)', borderRadius: 12, fontSize: 13 }}>
            <strong>{filtered.length}</strong> vehículo{filtered.length !== 1 ? 's' : ''} coinciden
          </div>
        </aside>

        {/* GRID */}
        <div>
          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', background: 'var(--bg-2)', borderRadius: 'var(--radius-l)' }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <h3 style={{ marginTop: 12 }}>Ninguno encaja con esos filtros</h3>
              <p style={{ marginTop: 4 }}>Afloja un poco y vuelve a probar.</p>
              <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={reset}>Ver todos</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
              {filtered.map(v => <VehicleCard key={v.id_vehiculo} vehiculo={v} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
