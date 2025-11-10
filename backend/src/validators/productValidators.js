// ==============================================
// VALIDACIONES DE PRODUCTOS
// express-validator para validar datos de entrada
// ==============================================

const { body, validationResult } = require('express-validator');

// Validación para crear producto
const createProductValidator = [
  body('codigo')
    .trim()
    .notEmpty()
    .withMessage('El código es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 150 })
    .withMessage('El nombre debe tener entre 3 y 150 caracteres'),

  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria según enunciado')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),

  body('id_categoria')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número válido'),

  body('precio_venta')
    .notEmpty()
    .withMessage('El precio de venta es obligatorio según enunciado')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser mayor a 0')
    .custom((value) => {
      if (parseFloat(value) > 99999.99) {
        throw new Error('El precio no puede exceder Q.99,999.99');
      }
      return true;
    }),

  body('descuento_porcentaje')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El descuento debe estar entre 0 y 100%'),

  body('stock_actual')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),

  body('id_unidad_medida')
    .notEmpty()
    .withMessage('La unidad de medida es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La unidad de medida debe ser válida'),

  body('duracion_anos')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La duración debe estar entre 1 y 50 años'),

  body('cobertura_m2')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('La cobertura debe ser un número positivo'),

  body('id_color')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El color debe ser válido'),

  body('marca')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La marca no puede exceder 50 caracteres'),

  body('peso_kg')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('El peso debe ser un número positivo'),

  body('stock_minimo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El stock mínimo debe ser un número entero positivo')
];

// Validación para actualizar producto
const updateProductValidator = [
  body('codigo')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),

  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('El nombre debe tener entre 3 y 150 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),

  body('id_categoria')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La categoría debe ser un número válido'),

  body('precio_venta')
    .optional()
    .isFloat({ min: 0.01, max: 99999.99 })
    .withMessage('El precio debe estar entre Q.0.01 y Q.99,999.99'),

  body('descuento_porcentaje')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El descuento debe estar entre 0 y 100%'),

  body('stock_actual')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),

  body('duracion_anos')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La duración debe estar entre 1 y 50 años'),

  body('cobertura_m2')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('La cobertura debe ser un número positivo'),

  body('estado')
    .optional()
    .isIn(['Activo', 'Inactivo', 'Descontinuado'])
    .withMessage('El estado debe ser: Activo, Inactivo o Descontinuado')
];

// Middleware para manejar resultados de validación
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  createProductValidator,
  updateProductValidator,
  validateResult
};
