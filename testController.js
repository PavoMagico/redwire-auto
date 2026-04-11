const pool = require('../config/db');

/**
 * ALGORITMO DE AFINIDAD — Núcleo de Red Wire Auto
 * Puntúa cada vehículo del catálogo contra las respuestas del Wizard.
 * Máximo 100 puntos distribuidos en 6 criterios.
 *
 * Respuestas esperadas:
 * { presupuesto: number, plazas: number, motor: string,
 *   uso: string, familia: string, etiqueta: string|null }
 */
const calcularAfinidad = (vehiculo, r) => {
  let pts = 0;

  // 1. Presupuesto (30 pts)
  const diff = vehiculo.precio - r.presupuesto;
  if (diff <= 0)              pts += 30;
  else if (diff / r.presupuesto <= 0.10) pts += 20;
  else if (diff / r.presupuesto <= 0.20) pts += 10;
  else if (diff / r.presupuesto <= 0.30) pts += 5;

  // 2. Plazas (20 pts)
  if (vehiculo.plazas >= r.plazas)       pts += 20;
  else if (vehiculo.plazas === r.plazas - 1) pts += 10;

  // 3. Motor (20 pts)
  if (vehiculo.motor === r.motor) {
    pts += 20;
  } else {
    const compat = { Hibrid: ['Gasolina','Electrico'], Gasolina: ['Hibrid'], Electrico: ['Hibrid'] };
    if ((compat[r.motor] || []).includes(vehiculo.motor)) pts += 10;
  }

  // 4. Uso (15 pts)
  const esUrbano  = vehiculo.precio < 22000 || ['ECO','ZERO'].includes(vehiculo.etiqueta);
  const esGrande  = vehiculo.plazas >= 7;
  const esSport   = vehiculo.plazas <= 2 || vehiculo.precio > 45000;
  if (r.uso === 'ciudad'    && esUrbano)  pts += 15;
  if (r.uso === 'carretera' && !esUrbano) pts += 15;
  if (r.uso === 'mixto')                  pts += 10;
  if (r.uso === 'deportivo' && esSport)  pts += 15;

  // 5. Familia (10 pts)
  const famOk = {
    soltero: v => v.plazas <= 5,
    pareja:  v => v.plazas >= 2 && v.plazas <= 5,
    hijos:   v => v.plazas >= 5,
    familia_numerosa: v => v.plazas >= 7,
  }[r.familia];
  if (famOk && famOk(vehiculo)) pts += 10;

  // 6. Etiqueta (5 pts)
  if (!r.etiqueta || r.etiqueta === 'cualquiera') pts += 5;
  else if (vehiculo.etiqueta === r.etiqueta)        pts += 5;
  else if (r.etiqueta === 'ECO' && ['ZERO','ECO'].includes(vehiculo.etiqueta)) pts += 3;

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

    // Guardar historial si hay usuario registrado
    if (id_usuario && resultados.length > 0) {
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