// ==============================================
// MODELO USER - USUARIOS DEL SISTEMA
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    id_perfil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'perfiles_sistema',
        key: 'id_perfil'
      }
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursales',
        key: 'id_sucursal'
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    intentos_login: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo', 'Bloqueado'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['id_perfil']
      },
      {
        fields: ['estado']
      }
    ]
  });

  return User;
};
