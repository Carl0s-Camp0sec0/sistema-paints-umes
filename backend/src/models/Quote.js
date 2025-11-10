// ==============================================
// MODELO QUOTE - COTIZACIONES
// Según enunciado: generación y conversión a facturas
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Quote = sequelize.define('Quote', {
    id_cotizacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_cotizacion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
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
    fecha_cotizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: false
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
    condiciones_pago: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tiempo_entrega: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    validez_dias: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      comment: 'Gestión de válidos según enunciado'
    },
    estado: {
      type: DataTypes.ENUM('Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Convertida', 'Vencida'),
      defaultValue: 'Borrador'
    },
    convertida_factura: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_factura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de factura si se convirtió'
    }
  }, {
    tableName: 'cotizaciones',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['numero_cotizacion']
      },
      {
        fields: ['id_cliente']
      },
      {
        fields: ['id_empleado']
      },
      {
        fields: ['fecha_cotizacion']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['convertida_factura']
      }
    ]
  });

  return Quote;
};
