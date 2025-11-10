// ==============================================
// MODELO PAYMENT TYPE - TIPOS DE PAGO
// Efectivo, Cheque, Tarjeta según enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentType = sequelize.define('PaymentType', {
    id_tipo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_tipo: {
      type: DataTypes.ENUM('Efectivo', 'Cheque', 'Tarjeta'),
      allowNull: false,
      unique: true,
      comment: 'Tres tipos según enunciado'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requiere_referencia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si requiere número de cheque, autorización, etc.'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'tipos_pago',
    timestamps: true
  });

  return PaymentType;
};
