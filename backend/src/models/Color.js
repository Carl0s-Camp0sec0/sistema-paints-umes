// ==============================================
// MODELO COLOR - COLORES PARA PINTURAS Y BARNICES
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Color = sequelize.define('Color', {
    id_color: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    codigo_hex: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/
      }
    },
    familia_color: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: 'Familia de colores: Cálidos, Fríos, Neutros, etc.'
    },
    popularidad: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Índice de popularidad del color'
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'colores',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre_color']
      },
      {
        fields: ['familia_color']
      }
    ]
  });

  return Color;
};
