// ==============================================
// SEEDER - PERFILES DEL SISTEMA
// 3 perfiles según enunciado: Gerente, Digitador, Cajero
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('perfiles_sistema', [
      {
        nombre_perfil: 'Gerente',
        descripcion: 'Acceso completo al sistema incluyendo reportes y configuración',
        permisos: JSON.stringify({
          usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
          productos: ['crear', 'leer', 'actualizar', 'eliminar'],
          facturas: ['crear', 'leer', 'actualizar', 'anular'],
          reportes: ['ver_todos'],
          configuracion: ['acceso_total']
        }),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_perfil: 'Digitador',
        descripcion: 'Encargado de alimentar el sistema con datos',
        permisos: JSON.stringify({
          productos: ['crear', 'leer', 'actualizar'],
          clientes: ['crear', 'leer', 'actualizar'],
          cotizaciones: ['crear', 'leer', 'actualizar'],
          inventario: ['actualizar_stock']
        }),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre_perfil: 'Cajero',
        descripcion: 'Solo puede realizar facturación y cobro',
        permisos: JSON.stringify({
          facturas: ['crear', 'leer'],
          clientes: ['leer'],
          productos: ['leer'],
          pagos: ['registrar']
        }),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('perfiles_sistema', null, {});
  }
};
