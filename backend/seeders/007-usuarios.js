// ==============================================
// SEEDER - USUARIO ADMINISTRADOR
// Usuario inicial para acceder al sistema
// ==============================================

'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash de la contraseña 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        username: 'admin',
        email: 'admin@sistemapaints.com',
        password_hash: hashedPassword,
        nombre_completo: 'Administrador del Sistema',
        id_perfil: 1, // Gerente
        id_sucursal: 6, // Miraflores Guatemala (sucursal principal)
        telefono: '2433-7700',
        direccion: 'Ciudad de Guatemala',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'digitador01',
        email: 'digitador@sistemapaints.com',
        password_hash: await bcrypt.hash('digit123', 12),
        nombre_completo: 'María López Hernández',
        id_perfil: 2, // Digitador
        id_sucursal: 1, // Chimaltenango
        telefono: '7832-5501',
        direccion: 'Chimaltenango, Guatemala',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'cajero01',
        email: 'cajero@sistemapaints.com',
        password_hash: await bcrypt.hash('cajero123', 12),
        nombre_completo: 'Carlos Mendoza Ruiz',
        id_perfil: 3, // Cajero
        id_sucursal: 2, // Escuintla
        telefono: '7888-2201',
        direccion: 'Escuintla, Guatemala',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
