const pool = require('../config/db');

/**
 * ALGORITMO DE AFINIDAD — Núcleo de Red Wire Auto
 * Puntúa cada vehículo sobre 100 comparándolo con las respuestas del Wizard.
 *
 * Respuestas esperadas: { presupuesto, plazas, motor, uso, familia, etiqueta, carroceria, prioridad, descapotable }
 */
const calcularAfinidad = (v, r) => {
  let pts = 0;

  // 1. Presupuesto (25 pts)
  const diff = v.precio - r.presupuesto;
  if (diff <= 0)                               pts += 25;
  else if (diff / r.presupuesto <= 0.10)       pts += 17;
  else if (diff / r.presupuesto <= 0.20)       pts += 8;
  else if (diff / r.presupuesto <= 0.30)       pts += 4;

  // 2. Plazas (15 pts)
  if (v.plazas >= r.plazas)                    pts += 15;
  else if (v.plazas === r.plazas - 1)          pts += 7;

  // 3. Motor (15 pts)
  if (v.motor === r.motor) {
    pts += 15;
  } else {
    const compat = { Hibrid: ['Gasolina','Electrico'], Gasolina: ['Hibrid'], Electrico: ['Hibrid'] };
    if ((compat[r.motor] || []).includes(v.motor)) pts += 7;
  }

  // 4. Uso (10 pts)
  const urbano = v.precio < 22000 || ['ECO','ZERO'].includes(v.etiqueta);
  const sport  = v.carroceria === 'deportivo' || v.plazas <= 2;
  if (r.uso === 'ciudad'    && urbano)  pts += 10;
  if (r.uso === 'carretera' && !urbano) pts += 10;
  if (r.uso === 'mixto')                pts += 7;
  if (r.uso === 'deportivo' && sport)   pts += 10;

  // 5. Familia (10 pts)
  const famOk = {
    soltero:          v => v.plazas <= 5,
    pareja:           v => v.plazas >= 2 && v.plazas <= 5,
    hijos:            v => v.plazas >= 5,
    familia_numerosa: v => v.plazas >= 7,
  }[r.familia];
  if (famOk && famOk(v)) pts += 10;

  // 6. Carrocería (10 pts)
  const carroMap = { suv: 'suv', berlina: 'berlina', compacto: 'compacto', deportivo: 'deportivo' };
  if (r.carroceria && carroMap[r.carroceria] === v.carroceria) pts += 10;
  else if (r.carroceria === 'deportivo' && v.carroceria === 'compacto') pts += 3;

  // 7. Prioridad (10 pts)
  if (r.prioridad === 'diversion') {
    if (v.carroceria === 'deportivo' || v.plazas <= 2) pts += 10;
    else if (v.plazas <= 4) pts += 4;
  } else if (r.prioridad === 'confort') {
    if (v.carroceria === 'berlina' || v.carroceria === 'suv') pts += 10;
  } else if (r.prioridad === 'eficiencia') {
    if (['ECO','ZERO'].includes(v.etiqueta)) pts += 10;
    else pts += 3;
  } else if (r.prioridad === 'practicidad') {
    if (v.plazas >= 5 && (v.carroceria === 'suv' || v.carroceria === 'monovolumen')) pts += 10;
    else if (v.plazas >= 5) pts += 5;
  }

  // 8. Descapotable (5 pts)
  if (r.descapotable === 'imprescindible') {
    if (v.descapotable) pts += 5; else pts -= 5;
  } else if (r.descapotable === 'gustaria') {
    if (v.descapotable) pts += 5;
  } else if (r.descapotable === 'no') {
    if (v.descapotable) pts -= 3;
  } else {
    // 'igual' → no afecta
  }

  return Math.max(0, Math.min(Math.round(pts), 100));
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
