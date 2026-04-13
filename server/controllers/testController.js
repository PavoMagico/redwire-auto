const pool = require('../config/db');

/**
 * ALGORITMO DE AFINIDAD — Núcleo de Red Wire Auto
 * Puntúa cada vehículo sobre 100 comparándolo con las respuestas del Wizard.
 *
 * Respuestas esperadas: { presupuesto, plazas, motor, uso, familia, etiqueta }
 */
const calcularAfinidad = (v, r) => {
  let pts = 0;

  // 1. Presupuesto (30 pts)
  const diff = v.precio - r.presupuesto;
  if (diff <= 0)                               pts += 30;
  else if (diff / r.presupuesto <= 0.10)       pts += 20;
  else if (diff / r.presupuesto <= 0.20)       pts += 10;
  else if (diff / r.presupuesto <= 0.30)       pts += 5;

  // 2. Plazas (20 pts)
  if (v.plazas >= r.plazas)                    pts += 20;
  else if (v.plazas === r.plazas - 1)          pts += 10;

  // 3. Motor (20 pts)
  if (v.motor === r.motor) {
    pts += 20;
  } else {
    const compat = { Hibrid: ['Gasolina','Electrico'], Gasolina: ['Hibrid'], Electrico: ['Hibrid'] };
    if ((compat[r.motor] || []).includes(v.motor)) pts += 10;
  }

  // 4. Uso (15 pts)
  const urbano = v.precio < 22000 || ['ECO','ZERO'].includes(v.etiqueta);
  const sport  = v.plazas <= 2 || v.precio > 45000;
  if (r.uso === 'ciudad'    && urbano)  pts += 15;
  if (r.uso === 'carretera' && !urbano) pts += 15;
  if (r.uso === 'mixto')               pts += 10;
  if (r.uso === 'deportivo' && sport)  pts += 15;

  // 5. Familia (10 pts)
  const famOk = {
    soltero:          v => v.plazas <= 5,
    pareja:           v => v.plazas >= 2 && v.plazas <= 5,
    hijos:            v => v.plazas >= 5,
    familia_numerosa: v => v.plazas >= 7,
  }[r.familia];
  if (famOk && famOk(v)) pts += 10;

  // 6. Etiqueta (5 pts)
  if (!r.etiqueta || r.etiqueta === 'cualquiera') pts += 5;
  else if (v.etiqueta === r.etiqueta)              pts += 5;
  else if (r.etiqueta === 'ECO' && ['ZERO','ECO'].includes(v.etiqueta)) pts += 3;

  return Math.min(Math.round(pts), 100);
};

// POST /api/test/process
const processTest = async (req, res) => {
  const { respuestas, id_usuario } = req.body;
  if (!respuestas?.presupuesto)
    return res.status(400).json({ error: 'Respuestas incompletas.' });

  try {
    const [vehiculos] = await pool.query('SELECT * FROM vehiculos');
    const resultados = vehiculos
      .map(v => ({ ...v, afinidad: calcularAfinidad(v, respuestas) }))
      .filter(v => v.afinidad > 0)
      .sort((a, b) => b.afinidad - a.afinidad);

    if (id_usuario && resultados.length) {
      await Promise.allSettled(
        resultados.slice(0, 5).map(v =>
          pool.query('INSERT INTO tests (id_usuario,id_vehiculo,afinidad) VALUES (?,?,?)',
            [id_usuario, v.id_vehiculo, v.afinidad])
        )
      );
    }
    res.json({ total: resultados.length, resultados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el test.' });
  }
};

module.exports = { processTest };