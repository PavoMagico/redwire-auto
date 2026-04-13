import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = p => pathname === p ? { color: 'var(--rojo)', fontWeight: 600 } : {};

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 17, letterSpacing: 1 }}>
          <span style={{ color: 'var(--rojo)' }}>RED</span> WIRE AUTO
        </Link>
        <div style={{ display: 'flex', gap: 24, flex: 1 }}>
          <Link to="/"              style={active('/')}>Inicio</Link>
          <Link to="/test"          style={active('/test')}>Test</Link>
          <Link to="/concesionario" style={active('/concesionario')}>Concesionario</Link>
          {user && <Link to="/garaje" style={active('/garaje')}>Mi Garaje</Link>}
          {isAdmin && <Link to="/admin" style={{ ...active('/admin'), color: 'var(--rojo)' }}>Admin</Link>}
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--gris)' }}>Hola, {user.nombre.split(' ')[0]}</span>
              <button onClick={() => { logout(); navigate('/'); }}
                style={{ fontSize: 13, color: 'var(--gris)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}