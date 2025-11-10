// ==============================================
// SEEDER - SUCURSALES
// 6 sucursales específicas según enunciado
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sucursales', [
      {
        codigo_sucursal: 'CHIMAL01',
        nombre: 'Pradera Chimaltenango',
        direccion: 'Centro Comercial Pradera Chimaltenango, Local 2-15',
        ciudad: 'Chimaltenango',
        departamento: 'Chimaltenango',
        telefono: '7832-5500',
        email: 'chimaltenango@sistemapaints.com',
        latitud: 14.66020,
        longitud: -90.81350,
        horario_apertura: '08:00:00',
        horario_cierre: '18:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_sucursal: 'ESCUIN01',
        nombre: 'Pradera Escuintla',
        direccion: 'Centro Comercial Pradera Escuintla, Local 1-08',
        ciudad: 'Escuintla',
        departamento: 'Escuintla',
        telefono: '7888-2200',
        email: 'escuintla@sistemapaints.com',
        latitud: 14.30530,
        longitud: -90.78580,
        horario_apertura: '08:00:00',
        horario_cierre: '18:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_sucursal: 'MAZATE01',
        nombre: 'Las Américas Mazatenango',
        direccion: 'Centro Comercial Las Américas, 2do Nivel Local 2-25',
        ciudad: 'Mazatenango',
        departamento: 'Suchitepéquez',
        telefono: '7872-4400',
        email: 'mazatenango@sistemapaints.com',
        latitud: 14.53410,
        longitud: -91.50350,
        horario_apertura: '08:00:00',
        horario_cierre: '18:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_sucursal: 'COATEP01',
        nombre: 'La Trinidad Coatepeque',
        direccion: 'Centro Comercial La Trinidad, Local 1-12',
        ciudad: 'Coatepeque',
        departamento: 'Quetzaltenango',
        telefono: '7775-1100',
        email: 'coatepeque@sistemapaints.com',
        latitud: 14.70420,
        longitud: -91.86280,
        horario_apertura: '08:00:00',
        horario_cierre: '18:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_sucursal: 'XELA001',
        nombre: 'Pradera Xela',
        direccion: 'Centro Comercial Pradera Xela, Local 3-18',
        ciudad: 'Quetzaltenango',
        departamento: 'Quetzaltenango',
        telefono: '7761-8800',
        email: 'xela@sistemapaints.com',
        latitud: 14.83440,
        longitud: -91.51890,
        horario_apertura: '08:00:00',
        horario_cierre: '18:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo_sucursal: 'MIRAF01',
        nombre: 'Miraflores Guatemala',
        direccion: 'Centro Comercial Miraflores, Nivel 1 Local 1-25',
        ciudad: 'Ciudad de Guatemala',
        departamento: 'Guatemala',
        telefono: '2433-7700',
        email: 'miraflores@sistemapaints.com',
        latitud: 14.61240,
        longitud: -90.50560,
        horario_apertura: '08:00:00',
        horario_cierre: '19:00:00',
        estado: 'Activa',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sucursales', null, {});
  }
};
