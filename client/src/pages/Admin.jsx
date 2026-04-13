import { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';

const EMPTY = { marca:'', modelo:'', precio:'', motor:'Gasolina', etiqueta:'ECO', plazas:'5', detalles:'' };

export default function Admin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [msg,       setMsg]       = useState('');

  useEffect(() => { fetch(); }, []);
  const fetch = async () => { const { data } = await vehiclesAPI.getAll(); setVehiculos(data); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editId ? await vehiclesAPI.update(editId, form) : await vehiclesAPI.create(form);
      setMsg(editId ? 'Vehículo actualizado.' : 'Vehículo creado.');
      setForm(EMPTY); setEditId(null); fetch();
    } catch (err) { setMsg(err.response?.data?.error || 'Error.'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (v) => {
    setEditId(v.id_vehiculo);
    setForm({ marca:v.marca, modelo:v.modelo, precio:v.precio, motor:v.motor, etiqueta:v.etiqueta, plazas:v.plazas, detalles:v.detalles||'' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    await vehiclesAPI.delete(id);
    setVehiculos(v => v.filter(x => x.id_vehiculo !== id));
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Panel de Administración</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{editId ? 'Editar vehículo' : 'Añadir vehículo'}</h2>
          {msg && <p style={{ marginBottom: 12, color: 'var(--rojo)', fontSize: 14 }}>{msg}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Marca','marca'],['Modelo','modelo'],['Precio €','precio']].map(([l,k]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 4 }}>{l.toUpperCase()}</label>
                <input type={k==='precio'?'number':'text'} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required />
              </div>
            ))}
            {[['MOTOR','motor',['Gasolina','Diesel','Hibrid','Electrico']],['ETIQUETA','etiqueta',['ZERO','ECO','C','B']]].map(([l,k,opts]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 4 }}>{l}</label>
                <select value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 4 }}>PLAZAS</label>
              <input type="number" min="2" max="9" value={form.plazas} onChange={e => setForm({...form,plazas:e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gris)', display: 'block', marginBottom: 4 }}>DETALLES</label>
              <textarea rows={3} value={form.detalles} onChange={e => setForm({...form,detalles:e.target.value})} style={{ resize:'vertical' }} />
            </div>
            <button className="btn-primary" type="submit" style={{ marginTop: 4 }}>
              {editId ? 'Guardar cambios' : 'Crear vehículo'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }}
              style={{ background:'none', border:'1px solid var(--border)', borderRadius:8, padding:8, cursor:'pointer', fontSize:13 }}>
              Cancelar
            </button>}
          </form>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Marca','Modelo','Precio','Motor','Etiq.','Plazas',''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, color: 'var(--gris)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehiculos.map(v => (
                <tr key={v.id_vehiculo} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px' }}>{v.marca}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.modelo}</td>
                  <td style={{ padding: '10px 12px' }}>{Number(v.precio).toLocaleString('es-ES')} €</td>
                  <td style={{ padding: '10px 12px' }}>{v.motor}</td>
                  <td style={{ padding: '10px 12px' }}><span className={`etiqueta etiqueta-${v.etiqueta}`}>{v.etiqueta}</span></td>
                  <td style={{ padding: '10px 12px' }}>{v.plazas}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => handleEdit(v)} style={{ marginRight: 8, fontSize: 12, color: 'var(--rojo)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                    <button onClick={() => handleDelete(v.id_vehiculo)} style={{ fontSize: 12, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}