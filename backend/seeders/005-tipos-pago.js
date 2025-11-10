// ==============================================
// SEEDER - TIPOS DE PAGO
// 3 tipos específicos según enunciado: Efectivo, Cheque, Tarjeta
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipos_pago', [
      {
        nombre_tipo: 'Efectivo',
        descripcion: 'Pago en efectivo al momento de la compra',
        requiere_referencia: false,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_tipo: 'Cheque', 
        descripcion: 'Pago con cheque - requiere validación bancaria',
        requiere_referencia: true,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_tipo: 'Tarjeta',
        descripcion: 'Pago con tarjeta de crédito o débito',
        requiere_referencia: true,
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_pago', null, {});
  }
};
