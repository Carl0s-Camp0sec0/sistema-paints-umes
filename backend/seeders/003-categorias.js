// ==============================================
// SEEDER - CATEGORÍAS DE PRODUCTOS
// 4 categorías específicas según enunciado
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categorias_productos', [
      {
        nombre_categoria: 'Accesorios',
        descripcion: 'Brochas, rodillos, bandejas, mantas de limpieza, espátulas, etc. Venta por unidad.',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_categoria: 'Solventes', 
        descripcion: 'Aguarrás, solvente limpiador, gas, etc. Venta en medidas de galón fraccionado.',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_categoria: 'Pinturas',
        descripcion: 'Pinturas base agua y base aceite. Incluye información de duración, cobertura y color.',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_categoria: 'Barnices',
        descripcion: 'Barniz sintético y acrílico. Incluye información de duración, cobertura y color.',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categorias_productos', null, {});
  }
};
