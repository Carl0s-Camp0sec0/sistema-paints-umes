// ==============================================
// RUTAS DE UNIDADES DE MEDIDA - /api/units
// CRUD de unidades de medida
// ==============================================

const express = require('express');
const router = express.Router();
const { Unit } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// ==============================================
// RUTAS PÚBLICAS (sin autenticación)
// ==============================================

// Obtener todas las unidades activas (para catálogo público)
router.get('/public', async (req, res) => {
  try {
    const unidades = await Unit.findAll({
      where: { estado: 'Activo' },
      attributes: ['id_unidad', 'nombre_unidad', 'simbolo'],
      order: [['nombre_unidad', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Unidades obtenidas exitosamente',
      data: { unidades }
    });

  } catch (error) {
    console.error('Error al obtener unidades públicas:', error);
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

// Obtener todas las unidades (admin) - CON autenticación
router.get('/', authenticateToken, async (req, res) => {
  try {
    const unidades = await Unit.findAll({
      order: [['nombre_unidad', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Unidades obtenidas exitosamente',
      data: { unidades }
    });

  } catch (error) {
    console.error('Error al obtener unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener unidad por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const unidad = await Unit.findByPk(req.params.id);

    if (!unidad) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Unidad obtenida exitosamente',
      data: { unidad }
    });

  } catch (error) {
    console.error('Error al obtener unidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;