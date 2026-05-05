import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const isActive = p => pathname === p ? 'active' : '';
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const links = (
    <>
      <li><Link to="/" className={isActive('/')} onClick={close}>Inicio</Link></li>
      <li><Link to="/test" className={isActive('/test')} onClick={close}>Test</Link></li>
      <li><Link to="/concesionario" className={isActive('/concesionario')} onClick={close}>Concesionario</Link></li>
      {user && <li><Link to="/garaje" className={isActive('/garaje')} onClick={close}>Mi Garaje</Link></li>}
      {isAdmin && <li><Link to="/admin" className={isActive('/admin')} onClick={close} style={{ color: 'var(--rojo)' }}>Admin</Link></li>}
    </>
  );

  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand" onClick={close}>
          <Logo size={28} />
        </Link>

        {/* Desktop links */}
        <ul className="nav-desktop">
          {links}
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
                onClick={() => { logout(); navigate('/'); close(); }}
                style={{ fontSize: 13 }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 13 }}>Entrar</Link>
              <Link to="/test" className="btn btn-red nav-cta-desktop">
                Empezar test <span className="arrow">→</span>
              </Link>
            </>
          )}
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="nav-mobile-overlay" onClick={close}>
          <ul className="nav-mobile-menu" onClick={e => e.stopPropagation()}>
            {links}
          </ul>
        </div>
      )}
    </>
  );
}
