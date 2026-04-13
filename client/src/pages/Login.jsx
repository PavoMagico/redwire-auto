import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || 'Error al iniciar sesión.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 420, paddingTop: 60 }}>
      <div className="card">
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Iniciar sesión</h2>
        <p style={{ color: 'var(--gris)', fontSize: 14, marginBottom: 28 }}>Accede a tu Garaje Digital</p>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #f5c5c5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#c0392b' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
            <input type="email" placeholder="tu@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Contraseña</label>
            <input type="password" placeholder="••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gris)' }}>
          ¿Sin cuenta? <Link to="/registro" style={{ color: 'var(--rojo)', fontWeight: 500 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}