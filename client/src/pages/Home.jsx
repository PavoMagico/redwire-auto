import { useNavigate } from 'react-router-dom';

const segmentos = [
  { titulo: 'Dominguero', desc: 'No todos quieren lo mismo de un coche, algunos no necesitan hipotecas. Ni duchas.', emoji: '🚗' },
  { titulo: 'Familia numerosa', desc: 'Un Miata es precioso, pero no te caben 27 muebles y 4 niños. Aquí encontrarás lo que sí te cabe.', emoji: '👨‍👩‍👧‍👦' },
  { titulo: 'Aficionado', desc: 'No hay que jubilarse para tener el espíritu de un jubilado. Cómprate el Miata.', emoji: '🏎️' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ background: 'var(--negro)', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              "Dime qué conduces<br />y te diré quién eres"
            </h1>
            <p style={{ fontSize: 16, color: '#A39796', marginBottom: 32, lineHeight: 1.7 }}>
              Red Wire Auto es una solución divertida y fácil para aquellas personas que se enfrentan al mercado automovilístico en 2026.
            </p>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={() => navigate('/test')}>
              Iniciar mi test →
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 100 }}>🚘</div>
        </div>
      </div>
      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 64 }}>
          {segmentos.map(s => (
            <div key={s.titulo} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{s.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.titulo}</h3>
              <p style={{ fontSize: 14, color: 'var(--gris)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>Todo lo que necesitas, y un poco más.</h2>
            <p style={{ color: 'var(--gris)', lineHeight: 1.7 }}>
              Con nuestro test puedes hacerte una idea de qué es lo que más vas a disfrutar de forma realista, y luego comparar entre tus opciones.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: '🏪', t: 'Concesionario', d: 'Echa un vistazo a los vehículos disponibles y sus características.' },
              { icon: '🔄', t: 'Tu Test Personal', d: 'Descubre qué necesitas según tu personalidad y estilo de vida.' },
              { icon: '⭐', t: 'Garaje', d: 'Guarda tus resultados. No tus preferidos, los tuyos.' },
            ].map(f => (
              <div key={f.t} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
                <div><h4 style={{ fontWeight: 700, marginBottom: 4 }}>{f.t}</h4>
                  <p style={{ fontSize: 14, color: 'var(--gris)' }}>{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}