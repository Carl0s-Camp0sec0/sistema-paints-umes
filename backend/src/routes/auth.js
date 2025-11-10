// ==============================================
// RUTAS DE AUTENTICACIÓN
// Login, logout, perfil, cambio password
// ==============================================

const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/login', AuthController.login);

// Rutas protegidas (requieren autenticación)
router.use(AuthMiddleware.authenticated);

router.get('/profile', AuthController.getProfile);
router.post('/change-password', AuthController.changePassword);
router.post('/logout', AuthController.logout);

module.exports = router;
