// ==============================================
// SEEDER - UNIDADES DE MEDIDA
// Según especificaciones del enunciado
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('unidades_medida', [
      {
        nombre_unidad: 'Unidad',
        simbolo: 'Und',
        factor_conversion: 1.000000,
        es_fraccion_galon: false,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1/32 Galón',
        simbolo: '1/32 gal',
        factor_conversion: 0.031250,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1/16 Galón',
        simbolo: '1/16 gal',
        factor_conversion: 0.062500,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1/8 Galón',
        simbolo: '1/8 gal',
        factor_conversion: 0.125000,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1/4 Galón',
        simbolo: '1/4 gal',
        factor_conversion: 0.250000,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1/2 Galón',
        simbolo: '1/2 gal',
        factor_conversion: 0.500000,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1 Galón',
        simbolo: '1 gal',
        factor_conversion: 1.000000,
        es_fraccion_galon: true,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_unidad: '1 Cubeta',
        simbolo: 'cubeta',
        factor_conversion: 5.000000,
        es_fraccion_galon: false,
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unidades_medida', null, {});
  }
};
