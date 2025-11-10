// ==============================================
// MODELO PROFILE - PERFILES DEL SISTEMA
// Gerente, Digitador, Cajero
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profile = sequelize.define('Profile', {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_perfil: {
      type: DataTypes.ENUM('Gerente', 'Digitador', 'Cajero'),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    permisos: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Permisos específicos del perfil'
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'perfiles_sistema',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre_perfil']
      }
    ]
  });

  return Profile;
};
