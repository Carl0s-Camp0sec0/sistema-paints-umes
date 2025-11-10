// ==============================================
// CONFIGURACIÓN DE MODELOS Y ASOCIACIONES
// Sistema Paints - Bases de Datos II UMES
// ==============================================

const sequelize = require('../config/database');

// Importar todos los modelos
const Profile = require('./Profile')(sequelize);
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Unit = require('./Unit')(sequelize);
const Store = require('./Store')(sequelize);
const Color = require('./Color')(sequelize);
const Product = require('./Product')(sequelize);
const Customer = require('./Customer')(sequelize);
const Quote = require('./Quote')(sequelize);
const Invoice = require('./Invoice')(sequelize);
const InvoiceDetail = require('./InvoiceDetail')(sequelize);
const PaymentType = require('./PaymentType')(sequelize);
const InvoicePayment = require('./InvoicePayment')(sequelize);
const CartItem = require('./CartItem')(sequelize);

// ==============================================
// DEFINIR ASOCIACIONES ENTRE MODELOS
// ==============================================

// Profile - User (Uno a Muchos)
Profile.hasMany(User, { foreignKey: 'id_perfil', as: 'usuarios' });
User.belongsTo(Profile, { foreignKey: 'id_perfil', as: 'perfil' });

// Store - User (Uno a Muchos)
Store.hasMany(User, { foreignKey: 'id_sucursal', as: 'empleados' });
User.belongsTo(Store, { foreignKey: 'id_sucursal', as: 'sucursal' });

// Category - Product (Uno a Muchos)
Category.hasMany(Product, { foreignKey: 'id_categoria', as: 'productos' });
Product.belongsTo(Category, { foreignKey: 'id_categoria', as: 'categoria' });

// Unit - Product (Uno a Muchos)
Unit.hasMany(Product, { foreignKey: 'id_unidad_medida', as: 'productos' });
Product.belongsTo(Unit, { foreignKey: 'id_unidad_medida', as: 'unidad_medida' });

// Color - Product (Uno a Muchos)
Color.hasMany(Product, { foreignKey: 'id_color', as: 'productos' });
Product.belongsTo(Color, { foreignKey: 'id_color', as: 'color' });

// Customer - Quote (Uno a Muchos)
Customer.hasMany(Quote, { foreignKey: 'id_cliente', as: 'cotizaciones' });
Quote.belongsTo(Customer, { foreignKey: 'id_cliente', as: 'cliente' });

// User - Quote (Uno a Muchos)
User.hasMany(Quote, { foreignKey: 'id_empleado', as: 'cotizaciones' });
Quote.belongsTo(User, { foreignKey: 'id_empleado', as: 'empleado' });

// Customer - Invoice (Uno a Muchos)
Customer.hasMany(Invoice, { foreignKey: 'id_cliente', as: 'facturas' });
Invoice.belongsTo(Customer, { foreignKey: 'id_cliente', as: 'cliente' });

// User - Invoice (Uno a Muchos)
User.hasMany(Invoice, { foreignKey: 'id_empleado', as: 'facturas' });
Invoice.belongsTo(User, { foreignKey: 'id_empleado', as: 'empleado' });

// Store - Invoice (Uno a Muchos)
Store.hasMany(Invoice, { foreignKey: 'id_sucursal', as: 'facturas' });
Invoice.belongsTo(Store, { foreignKey: 'id_sucursal', as: 'sucursal' });

// Quote - Invoice (Uno a Uno opcional)
Quote.hasOne(Invoice, { foreignKey: 'id_cotizacion', as: 'factura' });
Invoice.belongsTo(Quote, { foreignKey: 'id_cotizacion', as: 'cotizacion' });

// Invoice - InvoiceDetail (Uno a Muchos)
Invoice.hasMany(InvoiceDetail, { foreignKey: 'id_factura', as: 'detalles' });
InvoiceDetail.belongsTo(Invoice, { foreignKey: 'id_factura', as: 'factura' });

// Product - InvoiceDetail (Uno a Muchos)
Product.hasMany(InvoiceDetail, { foreignKey: 'id_producto', as: 'detalles_factura' });
InvoiceDetail.belongsTo(Product, { foreignKey: 'id_producto', as: 'producto' });

// PaymentType - InvoicePayment (Uno a Muchos)
PaymentType.hasMany(InvoicePayment, { foreignKey: 'id_tipo_pago', as: 'pagos' });
InvoicePayment.belongsTo(PaymentType, { foreignKey: 'id_tipo_pago', as: 'tipo_pago' });

// Invoice - InvoicePayment (Uno a Muchos)
Invoice.hasMany(InvoicePayment, { foreignKey: 'id_factura', as: 'medios_pago' });
InvoicePayment.belongsTo(Invoice, { foreignKey: 'id_factura', as: 'factura' });

// Customer - CartItem (Uno a Muchos)
Customer.hasMany(CartItem, { foreignKey: 'id_cliente', as: 'carrito' });
CartItem.belongsTo(Customer, { foreignKey: 'id_cliente', as: 'cliente' });

// Product - CartItem (Uno a Muchos)
Product.hasMany(CartItem, { foreignKey: 'id_producto', as: 'items_carrito' });
CartItem.belongsTo(Product, { foreignKey: 'id_producto', as: 'producto' });

// ==============================================
// EXPORTAR TODOS LOS MODELOS
// ==============================================

const models = {
  Profile,
  User,
  Category,
  Unit,
  Store,
  Color,
  Product,
  Customer,
  Quote,
  Invoice,
  InvoiceDetail,
  PaymentType,
  InvoicePayment,
  CartItem,
  sequelize
};

module.exports = models;
