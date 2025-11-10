// ==============================================
// SEEDER - COLORES
// Para pinturas y barnices
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('colores', [
      {
        nombre_color: 'Blanco',
        codigo_hex: '#FFFFFF',
        familia_color: 'Neutros',
        popularidad: 100,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Negro',
        codigo_hex: '#000000',
        familia_color: 'Neutros',
        popularidad: 85,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Rojo',
        codigo_hex: '#FF0000',
        familia_color: 'Cálidos',
        popularidad: 70,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Azul',
        codigo_hex: '#0000FF',
        familia_color: 'Fríos',
        popularidad: 75,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Verde',
        codigo_hex: '#00FF00',
        familia_color: 'Fríos',
        popularidad: 60,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Amarillo',
        codigo_hex: '#FFFF00',
        familia_color: 'Cálidos',
        popularidad: 55,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Gris',
        codigo_hex: '#808080',
        familia_color: 'Neutros',
        popularidad: 80,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_color: 'Beige',
        codigo_hex: '#F5F5DC',
        familia_color: 'Neutros',
        popularidad: 65,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('colores', null, {});
  }
};
