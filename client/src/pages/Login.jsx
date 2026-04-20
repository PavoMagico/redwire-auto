import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--grafito)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} type={type}
        className="field-input"
      />
    </label>
  );
}

export default function Login({ defaultMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const [mode, setMode]     = useState(searchParams.get('mode') || defaultMode);
  const [nombre, setNombre] = useState('');
  const [email,  setEmail]  = useState('');
  const [pass,   setPass]   = useState('');
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await authAPI.login({ email, password: pass });
        login(data.user, data.token);
      } else {
        const { data } = await authAPI.register({ nombre, email, password: pass });
        login(data.user, data.token);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || (mode === 'login' ? 'Error al iniciar sesión.' : 'Error al registrarse.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="screen" style={{ minHeight: 'calc(100vh - 200px)', display: 'grid', placeItems: 'center', padding: '60px 20px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        maxWidth: 980, width: '100%',
        background: 'var(--bg)', borderRadius: 'var(--radius-xl)',
        overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Left visual panel */}
        <div style={{
          padding: 48, background: 'var(--ink)', color: 'var(--bg)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 560,
        }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .2 }} viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden>
            <path d="M-20 120 Q 100 140, 200 100 T 420 140" stroke="var(--rojo)" strokeWidth="2" fill="none" className="wire-draw" />
            <path d="M-20 300 Q 160 260, 220 320 T 420 300" stroke="var(--rojo)" strokeWidth="2" fill="none" className="wire-draw" style={{ animationDelay: '.2s' }} />
            <path d="M-20 480 Q 100 440, 200 500 T 420 460" stroke="var(--rojo)" strokeWidth="2" fill="none" className="wire-draw" style={{ animationDelay: '.4s' }} />
          </svg>
          <div style={{ position: 'relative' }}>
            <Logo size={32} />
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', color: 'var(--rojo)' }}>UN TEST, TU COCHE</div>
            <h2 style={{ marginTop: 12, color: 'var(--bg)', fontSize: 36 }}>Tu garaje te está esperando.</h2>
            <p style={{ marginTop: 12, color: 'var(--topo-2)' }}>Guarda tus matches, compara y decide sin prisa. Todo queda guardado.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 1 ? 'var(--rojo)' : 'rgba(255,255,255,.15)' }} />
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-2)', borderRadius: 999, padding: 4, width: 'fit-content', marginBottom: 28 }}>
            {[['login', 'Entrar'], ['registro', 'Registrarme']].map(([m, label]) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(''); }} style={{
                padding: '8px 18px', borderRadius: 999,
                background: mode === m ? 'var(--ink)' : 'transparent',
                color: mode === m ? 'var(--bg)' : 'var(--ink)',
                fontSize: 13, fontWeight: 600, transition: 'all .3s var(--spring-bounce)',
                border: 'none', cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>

          <h2 style={{ fontSize: 32 }}>{mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}</h2>
          <p style={{ marginTop: 4, marginBottom: 24, fontSize: 15 }}>
            {mode === 'login' ? 'Entra y recupera tu garaje.' : '30 segundos y estás dentro.'}
          </p>

          {error && (
            <div style={{ background: 'rgba(190,61,61,.08)', border: '1px solid rgba(190,61,61,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: 'var(--rojo)' }}>
              {error}
            </div>
          )}

          {mode === 'registro' && (
            <Field label="Nombre" value={nombre} onChange={setNombre} placeholder="Tu nombre" />
          )}
          <Field label="Email" value={email} onChange={setEmail} placeholder="tú@correo.com" type="email" />
          <Field label="Contraseña" value={pass} onChange={setPass} placeholder="••••••••" type="password" />

          <button type="submit" className="btn btn-red btn-xl" style={{ marginTop: 12 }} disabled={loading}>
            {loading ? (mode === 'login' ? 'Entrando...' : 'Creando cuenta...') : (mode === 'login' ? 'Entrar' : 'Crear cuenta')}
            {!loading && <span className="arrow">→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
