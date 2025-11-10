// ==============================================
// MODELO CUSTOMER - CLIENTES
// Para registro con email y promociones según enunciado
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_cliente: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: 'Campo obligatorio para recibir promociones según enunciado'
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tipo_cliente: {
      type: DataTypes.ENUM('Individual', 'Empresa'),
      defaultValue: 'Individual'
    },
    nit: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    acepta_promociones: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Para envío de emails promocionales'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ultimo_pedido: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_compras: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo', 'Bloqueado'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'clientes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['codigo_cliente']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['nombre_completo']
      },
      {
        fields: ['telefono']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['acepta_promociones']
      }
    ]
  });

  return Customer;
};
