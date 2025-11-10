// ==============================================
// CONTROLADOR DE AUTENTICACIÓN
// Login, logout, verificación JWT
// ==============================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Profile, Store } = require('../models');

class AuthController {
  
  // Login de usuario
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Validaciones básicas
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username y password son requeridos',
          error: 'MISSING_CREDENTIALS'
        });
      }
      
      // Buscar usuario con relaciones
      const user = await User.findOne({
        where: { 
          username: username,
          estado: 'Activo'
        },
        include: [
          {
            model: Profile,
            as: 'perfil',
            attributes: ['id_perfil', 'nombre_perfil', 'permisos']
          },
          {
            model: Store,
            as: 'sucursal',
            attributes: ['id_sucursal', 'codigo_sucursal', 'nombre', 'ciudad']
          }
        ]
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas',
          error: 'INVALID_CREDENTIALS'
        });
      }
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        // Incrementar intentos fallidos
        await user.update({ 
          intentos_login: user.intentos_login + 1 
        });
        
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas',
          error: 'INVALID_CREDENTIALS'
        });
      }
      
      // Generar token JWT
      const token = jwt.sign(
        {
          id_usuario: user.id_usuario,
          username: user.username,
          id_perfil: user.id_perfil,
          nombre_perfil: user.perfil?.nombre_perfil,
          id_sucursal: user.id_sucursal
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      // Actualizar último acceso
      await user.update({ 
        ultimo_acceso: new Date(),
        intentos_login: 0
      });
      
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            id_usuario: user.id_usuario,
            username: user.username,
            nombre_completo: user.nombre_completo,
            email: user.email,
            telefono: user.telefono,
            perfil: user.perfil,
            sucursal: user.sucursal,
            ultimo_acceso: user.ultimo_acceso
          }
        }
      });
      
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
  
  // Obtener perfil del usuario autenticado
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id_usuario, {
        include: [
          {
            model: Profile,
            as: 'perfil',
            attributes: ['id_perfil', 'nombre_perfil', 'descripcion', 'permisos']
          },
          {
            model: Store,
            as: 'sucursal',
            attributes: ['id_sucursal', 'codigo_sucursal', 'nombre', 'ciudad', 'direccion']
          }
        ],
        attributes: { exclude: ['password_hash'] }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
      
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Cambiar contraseña
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual y nueva son requeridas'
        });
      }
      
      const user = await User.findByPk(req.user.id_usuario);
      
      // Verificar contraseña actual
      const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isValidCurrentPassword) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        });
      }
      
      // Hash nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      
      // Actualizar contraseña
      await user.update({ password_hash: hashedNewPassword });
      
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Logout (invalidar token - en frontend)
  static async logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  }
}

module.exports = AuthController;
