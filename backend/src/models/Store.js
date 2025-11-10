// ==============================================
// MODELO STORE - SUCURSALES
// 6 sucursales específicas de Guatemala
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id_sucursal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_sucursal: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    departamento: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      comment: 'Coordenada GPS para localización'
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      comment: 'Coordenada GPS para localización'
    },
    horario_apertura: {
      type: DataTypes.TIME,
      defaultValue: '08:00:00'
    },
    horario_cierre: {
      type: DataTypes.TIME,
      defaultValue: '18:00:00'
    },
    estado: {
      type: DataTypes.ENUM('Activa', 'Inactiva', 'Mantenimiento'),
      defaultValue: 'Activa'
    }
  }, {
    tableName: 'sucursales',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['codigo_sucursal']
      },
      {
        fields: ['ciudad']
      },
      {
        fields: ['estado']
      },
      {
        name: 'idx_gps_coordinates',
        fields: ['latitud', 'longitud']
      }
    ]
  });

  return Store;
};
