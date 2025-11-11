// ==============================================
// RUTAS DE COLORES - /api/colors
// CRUD de colores
// ==============================================

const express = require('express');
const router = express.Router();
const { Color } = require('../models');
const AuthMiddleware = require('../middleware/auth');

// ==============================================
// RUTAS PÚBLICAS (sin autenticación)
// ==============================================

// Obtener todos los colores activos (para catálogo público)
router.get('/public', async (req, res) => {
  try {
    const colores = await Color.findAll({
      where: { estado: 'Activo' },
      attributes: ['id_color', 'nombre_color', 'codigo_hex'],
      order: [['nombre_color', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Colores obtenidos exitosamente',
      data: { colores }
    });

  } catch (error) {
    console.error('Error al obtener colores públicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ==============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==============================================

// Obtener todos los colores (admin) - CON autenticación
router.get('/', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const colores = await Color.findAll({
      order: [['nombre_color', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Colores obtenidos exitosamente',
      data: { colores }
    });

  } catch (error) {
    console.error('Error al obtener colores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener color por ID
router.get('/:id', AuthMiddleware.verifyToken, async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Color obtenido exitosamente',
      data: { color }
    });

  } catch (error) {
    console.error('Error al obtener color:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;