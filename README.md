# 🎨 Sistema Paints - Proyecto Bases de Datos II

## 📝 Descripción
Sistema de gestión para cadena de pinturas desarrollado como proyecto académico para la Universidad UMES - Bases de Datos II.

## 🏪 Sucursales
- Centro Comercial Pradera Chimaltenango
- Pradera Escuintla  
- Las Américas Mazatenango
- La Trinidad Coatepeque
- Pradera Xela Quetzaltenango
- Centro Comercial Miraflores Ciudad de Guatemala

## 🛠️ Tecnologías
- **Backend:** Node.js + Express.js + Sequelize ORM
- **Frontend:** Vanilla JavaScript + Tailwind CSS
- **Base de Datos:** MySQL (XAMPP)
- **Autenticación:** JWT + bcrypt
- **Validaciones:** express-validator

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- XAMPP (MySQL)
- Git

### Pasos de instalación
1. Clonar repositorio:
   \\\ash
   git clone https://github.com/tu-usuario/sistema-paints.git
   cd sistema-paints
   \\\

2. Instalar dependencias:
   \\\ash
   npm run setup
   \\\

3. Configurar variables de entorno:
   \\\ash
   cp .env.example .env
   # Editar .env con las credenciales correctas
   \\\

4. Crear base de datos en MySQL:
   \\\sql
   CREATE DATABASE sistema_paints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   \\\

5. Ejecutar migraciones:
   \\\ash
   npm run migrate
   \\\

6. Cargar datos iniciales:
   \\\ash
   npm run seed
   \\\

## 🚀 Uso

### Desarrollo
\\\ash
npm run dev
\\\

### Producción
\\\ash
npm start
\\\

### Base de datos
\\\ash
# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Backup
npm run backup
\\\

## 🏗️ Estructura del Proyecto
\\\
sistema-paints/
├── backend/          # API y lógica de negocio
├── frontend/         # Interfaz de usuario
├── database/         # Scripts y backups de BD
└── docs/            # Documentación del proyecto
\\\

## 👥 Usuarios del Sistema
- **Gerente:** Acceso completo + reportes
- **Digitador:** Gestión de productos y clientes  
- **Cajero:** Solo facturación

## 📊 Funcionalidades
- ✅ Gestión de productos y categorías
- ✅ Control de inventario
- ✅ Sistema de facturación
- ✅ Cotizaciones
- ✅ Carrito de compras
- ✅ Localización GPS de sucursales
- ✅ 7 reportes específicos
- ✅ Sistema de backup automático

## 🎓 Proyecto Académico
Universidad UMES - Ingeniería de Sistemas  
Materia: Bases de Datos II - Sexto Semestre  
Año: 2025

## 📄 Licencia
MIT License - Uso académico
