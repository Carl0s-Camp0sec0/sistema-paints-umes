// ==============================================
// SEEDER - CLIENTES DE EJEMPLO
// Clientes para pruebas del sistema
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clientes', [
      {
        codigo_cliente: 'CLI001',
        nombre_completo: 'Juan Carlos Pérez',
        email: 'juan.perez@gmail.com',
        telefono: '5555-1234',
        direccion: '5ta Avenida 12-45 Zona 10',
        ciudad: 'Ciudad de Guatemala',
        departamento: 'Guatemala',
        tipo_cliente: 'Individual',
        acepta_promociones: true,
        fecha_registro: new Date(),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_cliente: 'CLI002',
        nombre_completo: 'María Elena González',
        email: 'maria.gonzalez@hotmail.com',
        telefono: '4444-5678',
        direccion: '2da Calle 8-30 Zona 3',
        ciudad: 'Chimaltenango',
        departamento: 'Chimaltenango',
        tipo_cliente: 'Individual',
        acepta_promociones: true,
        fecha_registro: new Date(),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_cliente: 'CLI003',
        nombre_completo: 'Constructora Los Alpes S.A.',
        email: 'ventas@losalpes.com.gt',
        telefono: '2333-4567',
        direccion: 'Km 15.5 Carretera a El Salvador',
        ciudad: 'Villa Nueva',
        departamento: 'Guatemala',
        tipo_cliente: 'Empresa',
        nit: '1234567-8',
        acepta_promociones: true,
        fecha_registro: new Date(),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_cliente: 'CLI004',
        nombre_completo: 'Roberto Morales',
        email: 'roberto.morales@yahoo.com',
        telefono: '7777-8899',
        direccion: '1ra Avenida 15-20',
        ciudad: 'Quetzaltenango',
        departamento: 'Quetzaltenango',
        tipo_cliente: 'Individual',
        acepta_promociones: false,
        fecha_registro: new Date(),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_cliente: 'CLI005',
        nombre_completo: 'Ana Sofía Hernández',
        email: 'ana.hernandez@gmail.com',
        telefono: '6666-7788',
        direccion: '4ta Calle 22-10',
        ciudad: 'Escuintla',
        departamento: 'Escuintla',
        tipo_cliente: 'Individual',
        acepta_promociones: true,
        fecha_registro: new Date(),
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clientes', null, {});
  }
};
