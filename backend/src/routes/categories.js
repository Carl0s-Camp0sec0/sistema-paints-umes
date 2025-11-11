// ==============================================
// RUTAS DE CATEGORÍAS - /api/categories
// CRUD de categorías de productos
// ==============================================

const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// ==============================================
// RUTAS PÚBLICAS (sin autenticación)
// ==============================================

// Obtener todas las categorías activas (para catálogo público)
router.get('/public', async (req, res) => {
  try {
    const categorias = await Category.findAll({
      where: { estado: 'Activo' },
      attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'imagen_url'],
      order: [['nombre_categoria', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: { categorias }
    });

  } catch (error) {
    console.error('Error al obtener categorías públicas:', error);
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

// Obtener todas las categorías (admin) - CON autenticación
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categorias = await Category.findAll({
      order: [['nombre_categoria', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: { categorias }
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener categoría por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const categoria = await Category.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría obtenida exitosamente',
      data: { categoria }
    });

  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;