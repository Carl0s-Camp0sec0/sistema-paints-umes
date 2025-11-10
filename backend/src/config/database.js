// ==============================================
// CONFIGURACIÓN DE BASE DE DATOS - SEQUELIZE
// Sistema Paints - Bases de Datos II UMES
// ==============================================

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_paints',
  dialect: 'mysql',
  
  // Configuraciones específicas para XAMPP/MySQL (CORREGIDAS)
  dialectOptions: {
    charset: 'utf8mb4',
    timezone: '-06:00' // GMT-6 para Guatemala
  },
  
  // Pool de conexiones optimizado para desarrollo
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  
  // Configuraciones adicionales
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  benchmark: process.env.NODE_ENV === 'development',
  
  // Configuración de modelos por defecto
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci' // Aquí sí va el collate
  },
  
  // Configuración de zona horaria
  timezone: '-06:00'
});

// Función para verificar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    console.error('💡 Verifica que XAMPP esté ejecutándose y las credenciales sean correctas');
    return false;
  }
}

// Función para sincronizar modelos (solo en desarrollo)
async function syncDatabase(force = false) {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force, alter: true });
      console.log('✅ Base de datos sincronizada');
    }
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    throw error;
  }
}

// Exportar la instancia principal de Sequelize
module.exports = sequelize;

// Exportar también las funciones auxiliares si las necesitas
module.exports.testConnection = testConnection;
module.exports.syncDatabase = syncDatabase;

// Configuraciones para Sequelize CLI
module.exports.development = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_paints',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4'
  }
};
