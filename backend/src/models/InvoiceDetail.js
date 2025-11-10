// ==============================================
// MODELO INVOICE DETAIL - DETALLE DE FACTURAS
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InvoiceDetail = sequelize.define('InvoiceDetail', {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facturas',
        key: 'id_factura'
      }
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
    descuento_porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    descuento_monto: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    numero_linea: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Orden del producto en la factura'
    }
  }, {
    tableName: 'detalle_facturas',
    timestamps: true,
    indexes: [
      {
        fields: ['id_factura']
      },
      {
        fields: ['id_producto']
      },
      {
        fields: ['id_factura', 'numero_linea']
      }
    ]
  });

  return InvoiceDetail;
};
