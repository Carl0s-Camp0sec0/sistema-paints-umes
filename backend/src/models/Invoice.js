// ==============================================
// MODELO INVOICE - FACTURAS
// Con numeración automática y medios de pago según enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id_factura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_factura: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Numeración automática con series y correlativos'
    },
    serie: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: 'Letra de serie según enunciado'
    },
    correlativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número correlativo según enunciado'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id_cliente'
      }
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id_sucursal'
      }
    },
    id_cotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cotizaciones',
        key: 'id_cotizacion'
      },
      comment: 'Si proviene de cotización'
    },
    fecha_emision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    descuento_total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    impuestos: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Borrador', 'Activa', 'Pagada', 'Anulada', 'Vencida'),
      defaultValue: 'Activa'
    },
    fecha_anulacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivo_anulacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    empleado_anulacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    }
  }, {
    tableName: 'facturas',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['numero_factura']
      },
      {
        unique: true,
        fields: ['serie', 'correlativo']
      },
      {
        fields: ['id_cliente']
      },
      {
        fields: ['id_empleado']
      },
      {
        fields: ['fecha_emision']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['total']
      }
    ]
  });

  return Invoice;
};
