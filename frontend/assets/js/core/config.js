// ==============================================
// CONFIGURACIÓN FRONTEND - Sistema Paints
// ==============================================

const CONFIG = {
    // URLs del API
    API_BASE_URL: 'http://localhost:3000',
    API_ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout',
            PROFILE: '/api/auth/profile',
            CHANGE_PASSWORD: '/api/auth/change-password'
        },
        USERS: '/api/users',
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        STORES: '/api/stores',
        CUSTOMERS: '/api/customers',
        QUOTES: '/api/quotes',
        INVOICES: '/api/invoices',
        REPORTS: '/api/reports'
    },

    // Configuración de autenticación
    AUTH: {
        TOKEN_KEY: 'sistema_paints_token',
        USER_KEY: 'sistema_paints_user',
        REMEMBER_KEY: 'sistema_paints_remember',
        TOKEN_EXPIRY: 8 * 60 * 60 * 1000 // 8 horas en milliseconds
    },

    // Configuración de la aplicación
    APP: {
        NAME: 'Sistema Paints',
        VERSION: '1.0.0',
        DESCRIPTION: 'Sistema de gestión para cadena de pinturas',
        COMPANY: 'Universidad UMES - Bases de Datos II'
    },

    // Configuración de paginación
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZES: [10, 25, 50, 100]
    },

    // Roles y permisos
    ROLES: {
        GERENTE: 'Gerente',
        DIGITADOR: 'Digitador',
        CAJERO: 'Cajero'
    },

    // Configuración de alertas
    ALERTS: {
        DURATION: 5000, // 5 segundos
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    // Configuración de validación
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 6,
        MAX_USERNAME_LENGTH: 50,
        MAX_PRODUCT_NAME_LENGTH: 150,
        MAX_DESCRIPTION_LENGTH: 500
    },

    // Configuración de archivos
    FILES: {
        MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        UPLOAD_PATH: '/uploads/'
    },

    // Estados del sistema
    STATES: {
        ACTIVE: 'Activo',
        INACTIVE: 'Inactivo',
        BLOCKED: 'Bloqueado',
        DISCONTINUED: 'Descontinuado'
    },

    // Configuración de desarrollo
    DEBUG: {
        ENABLED: true,
        LOG_LEVEL: 'info', // error, warn, info, debug
        SHOW_API_CALLS: true
    }
};

// Función para obtener URL completa del API
CONFIG.getApiUrl = function(endpoint) {
    return this.API_BASE_URL + endpoint;
};

// Función para validar si estamos en desarrollo
CONFIG.isDevelopment = function() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
};

// Exportar configuración
window.CONFIG = CONFIG;