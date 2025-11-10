// ==============================================
// MODELO UNIT - UNIDADES DE MEDIDA
// unidad, 1/32 gal, 1/16 gal, 1/8 gal, 1/4 gal, 1/2 gal, 1 gal, 1 cubeta
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Unit = sequelize.define('Unit', {
    id_unidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_unidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    simbolo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    factor_conversion: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      defaultValue: 1.0,
      comment: 'Factor de conversión a unidad base'
    },
    es_fraccion_galon: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'unidades_medida',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre_unidad']
      },
      {
        unique: true,
        fields: ['simbolo']
      }
    ]
  });

  return Unit;
};
