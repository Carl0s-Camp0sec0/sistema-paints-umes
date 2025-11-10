// ==============================================
// CONTROLADOR DE PRODUCTOS
// CRUD completo + funcionalidades específicas del enunciado
// ==============================================

const { Product, Category, Unit, Color } = require('../models');
const { validationResult } = require('express-validator');

class ProductController {
  
  // Obtener todos los productos con filtros
  static async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        categoria,
        precio_min,
        precio_max,
        stock_min,
        estado = 'Activo',
        buscar,
        ordenar = 'nombre',
        direccion = 'ASC'
      } = req.query;

      // Construir filtros dinámicos
      const where = { estado };
      
      if (categoria) {
        where.id_categoria = categoria;
      }
      
      if (precio_min || precio_max) {
        where.precio_venta = {};
        if (precio_min) where.precio_venta[Op.gte] = precio_min;
        if (precio_max) where.precio_venta[Op.lte] = precio_max;
      }
      
      if (stock_min) {
        where.stock_actual = { [Op.gte]: stock_min };
      }
      
      if (buscar) {
        where[Op.or] = [
          { nombre: { [Op.like]: %% } },
          { codigo: { [Op.like]: %% } },
          { descripcion: { [Op.like]: %% } }
        ];
      }

      // Configurar paginación
      const offset = (page - 1) * limit;

      const productos = await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria', 'descripcion']
          },
          {
            model: Unit,
            as: 'unidad_medida',
            attributes: ['id_unidad', 'nombre_unidad', 'simbolo']
          },
          {
            model: Color,
            as: 'color',
            attributes: ['id_color', 'nombre_color', 'codigo_hex']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[ordenar, direccion.toUpperCase()]]
      });

      res.status(200).json({
        success: true,
        message: 'Productos obtenidos exitosamente',
        data: {
          productos: productos.rows,
          paginacion: {
            total: productos.count,
            pagina_actual: parseInt(page),
            total_paginas: Math.ceil(productos.count / limit),
            productos_por_pagina: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  // Obtener producto por ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const producto = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'categoria',
            attributes: ['id_categoria', 'nombre_categoria', 'descripcion']
          },
          {
            model: Unit,
            as: 'unidad_medida', 
            attributes: ['id_unidad', 'nombre_unidad', 'simbolo', 'factor_conversion']
          },
          {
            model: Color,
            as: 'color',
            attributes: ['id_color', 'nombre_color', 'codigo_hex', 'familia_color']
          }
        ]
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
          error: 'PRODUCT_NOT_FOUND'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Producto obtenido exitosamente',
        data: producto
      });

    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo producto
  static async createProduct(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const {
        codigo,
        nombre, 
        descripcion,
        id_categoria,
        precio_venta,
        descuento_porcentaje = 0,
        stock_actual = 0,
        id_unidad_medida,
        duracion_anos,
        cobertura_m2,
        id_color,
        marca,
        peso_kg,
        stock_minimo = 10
      } = req.body;

      // Verificar que el código no exista
      const existingProduct = await Product.findOne({ where: { codigo } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese código',
          error: 'DUPLICATE_CODE'
        });
      }

      // Crear el producto
      const nuevoProducto = await Product.create({
        codigo,
        nombre,
        descripcion,
        id_categoria,
        precio_venta,
        descuento_porcentaje,
        stock_actual,
        id_unidad_medida,
        duracion_anos,
        cobertura_m2,
        id_color,
        marca,
        peso_kg,
        stock_minimo,
        estado: 'Activo'
      });

      // Obtener el producto completo con relaciones
      const productoCompleto = await Product.findByPk(nuevoProducto.id_producto, {
        include: [
          { model: Category, as: 'categoria' },
          { model: Unit, as: 'unidad_medida' },
          { model: Color, as: 'color' }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: productoCompleto
      });

    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar producto
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const producto = await Product.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Verificar código único si se está cambiando
      if (req.body.codigo && req.body.codigo !== producto.codigo) {
        const existingProduct = await Product.findOne({ 
          where: { codigo: req.body.codigo } 
        });
        if (existingProduct) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un producto con ese código'
          });
        }
      }

      // Actualizar producto
      await producto.update(req.body);

      // Obtener producto actualizado con relaciones
      const productoActualizado = await Product.findByPk(id, {
        include: [
          { model: Category, as: 'categoria' },
          { model: Unit, as: 'unidad_medida' },
          { model: Color, as: 'color' }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: productoActualizado
      });

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar producto (cambiar estado)
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const producto = await Product.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Cambiar estado en lugar de eliminar físicamente
      await producto.update({ estado: 'Inactivo' });

      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener productos por categoría
  static async getProductsByCategory(req, res) {
    try {
      const { categoria } = req.params;

      const productos = await Product.findAll({
        where: { 
          estado: 'Activo',
          id_categoria: categoria
        },
        include: [
          { model: Category, as: 'categoria' },
          { model: Unit, as: 'unidad_medida' },
          { model: Color, as: 'color' }
        ],
        order: [['nombre', 'ASC']]
      });

      res.status(200).json({
        success: true,
        message: 'Productos por categoría obtenidos exitosamente',
        data: productos
      });

    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar stock (para facturación)
  static async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad, operacion } = req.body; // operacion: 'suma' o 'resta'

      const producto = await Product.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      let nuevoStock;
      if (operacion === 'suma') {
        nuevoStock = parseInt(producto.stock_actual) + parseInt(cantidad);
      } else if (operacion === 'resta') {
        nuevoStock = parseInt(producto.stock_actual) - parseInt(cantidad);
        
        if (nuevoStock < 0) {
          return res.status(400).json({
            success: false,
            message: 'Stock insuficiente',
            stock_disponible: producto.stock_actual
          });
        }
      }

      await producto.update({ stock_actual: nuevoStock });

      res.status(200).json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: {
          producto_id: producto.id_producto,
          stock_anterior: producto.stock_actual,
          stock_nuevo: nuevoStock
        }
      });

    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = ProductController;
