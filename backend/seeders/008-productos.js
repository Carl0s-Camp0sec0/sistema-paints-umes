// ==============================================
// SEEDER - PRODUCTOS DE EJEMPLO
// Productos según especificaciones del enunciado
// ==============================================

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productos', [
      // ACCESORIOS (venta por unidad)
      {
        codigo: 'ACC001',
        nombre: 'Brocha 2 pulgadas',
        descripcion: 'Brocha profesional de 2 pulgadas para pinturas base agua',
        id_categoria: 1, // Accesorios
        precio_venta: 25.50,
        descuento_porcentaje: 0.00,
        stock_actual: 150,
        id_unidad_medida: 1, // Unidad
        marca: 'PaintPro',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'ACC002',
        nombre: 'Rodillo 9 pulgadas',
        descripcion: 'Rodillo profesional de 9 pulgadas con mango ergonómico',
        id_categoria: 1, // Accesorios
        precio_venta: 35.75,
        descuento_porcentaje: 5.00,
        stock_actual: 85,
        id_unidad_medida: 1, // Unidad
        marca: 'PaintPro',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'ACC003',
        nombre: 'Bandeja para Rodillo',
        descripcion: 'Bandeja plástica para rodillo de 9 pulgadas',
        id_categoria: 1, // Accesorios
        precio_venta: 18.00,
        descuento_porcentaje: 0.00,
        stock_actual: 200,
        id_unidad_medida: 1, // Unidad
        marca: 'Accessories Pro',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // SOLVENTES (medidas de galón)
      {
        codigo: 'SOL001',
        nombre: 'Aguarrás',
        descripcion: 'Aguarrás puro para dilución de pinturas base aceite',
        id_categoria: 2, // Solventes
        precio_venta: 45.00,
        descuento_porcentaje: 0.00,
        stock_actual: 50,
        id_unidad_medida: 5, // 1/4 galón
        marca: 'SolventMax',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'SOL002',
        nombre: 'Solvente Limpiador',
        descripcion: 'Solvente especializado para limpieza de herramientas',
        id_categoria: 2, // Solventes
        precio_venta: 65.00,
        descuento_porcentaje: 10.00,
        stock_actual: 30,
        id_unidad_medida: 6, // 1/2 galón
        marca: 'CleanPro',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // PINTURAS (base agua y aceite con información adicional)
      {
        codigo: 'PIN001',
        nombre: 'Pintura Base Agua Blanco',
        descripcion: 'Pintura de alta calidad base agua, ideal para interiores',
        id_categoria: 3, // Pinturas
        precio_venta: 185.00,
        descuento_porcentaje: 0.00,
        stock_actual: 75,
        id_unidad_medida: 7, // 1 galón
        duracion_anos: 5,
        cobertura_m2: 35.00,
        id_color: 1, // Blanco
        marca: 'AquaPaint',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'PIN002',
        nombre: 'Pintura Base Aceite Azul',
        descripcion: 'Pintura base aceite de alta durabilidad para exteriores',
        id_categoria: 3, // Pinturas
        precio_venta: 220.00,
        descuento_porcentaje: 5.00,
        stock_actual: 40,
        id_unidad_medida: 7, // 1 galón
        duracion_anos: 8,
        cobertura_m2: 32.00,
        id_color: 4, // Azul
        marca: 'DuraPaint',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // BARNICES (sintético y acrílico)
      {
        codigo: 'BAR001',
        nombre: 'Barniz Sintético Transparente',
        descripcion: 'Barniz sintético de alta resistencia para madera',
        id_categoria: 4, // Barnices
        precio_venta: 165.00,
        descuento_porcentaje: 0.00,
        stock_actual: 60,
        id_unidad_medida: 6, // 1/2 galón
        duracion_anos: 6,
        cobertura_m2: 28.00,
        marca: 'WoodProtect',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        codigo: 'BAR002',
        nombre: 'Barniz Acrílico Mate',
        descripcion: 'Barniz acrílico base agua con acabado mate',
        id_categoria: 4, // Barnices
        precio_venta: 145.00,
        descuento_porcentaje: 8.00,
        stock_actual: 35,
        id_unidad_medida: 6, // 1/2 galón
        duracion_anos: 4,
        cobertura_m2: 25.00,
        marca: 'EcoVarnish',
        estado: 'Activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('productos', null, {});
  }
};
