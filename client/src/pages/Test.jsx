import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { testAPI } from '../services/api';

const CATEGORIAS = [
  { label: 'Estilo de vida', icon: '🏡' },
  { label: 'Uso del vehículo', icon: '🛣️' },
  { label: 'Preferencias técnicas', icon: '⚙️' },
];

const preguntas = [
  { categoria: 0, pregunta: '¿Cuál es tu situación familiar?', campo: 'familia',
    opciones: [
      { label: 'Soltero/a',        value: 'soltero' },
      { label: 'Solo pareja',       value: 'pareja' },
      { label: 'Con 1-2 hijos',     value: 'hijos' },
      { label: 'Familia numerosa',  value: 'familia_numerosa' },
    ]},
  { categoria: 1, pregunta: '¿Para qué usarás el coche principalmente?', campo: 'uso',
    opciones: [
      { label: 'Ciudad (corta distancia)',      value: 'ciudad' },
      { label: 'Carretera (viajes frecuentes)', value: 'carretera' },
      { label: 'Uso mixto',                     value: 'mixto' },
      { label: 'Conducción deportiva',          value: 'deportivo' },
    ]},
  { categoria: 2, pregunta: '¿Qué tipo de motor prefieres?', campo: 'motor',
    opciones: [
      { label: 'Gasolina',       value: 'Gasolina' },
      { label: 'Diesel',         value: 'Diesel' },
      { label: 'Híbrido',        value: 'Hibrid' },
      { label: 'Eléctrico puro', value: 'Electrico' },
    ]},
  { categoria: 2, pregunta: '¿Cuántas plazas necesitas como mínimo?', campo: 'plazas',
    opciones: [
      { label: '2 plazas (solo yo)',  value: 2 },
      { label: '5 plazas (estándar)', value: 5 },
      { label: '7 plazas o más',      value: 7 },
    ]},
  { categoria: 0, pregunta: '¿Cuál es tu presupuesto máximo?', campo: 'presupuesto',
    opciones: [
      { label: 'Hasta 15.000 €', value: 15000 },
      { label: 'Hasta 25.000 €', value: 25000 },
      { label: 'Hasta 40.000 €', value: 40000 },
      { label: 'Sin límite',     value: 100000 },
    ]},
  { categoria: 1, pregunta: '¿Te importa la etiqueta ambiental?', campo: 'etiqueta',
    opciones: [
      { label: 'ZERO emisiones', value: 'ZERO' },
      { label: 'ECO o mejor',    value: 'ECO' },
      { label: 'Me da igual',    value: 'cualquiera' },
    ]},
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function Test() {
  const [paso,       setPaso]       = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [loading,    setLoading]    = useState(false);
  const [dir,        setDir]        = useState(1);
  const { user } = useAuth();
  const navigate  = useNavigate();

  const actual   = preguntas[paso];
  const progreso = Math.round((paso / preguntas.length) * 100);

  const catsMeta = CATEGORIAS.map((c, i) => {
    const qs = preguntas.filter(q => q.categoria === i);
    const completed = qs.filter(q => respuestas[q.campo] !== undefined).length;
    const active = actual.categoria === i;
    return { ...c, size: qs.length, completed, active };
  });

  const handleRespuesta = async (valor) => {
    const nuevas = { ...respuestas, [actual.campo]: valor };
    setRespuestas(nuevas);
    if (paso < preguntas.length - 1) {
      setDir(1);
      setPaso(paso + 1);
    } else {
      setLoading(true);
      try {
        const { data } = await testAPI.process(nuevas, user?.id || null);
        navigate('/resultados', { state: { resultados: data.resultados } });
      } catch {
        alert('Error al procesar el test. Comprueba que el servidor está corriendo.');
      } finally { setLoading(false); }
    }
  };

  const handleBack = () => {
    if (paso > 0) { setDir(-1); setPaso(paso - 1); }
    else navigate('/');
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--grafito)', marginTop: 12 }}>Calculando tu afinidad...</p>
    </div>
  );

  return (
    <div className="screen" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <button className="btn btn-ghost" onClick={handleBack} style={{ fontSize: 13 }}>
          <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}><ArrowIcon /></span>
          {paso === 0 ? 'Volver' : 'Atrás'}
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', color: 'var(--grafito)' }}>
          PREGUNTA <strong style={{ color: 'var(--ink)' }}>{String(paso + 1).padStart(2, '0')}</strong> / {String(preguntas.length).padStart(2, '0')}
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ fontSize: 13 }}>
          Cancelar <CloseIcon />
        </button>
      </div>

      {/* CATEGORY CHIPS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
        {catsMeta.map((c, i) => (
          <div key={i} style={{
            padding: '14px 18px', borderRadius: 14,
            background: c.active ? 'var(--ink)' : (c.completed === c.size ? 'var(--bg-2)' : 'transparent'),
            color: c.active ? 'var(--bg)' : 'var(--ink)',
            border: c.active ? '1px solid var(--ink)' : '1px solid rgba(1,0,1,.1)',
            display: 'flex', alignItems: 'center', gap: 12,
            transition: 'all .4s var(--spring-bounce)',
            transform: c.active ? 'scale(1.02)' : 'scale(1)',
          }}>
            <span style={{ fontSize: 22 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', opacity: .7, textTransform: 'uppercase' }}>
                CATEGORÍA {i + 1}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>{c.label}</div>
            </div>
            {c.completed === c.size ? (
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: 'var(--rojo)',
                color: 'white', display: 'grid', placeItems: 'center', fontSize: 12,
              }}>✓</span>
            ) : (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: .7 }}>{c.completed}/{c.size}</div>
            )}
          </div>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div style={{ position: 'relative', height: 6, background: 'var(--bg-3)', borderRadius: 999, marginBottom: 56, overflow: 'visible' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${progreso}%`,
          background: 'linear-gradient(90deg, var(--rojo), var(--rojo-deep))',
          borderRadius: 999,
          transition: 'width .55s var(--spring-bounce)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${progreso}%`,
          width: 18, height: 18, background: 'var(--rojo)', borderRadius: '50%',
          boxShadow: '0 0 0 4px rgba(190,61,61,.25)',
          animation: 'pulseDot 1.4s ease-in-out infinite',
          transition: 'left .55s var(--spring-bounce)',
        }} />
      </div>

      {/* QUESTION */}
      <div key={paso} style={{ animation: dir > 0 ? 'qIn .55s var(--spring-bounce) both' : 'qBack .55s var(--spring-bounce) both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <div className="eyebrow">{CATEGORIAS[actual.categoria].icon} {CATEGORIAS[actual.categoria].label}</div>
            <h2 style={{ marginTop: 18, fontSize: 44, fontWeight: 600, lineHeight: 1.05 }}>
              {actual.pregunta}
            </h2>
            <p style={{ marginTop: 16, fontSize: 14 }}>No hay respuestas malas. Solo respuestas honestas.</p>

            {/* Dot progress */}
            <div style={{ marginTop: 32, display: 'flex', gap: 4 }}>
              {preguntas.map((_, i) => (
                <span key={i} style={{
                  width: i === paso ? 18 : 6, height: 6, borderRadius: 999,
                  background: i < paso ? 'var(--rojo)' : (i === paso ? 'var(--ink)' : 'var(--bg-3)'),
                  transition: 'all .4s var(--spring-bounce)',
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {actual.opciones.map((op, i) => (
              <button
                key={op.value}
                onClick={() => handleRespuesta(op.value)}
                style={{
                  textAlign: 'left', padding: '22px 24px', borderRadius: 'var(--radius)',
                  background: 'var(--bg)', color: 'var(--ink)',
                  border: '1px solid rgba(1,0,1,.1)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 17, fontWeight: 500,
                  transition: 'all .3s var(--spring-bounce)',
                  animation: `bounceIn .5s var(--spring-bounce) ${i * .08}s both`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(6px) scale(1.01)';
                  e.currentTarget.style.borderColor = 'var(--ink)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(1,0,1,.1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: 'var(--bg-3)', color: 'var(--grafito)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {op.label}
                </span>
                <span style={{ opacity: .4 }}><ArrowIcon /></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes qIn {
          from { opacity: 0; transform: translateX(40px) scale(.98); }
          60%  { opacity: 1; transform: translateX(-8px) scale(1); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes qBack {
          from { opacity: 0; transform: translateX(-40px) scale(.98); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
