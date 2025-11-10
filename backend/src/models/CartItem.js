// ==============================================
// MODELO CART ITEM - CARRITO DE COMPRAS
// Para ventas en línea según enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    id_carrito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id_cliente'
      }
    },
    session_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Para usuarios no registrados'
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_producto'
      }
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_agregado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Procesado', 'Abandonado'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'carrito_compras',
    timestamps: true,
    indexes: [
      {
        fields: ['id_cliente']
      },
      {
        fields: ['session_id']
      },
      {
        fields: ['id_producto']
      },
      {
        fields: ['estado']
      }
    ]
  });

  return CartItem;
};
