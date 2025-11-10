// ==============================================
// MODELO INVOICE PAYMENT - MEDIOS DE PAGO FACTURA
// Una factura puede usar los 3 medios de pago según enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InvoicePayment = sequelize.define('InvoicePayment', {
    id_pago: {
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
    id_tipo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_pago',
        key: 'id_tipo_pago'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    
    // CAMPOS ESPECÍFICOS PARA CHEQUE
    numero_cheque: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    banco_cheque: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_cheque: {
      type: DataTypes.DATE,
      allowNull: true
    },
    
    // CAMPOS ESPECÍFICOS PARA TARJETA
    numero_autorizacion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ultimos_digitos: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    tipo_tarjeta: {
      type: DataTypes.ENUM('Crédito', 'Débito'),
      allowNull: true
    },
    banco_tarjeta: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    
    // CAMPOS GENERALES
    referencia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'medios_pago_factura',
    timestamps: true,
    indexes: [
      {
        fields: ['id_factura']
      },
      {
        fields: ['id_tipo_pago']
      },
      {
        fields: ['fecha_pago']
      }
    ]
  });

  return InvoicePayment;
};
