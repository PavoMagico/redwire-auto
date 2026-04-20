import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const isActive = p => pathname === p ? 'active' : '';

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        <Logo size={28} />
      </Link>

      <ul>
        <li><Link to="/" className={isActive('/')}>Inicio</Link></li>
        <li><Link to="/test" className={isActive('/test')}>Test</Link></li>
        <li><Link to="/concesionario" className={isActive('/concesionario')}>Concesionario</Link></li>
        {user && <li><Link to="/garaje" className={isActive('/garaje')}>Mi Garaje</Link></li>}
        {isAdmin && <li><Link to="/admin" className={isActive('/admin')} style={{ color: 'var(--rojo)' }}>Admin</Link></li>}
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              boxShadow: 'inset 0 0 0 1px rgba(1,0,1,.12)',
              fontSize: 14, fontWeight: 500
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--rojo)', color: 'white',
                display: 'inline-grid', placeItems: 'center',
                fontSize: 11, fontWeight: 700
              }}>
                {user.nombre?.[0]?.toUpperCase() || 'U'}
              </span>
              {user.nombre?.split(' ')[0]}
            </div>
            <button className="btn btn-ghost"
              onClick={() => { logout(); navigate('/'); }}
              style={{ fontSize: 13 }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: 13 }}>Entrar</Link>
            <Link to="/test" className="btn btn-red">
              Empezar test <span className="arrow">→</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
