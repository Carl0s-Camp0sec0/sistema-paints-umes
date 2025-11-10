// ==============================================
// MODELO PRODUCT - PRODUCTOS
// Implementa todas las especificaciones del enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Campo obligatorio según enunciado'
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias_productos',
        key: 'id_categoria'
      }
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Campo obligatorio según enunciado'
    },
    descuento_porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Campo obligatorio según enunciado'
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Campo obligatorio según enunciado - número de existencia'
    },
    id_unidad_medida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'unidades_medida',
        key: 'id_unidad'
      }
    },
    
    // CAMPOS ESPECÍFICOS PARA PINTURAS Y BARNICES (según enunciado)
    duracion_anos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Solo para pinturas y barnices - tiempo duración en años'
    },
    cobertura_m2: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Solo para pinturas y barnices - extensión que cubre en m²'
    },
    id_color: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'colores',
        key: 'id_color'
      },
      comment: 'Solo para pinturas y barnices'
    },
    
    // CAMPOS ADICIONALES
    imagen_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    peso_kg: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo', 'Descontinuado'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['codigo']
      },
      {
        fields: ['nombre']
      },
      {
        fields: ['id_categoria']
      },
      {
        fields: ['precio_venta']
      },
      {
        fields: ['stock_actual']
      },
      {
        fields: ['estado']
      }
    ]
  });

  return Product;
};
