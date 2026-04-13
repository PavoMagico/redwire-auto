const pool = require('../config/db');

// GET /api/user/garage
const getGarage = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT v.*, f.added_at FROM favoritos f
       JOIN vehiculos v ON f.id_vehiculo = v.id_vehiculo
       WHERE f.id_usuario = ? ORDER BY f.added_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch { res.status(500).json({ error: 'Error al obtener garaje.' }); }
};

// POST /api/user/garage
const addToGarage = async (req, res) => {
  const { id_vehiculo } = req.body;
  if (!id_vehiculo) return res.status(400).json({ error: 'id_vehiculo requerido.' });
  try {
    await pool.query('INSERT IGNORE INTO favoritos (id_usuario,id_vehiculo) VALUES (?,?)',
      [req.user.id, id_vehiculo]);
    res.status(201).json({ message: 'Añadido al garaje.' });
  } catch { res.status(500).json({ error: 'Error.' }); }
};

// DELETE /api/user/garage/:id
const removeFromGarage = async (req, res) => {
  try {
    await pool.query('DELETE FROM favoritos WHERE id_usuario=? AND id_vehiculo=?',
      [req.user.id, req.params.id]);
    res.json({ message: 'Eliminado.' });
  } catch { res.status(500).json({ error: 'Error.' }); }
};

module.exports = { getGarage, addToGarage, removeFromGarage };