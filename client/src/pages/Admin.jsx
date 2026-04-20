import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';
import CarSilhouette, { variantFromPlazas } from '../components/CarSilhouette';
import EnvBadge from '../components/EnvBadge';

const EMPTY = { marca: '', modelo: '', precio: '', motor: 'Gasolina', etiqueta: 'ECO', plazas: '5', detalles: '' };

function Spark({ values, width = 140, height = 28 }) {
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke="var(--rojo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function Admin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [msg,       setMsg]       = useState('');
  const [tab,       setTab]       = useState('vehiculos');
  const [showForm,  setShowForm]  = useState(false);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { const { data } = await vehiclesAPI.getAll(); setVehiculos(data); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editId ? await vehiclesAPI.update(editId, form) : await vehiclesAPI.create(form);
      setMsg(editId ? 'Vehículo actualizado.' : 'Vehículo creado.');
      setForm(EMPTY); setEditId(null); setShowForm(false); fetchData();
    } catch (err) { setMsg(err.response?.data?.error || 'Error.'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (v) => {
    setEditId(v.id_vehiculo);
    setForm({ marca: v.marca, modelo: v.modelo, precio: v.precio, motor: v.motor, etiqueta: v.etiqueta, plazas: v.plazas, detalles: v.detalles || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    await vehiclesAPI.delete(id);
    setVehiculos(v => v.filter(x => x.id_vehiculo !== id));
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); setShowForm(false); };

  return (
    <div className="screen page wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="eyebrow">Panel de administración</div>
          <h1 style={{ fontSize: 40, fontWeight: 600, marginTop: 10 }}>Control Center</h1>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { l: 'Vehículos activos', v: vehiculos.length, c: 'var(--rojo)' },
          { l: 'Tests completados', v: '—', c: 'var(--ink)' },
          { l: 'Match medio', v: '94 %', c: 'var(--ink)' },
          { l: 'Stock total', v: '—', c: 'var(--ink)' },
        ].map((s, i) => (
          <div key={i} className="bounce-in" style={{
            animationDelay: `${i * .08}s`,
            background: 'var(--bg)', border: '1px solid rgba(1,0,1,.08)', borderRadius: 'var(--radius-l)', padding: 22,
          }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em', color: 'var(--grafito)', textTransform: 'uppercase' }}>{s.l}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginTop: 8, color: s.c }}>{s.v}</div>
            <div style={{ marginTop: 10 }}>
              <Spark values={[4, 6, 5, 7, 8, 7, 9, 11, 10, 13]} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center' }}>
        {['vehiculos', 'usuarios', 'tests'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: tab === t ? 'var(--ink)' : 'var(--bg-2)',
            color: tab === t ? 'var(--bg)' : 'var(--ink)',
            transition: 'all .3s var(--spring-bounce)', border: 'none', cursor: 'pointer',
          }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn btn-red" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }}>
          <PlusIcon /> Nuevo vehículo
        </button>
      </div>

      {msg && <div style={{ marginBottom: 12, color: 'var(--rojo)', fontSize: 14, fontWeight: 500 }}>{msg}</div>}

      {/* Inline form */}
      {showForm && (
        <div className="bounce-in" style={{
          background: 'var(--bg)', border: '1px solid rgba(1,0,1,.08)', borderRadius: 'var(--radius-l)',
          padding: 28, marginBottom: 18,
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 20 }}>{editId ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[['Marca', 'marca'], ['Modelo', 'modelo'], ['Precio €', 'precio']].map(([l, k]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</label>
                <input className="field-input" type={k === 'precio' ? 'number' : 'text'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required />
              </div>
            ))}
            {[['Motor', 'motor', ['Gasolina', 'Diesel', 'Hibrid', 'Electrico']], ['Etiqueta', 'etiqueta', ['ZERO', 'ECO', 'C', 'B']]].map(([l, k, opts]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</label>
                <select className="field-input" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>Plazas</label>
              <input className="field-input" type="number" min="2" max="9" value={form.plazas} onChange={e => setForm({ ...form, plazas: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>Descripción</label>
              <textarea className="field-input" rows={2} value={form.detalles} onChange={e => setForm({ ...form, detalles: e.target.value })} style={{ resize: 'vertical', height: 'auto' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-red">{editId ? 'Guardar cambios' : 'Crear vehículo'}</button>
              <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'vehiculos' && (
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-l)', border: '1px solid rgba(1,0,1,.08)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1.8fr 1fr 80px 1fr 80px 1fr', padding: '14px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em', color: 'var(--grafito)', textTransform: 'uppercase', borderBottom: '1px solid rgba(1,0,1,.08)' }}>
            <div>ID</div><div>Vehículo</div><div>Motor</div><div>Etiq.</div><div>Precio</div><div>Plazas</div><div></div>
          </div>
          {vehiculos.map((v, i) => (
            <div key={v.id_vehiculo} style={{
              display: 'grid', gridTemplateColumns: '60px 1.8fr 1fr 80px 1fr 80px 1fr',
              padding: '14px 20px', alignItems: 'center',
              borderTop: i === 0 ? 0 : '1px solid rgba(1,0,1,.04)',
              fontSize: 14, transition: 'background .2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-2)'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--grafito)' }}>#{String(v.id_vehiculo).padStart(3, '0')}</div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 40, height: 28, background: 'var(--bg-3)', borderRadius: 6, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <CarSilhouette variant={variantFromPlazas(v.plazas)} style={{ width: 32 }} />
                </span>
                {v.marca} {v.modelo}
              </div>
              <div style={{ color: 'var(--grafito)' }}>{v.motor}</div>
              <div><EnvBadge type={v.etiqueta} /></div>
              <div style={{ fontWeight: 600 }}>{Number(v.precio).toLocaleString('es-ES')} €</div>
              <div style={{ color: 'var(--grafito)' }}>{v.plazas}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => handleEdit(v)} style={{ fontSize: 12, color: 'var(--rojo)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => handleDelete(v.id_vehiculo)} style={{ fontSize: 12, color: 'var(--grafito)', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'usuarios' && (
        <div style={{ padding: 60, textAlign: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-l)', border: '1px solid rgba(1,0,1,.08)' }}>
          <div style={{ fontSize: 48 }}>👥</div>
          <h3 style={{ marginTop: 12 }}>Gestión de usuarios</h3>
          <p style={{ marginTop: 6 }}>CRUD de usuarios con roles admin/user.</p>
        </div>
      )}
      {tab === 'tests' && (
        <div style={{ padding: 60, textAlign: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-l)', border: '1px solid rgba(1,0,1,.08)' }}>
          <div style={{ fontSize: 48 }}>📊</div>
          <h3 style={{ marginTop: 12 }}>Histórico de tests</h3>
          <p style={{ marginTop: 6 }}>Analítica de respuestas y perfiles más comunes.</p>
        </div>
      )}
    </div>
  );
}
