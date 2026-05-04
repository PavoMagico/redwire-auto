const pool = require('../config/db');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno.' });
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  if (!['admin', 'user'].includes(rol))
    return res.status(400).json({ error: 'Rol inválido.' });
  // Prevent self-demotion
  if (Number(id) === req.user.id)
    return res.status(403).json({ error: 'No puedes modificar tu propio rol.' });
  try {
    await pool.query('UPDATE usuarios SET rol = ? WHERE id_usuario = ?', [rol, id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.user.id)
    return res.status(403).json({ error: 'No puedes eliminarte a ti mismo.' });
  try {
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
