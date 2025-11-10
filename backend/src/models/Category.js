// ==============================================
// MODELO CATEGORY - CATEGORÍAS DE PRODUCTOS
// Accesorios, Solventes, Pinturas, Barnices
// ==============================================

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_categoria: {
      type: DataTypes.ENUM('Accesorios', 'Solventes', 'Pinturas', 'Barnices'),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagen_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      defaultValue: 'Activo'
    }
  }, {
    tableName: 'categorias_productos',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre_categoria']
      }
    ]
  });

  return Category;
};
