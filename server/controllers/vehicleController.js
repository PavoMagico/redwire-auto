const pool = require('../config/db');

// GET /api/vehicles
const getVehicles = async (req, res) => {
  const { motor, etiqueta, plazas_min, precio_min, precio_max, marca } = req.query;
  let q = 'SELECT * FROM vehiculos WHERE 1=1';
  const p = [];
  if (motor)      { q += ' AND motor = ?';    p.push(motor); }
  if (etiqueta)   { q += ' AND etiqueta = ?'; p.push(etiqueta); }
  if (marca)      { q += ' AND marca = ?';    p.push(marca); }
  if (plazas_min) { q += ' AND plazas >= ?';  p.push(+plazas_min); }
  if (precio_min) { q += ' AND precio >= ?';  p.push(+precio_min); }
  if (precio_max) { q += ' AND precio <= ?';  p.push(+precio_max); }
  q += ' ORDER BY precio ASC';
  try {
    const [rows] = await pool.query(q, p);
    res.json(rows);
  } catch { res.status(500).json({ error: 'Error al obtener vehículos.' }); }
};

// GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id_vehiculo = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado.' });
    res.json(rows[0]);
  } catch { res.status(500).json({ error: 'Error.' }); }
};

// POST /api/admin/catalog
const createVehicle = async (req, res) => {
  const { marca, modelo, precio, motor, etiqueta, plazas, detalles } = req.body;
  if (!marca || !modelo || !precio || !motor || !etiqueta || !plazas)
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  try {
    const [r] = await pool.query(
      'INSERT INTO vehiculos (marca,modelo,precio,motor,etiqueta,plazas,detalles) VALUES (?,?,?,?,?,?,?)',
      [marca, modelo, precio, motor, etiqueta, plazas, detalles]
    );
    res.status(201).json({ message: 'Creado.', id: r.insertId });
  } catch { res.status(500).json({ error: 'Error al crear.' }); }
};

// PUT /api/admin/catalog/:id
const updateVehicle = async (req, res) => {
  const { marca, modelo, precio, motor, etiqueta, plazas, detalles } = req.body;
  try {
    await pool.query(
      'UPDATE vehiculos SET marca=?,modelo=?,precio=?,motor=?,etiqueta=?,plazas=?,detalles=? WHERE id_vehiculo=?',
      [marca, modelo, precio, motor, etiqueta, plazas, detalles, req.params.id]
    );
    res.json({ message: 'Actualizado.' });
  } catch { res.status(500).json({ error: 'Error al actualizar.' }); }
};

// DELETE /api/admin/catalog/:id
const deleteVehicle = async (req, res) => {
  try {
    await pool.query('DELETE FROM vehiculos WHERE id_vehiculo = ?', [req.params.id]);
    res.json({ message: 'Eliminado.' });
  } catch { res.status(500).json({ error: 'Error al eliminar.' }); }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };