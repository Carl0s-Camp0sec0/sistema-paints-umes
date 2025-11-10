// ==============================================
// RUTAS DE PRODUCTOS - /api/products
// Todas las operaciones CRUD de productos
// ==============================================

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { 
  createProductValidator, 
  updateProductValidator,
  validateResult 
} = require('../validators/productValidators');

// ==============================================
// RUTAS PÚBLICAS (sin autenticación)
// ==============================================

// Obtener productos para catálogo público
router.get('/catalog', ProductController.getAllProducts);

// Obtener producto específico para catálogo
router.get('/catalog/:id', ProductController.getProductById);

// Obtener productos por categoría para catálogo
router.get('/catalog/category/:categoria', ProductController.getProductsByCategory);

// ==============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==============================================

// Middleware de autenticación para todas las rutas siguientes
router.use(authenticateToken);

// Obtener todos los productos (con filtros admin)
router.get('/', ProductController.getAllProducts);

// Obtener producto por ID
router.get('/:id', ProductController.getProductById);

// Crear nuevo producto (solo Digitador y Gerente)
router.post('/', 
  authorizeRoles(['Gerente', 'Digitador']),
  createProductValidator,
  validateResult,
  ProductController.createProduct
);

// Actualizar producto (solo Digitador y Gerente)
router.put('/:id',
  authorizeRoles(['Gerente', 'Digitador']),
  updateProductValidator,
  validateResult,
  ProductController.updateProduct
);

// Eliminar producto (solo Gerente)
router.delete('/:id',
  authorizeRoles(['Gerente']),
  ProductController.deleteProduct
);

// Obtener productos por categoría
router.get('/category/:categoria', ProductController.getProductsByCategory);

// Actualizar stock (para facturación - solo Cajero y Gerente)
router.patch('/:id/stock',
  authorizeRoles(['Gerente', 'Cajero']),
  ProductController.updateStock
);

module.exports = router;
