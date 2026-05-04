const express = require('express');
const router  = express.Router();

const { register, login }                           = require('../controllers/authController');
const { getVehicles, getVehicleById, createVehicle,
        updateVehicle, deleteVehicle }              = require('../controllers/vehicleController');
const { processTest }                               = require('../controllers/testController');
const { getGarage, addToGarage, removeFromGarage } = require('../controllers/garageController');
const { verifyToken, verifyAdmin }                  = require('../middleware/auth');
const { getAllUsers, updateUserRole, deleteUser }    = require('../controllers/userController');

// Auth
router.post('/auth/register', register);
router.post('/auth/login',    login);

// Vehículos (público)
router.get('/vehicles',     getVehicles);
router.get('/vehicles/:id', getVehicleById);

// Test de afinidad (público)
router.post('/test/process', processTest);

// Garaje (requiere JWT)
router.get('/user/garage',        verifyToken, getGarage);
router.post('/user/garage',       verifyToken, addToGarage);
router.delete('/user/garage/:id', verifyToken, removeFromGarage);

// Admin (requiere JWT + rol admin)
router.post('/admin/catalog',        verifyAdmin, createVehicle);
router.put('/admin/catalog/:id',     verifyAdmin, updateVehicle);
router.delete('/admin/catalog/:id',  verifyAdmin, deleteVehicle);

router.get('/admin/users',           verifyAdmin, getAllUsers);
router.put('/admin/users/:id/role',  verifyAdmin, updateUserRole);
router.delete('/admin/users/:id',    verifyAdmin, deleteUser);

router.get('/admin/tests', verifyAdmin, async (req, res) => {
  const pool = require('../config/db');
  try {
    const [rows] = await pool.query(`
      SELECT t.id_test, t.afinidad, t.fecha,
             u.nombre AS usuario, u.email,
             v.marca, v.modelo
      FROM tests t
      JOIN usuarios u ON t.id_usuario = u.id_usuario
      JOIN vehiculos v ON t.id_vehiculo = v.id_vehiculo
      ORDER BY t.fecha DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
});

// Stats públicas (sin auth)
router.get('/stats', async (req, res) => {
  const pool = require('../config/db');
  try {
    const [[{ tests }]]    = await pool.query('SELECT COUNT(*) AS tests FROM tests');
    const [[{ vehiculos }]] = await pool.query('SELECT COUNT(*) AS vehiculos FROM vehiculos');
    const [[{ media }]]    = await pool.query('SELECT ROUND(AVG(afinidad), 0) AS media FROM tests');
    res.json({ tests, vehiculos, media: media || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error interno.' });
  }
});

module.exports = router;