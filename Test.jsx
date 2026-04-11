import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { testAPI } from '../services/api';

const preguntas = [
  {
    categoria: 'Estilo de vida',
    pregunta: '¿Cuál es tu situación familiar?',
    campo: 'familia',
    opciones: [
      { label: 'Soltero/a',        value: 'soltero' },
      { label: 'Solo pareja',       value: 'pareja' },
      { label: 'Con 1-2 hijos',     value: 'hijos' },
      { label: 'Familia numerosa',  value: 'familia_numerosa' },
    ],
  },
  {
    categoria: 'Uso del vehículo',
    pregunta: '¿Para qué usarás el coche principalmente?',
    campo: 'uso',
    opciones: [
      { label: 'Ciudad (corta distancia)',      value: 'ciudad' },
      { label: 'Carretera (viajes frecuentes)', value: 'carretera' },
      { label: 'Uso mixto',                     value: 'mixto' },
      { label: 'Conducción deportiva',          value: 'deportivo' },
    ],
  },
  {
    categoria: 'Preferencias técnicas',
    pregunta: '¿Qué tipo de motor prefieres?',
    campo: 'motor',
    opciones: [
      { label: 'Gasolina',              value: 'Gasolina' },
      { label: 'Diesel',                value: 'Diesel' },
      { label: 'Híbrido',               value: 'Hibrid' },
      { label: 'Eléctrico puro',        value: 'Electrico' },
    ],
  },
  {
    categoria: 'Preferencias técnicas',
    pregunta: '¿Cuántas plazas necesitas como mínimo?',
    campo: 'plazas',
    opciones: [
      { label: '2 plazas (solo yo)',   value: 2 },
      { label: '5 plazas (estándar)', value: 5 },
      { label: '7 plazas o más',      value: 7 },
    ],
  },
  {
    categoria: 'Presupuesto',
    pregunta: '¿Cuál es tu presupuesto máximo?',
    campo: 'presupuesto',
    opciones: [
      { label: 'Hasta 15.000 €',  value: 15000 },
      { label: 'Hasta 25.000 €',  value: 25000 },
      { label: 'Hasta 40.000 €',  value: 40000 },
      { label: 'Sin límite',      value: 100000 },
    ],
  },
  {
    categoria: 'Medioambiente',
    pregunta: '¿Te importa la etiqueta ambiental?',
    campo: 'etiqueta',
    opciones: [
      { label: 'ZERO emisiones',   value: 'ZERO' },
      { label: 'ECO o mejor',      value: 'ECO' },
      { label: 'Me da igual',      value: 'cualquiera' },
    ],
  },
];

export default function Test() {
  const [paso,      setPaso]      = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [loading,   setLoading]   = useState(false);
  const { user } = useAuth();
  const navigate  = useNavigate();

  const total     = preguntas.length;
  const actual    = preguntas[paso];
  const progreso  = Math.round((paso / total) * 100);

  const handleRespuesta = async (valor) => {
    const nuevas = { ...respuestas, [actual.campo]: valor };
    setRespuestas(nuevas);

    if (paso < total - 1) {
      setPaso(paso + 1);
    } else {
      setLoading(true);
      try {
        const { data } = await testAPI.process(nuevas, user?.id || null);
        navigate('/resultados', { state: { resultados: data.resultados } });
      } catch (err) {
        alert('Error al procesar el test. Revisa que el servidor esté corriendo.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--gris)' }}>Calculando tu afinidad...</p>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 640, marginTop: 40 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--gris)', marginBottom: 6 }}>
          Pregunta {paso + 1} de {total} · {actual.categoria}
        </p>
        {/* Barra de progreso */}
        <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, marginBottom: 24 }}>
          <div style={{ height: '100%', width: `${progreso}%`, background: 'var(--rojo)', borderRadius: 3, transition: 'width .4s' }} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700 }}>{actual.pregunta}</h2>
      </div>

      {/* Opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {actual.opciones.map(op => (
          <button
            key={op.value}
            onClick={() => handleRespuesta(op.value)}
            style={{
              padding: '18px 24px',
              fontSize: 16,
              fontWeight: 500,
              background: 'white',
              border: '2px solid var(--border)',
              borderRadius: 12,
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rojo)'; e.currentTarget.style.color = 'var(--rojo)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = ''; }}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Volver */}
      {paso > 0 && (
        <button
          onClick={() => setPaso(paso - 1)}
          style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--gris)', fontSize: 14, cursor: 'pointer' }}
        >
          ← Volver
        </button>
      )}
    </div>
  );
}