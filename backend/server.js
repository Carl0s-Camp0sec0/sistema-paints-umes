// ==============================================
// SERVIDOR PRINCIPAL - SISTEMA PAINTS
// Proyecto: Bases de Datos II - UMES
// ==============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Importar modelos
const { sequelize } = require('./src/models');

// Crear aplicación Express
const app = express();

// ==============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ==============================================

// Helmet para seguridad
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

// Compresión para optimizar respuestas
app.use(compression());

// CORS configurado para desarrollo académico
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting básico
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta más tarde.'
  }
});

app.use('/api/', limiter);

// Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Logging de peticiones en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(timestamp + ' - ' + req.method + ' ' + req.path);
    next();
  });
}

// ==============================================
// RUTAS BÁSICAS
// ==============================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sistema Paints API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: 'Conectada'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al Sistema Paints API',
    project: 'Sistema de Gestión de Pinturas',
    university: 'UMES',
    course: 'Bases de Datos II',
    version: '1.0.0',
    modelos: [
      'Profile (Perfiles)',
      'User (Usuarios)', 
      'Category (Categorías)',
      'Unit (Unidades)',
      'Store (Sucursales)',
      'Color (Colores)'
    ],
    endpoints: {
      health: '/health',
      api: '/api',
      test_models: '/test-models'
    }
  });
});

// Ruta de prueba para verificar modelos
app.get('/test-models', async (req, res) => {
  try {
    // Importar modelos para la prueba
    const { Profile, User, Category, Unit, Store, Color } = require('./src/models');
    
    // Contar registros en cada tabla (sin crear nada)
    const counts = {
      profiles: await Profile.count(),
      users: await User.count(),
      categories: await Category.count(),
      units: await Unit.count(),
      stores: await Store.count(),
      colors: await Color.count()
    };

    res.status(200).json({
      success: true,
      message: 'Modelos funcionando correctamente',
      models_status: 'OK',
      table_counts: counts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error al probar modelos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al conectar con los modelos',
      error: error.message
    });
  }
});

// ==============================================
// RUTAS DE LA API
// ==============================================

// Importar rutas
const authRoutes = require('./src/routes/auth');

// Usar rutas con prefijo
app.use('/api/auth', authRoutes);
app.use('/api/products', require('./src/routes/products'));

// 🆕 NUEVAS RUTAS AGREGADAS:
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/units', require('./src/routes/units'));
app.use('/api/colors', require('./src/routes/colors'));

// Ruta de prueba protegida
app.get('/api/protected', require('./src/middleware/auth').authenticated, (req, res) => {
  res.json({
    success: true,
    message: 'Acceso autorizado',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// ==============================================
// MANEJO DE ERRORES
// ==============================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    suggestion: 'Verifica la URL y método HTTP'
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  
  // Error de JSON malformado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en la petición',
      error: 'INVALID_JSON'
    });
  }
  
  // Error general
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'INTERNAL_ERROR'
  });
});

// ==============================================
// INICIALIZACIÓN DEL SERVIDOR
// ==============================================

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Sincronizar modelos en desarrollo (crear tablas)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
    
    // Iniciar servidor
    app.listen(PORT, HOST, () => {
      console.log('🚀 ======================================');
      console.log('🎨 SISTEMA PAINTS - API INICIADA');
      console.log('🚀 ======================================');
      console.log('🌐 Servidor ejecutándose en: http://' + HOST + ':' + PORT);
      console.log('🏥 Health check: http://' + HOST + ':' + PORT + '/health');
      console.log('🧪 Test modelos: http://' + HOST + ':' + PORT + '/test-models');
      console.log('🗃️  Base de datos: ' + (process.env.DB_NAME || 'sistema_paints'));
      console.log('📊 Modelos: Profile, User, Category, Unit, Store, Color');
      console.log('🎯 Entorno: ' + (process.env.NODE_ENV || 'development'));
      console.log('🚀 ======================================');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.log('💡 Asegúrate de que XAMPP esté ejecutándose y la BD exista');
    process.exit(1);
  }
}

// Manejar cierre graceful del servidor
process.on('SIGTERM', async () => {
  console.log('🛑 Cerrando servidor...');
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error al cerrar conexión BD:', error);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Cerrando servidor...');
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error al cerrar conexión BD:', error);
  }
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;