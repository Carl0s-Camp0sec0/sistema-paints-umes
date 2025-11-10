// ==============================================
// MIDDLEWARE DE AUTENTICACIÓN
// Verificación de tokens JWT y permisos
// ==============================================

const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');

class AuthMiddleware {
  
  // Verificar token JWT
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token de autorización requerido',
          error: 'MISSING_TOKEN'
        });
      }
      
      const token = authHeader.split(' ')[1]; // Bearer TOKEN
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Formato de token inválido',
          error: 'INVALID_TOKEN_FORMAT'
        });
      }
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuario actual
      const user = await User.findByPk(decoded.id_usuario, {
        include: [{
          model: Profile,
          as: 'perfil',
          attributes: ['id_perfil', 'nombre_perfil', 'permisos']
        }],
        attributes: { exclude: ['password_hash'] }
      });
      
      if (!user || user.estado !== 'Activo') {
        return res.status(401).json({
          success: false,
          message: 'Usuario no válido o inactivo',
          error: 'USER_INACTIVE'
        });
      }
      
      // Agregar datos del usuario a la request
      req.user = {
        id_usuario: user.id_usuario,
        username: user.username,
        nombre_completo: user.nombre_completo,
        id_perfil: user.id_perfil,
        nombre_perfil: user.perfil?.nombre_perfil,
        permisos: user.perfil?.permisos || {},
        id_sucursal: user.id_sucursal
      };
      
      next();
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          error: 'TOKEN_EXPIRED'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido',
          error: 'INVALID_TOKEN'
        });
      }
      
      console.error('Error en verificación de token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
  
  // Verificar permisos por perfil
  static checkRole(...allowedRoles) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado',
            error: 'NOT_AUTHENTICATED'
          });
        }
        
        const userRole = req.user.nombre_perfil;
        
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: 'Acceso denegado - Permisos insuficientes',
            error: 'INSUFFICIENT_PERMISSIONS',
            required_roles: allowedRoles,
            user_role: userRole
          });
        }
        
        next();
        
      } catch (error) {
        console.error('Error en verificación de permisos:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }
    };
  }
  
  // Solo para Gerentes
  static managerOnly(req, res, next) {
    return AuthMiddleware.checkRole('Gerente')(req, res, next);
  }
  
  // Para Gerentes y Digitadores
  static adminOrDigitizer(req, res, next) {
    return AuthMiddleware.checkRole('Gerente', 'Digitador')(req, res, next);
  }
  
  // Para todos los roles autenticados
  static authenticated(req, res, next) {
    return AuthMiddleware.verifyToken(req, res, next);
  }
}

module.exports = AuthMiddleware;
