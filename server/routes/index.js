const express = require('express');
const router  = express.Router();

const { register, login }                           = require('../controllers/authController');
const { getVehicles, getVehicleById, createVehicle,
        updateVehicle, deleteVehicle }              = require('../controllers/vehicleController');
const { processTest }                               = require('../controllers/testController');
const { getGarage, addToGarage, removeFromGarage } = require('../controllers/garageController');
const { verifyToken, verifyAdmin }                  = require('../middleware/auth');

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

module.exports = router;