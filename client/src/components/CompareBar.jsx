import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../hooks/useCompare';

export default function CompareBar() {
  const [list, setList] = useState([]);
  const { getList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  const refresh = () => setList(getList());

  useEffect(() => {
    refresh();
    window.addEventListener('compare-updated', refresh);
    return () => window.removeEventListener('compare-updated', refresh);
  }, []);

  if (list.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, background: 'var(--ink)', color: 'var(--bg)',
      borderRadius: 999, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,.3)',
      animation: 'bounceIn .4s var(--spring-bounce)',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--rojo)', color: 'white',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
        }}>{list.length}</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {list.map(v => `${v.marca} ${v.modelo}`).join(' vs ')}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => navigate('/comparar')}
          className="btn btn-red"
          style={{ borderRadius: 999, fontSize: 13, padding: '8px 18px' }}
        >
          Comparar →
        </button>
        <button
          onClick={clearCompare}
          style={{
            background: 'rgba(255,255,255,.1)', border: 'none', color: 'var(--bg)',
            borderRadius: 999, fontSize: 13, padding: '8px 14px', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
