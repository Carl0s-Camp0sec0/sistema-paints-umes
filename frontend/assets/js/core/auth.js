// ==============================================
// MÓDULO DE AUTENTICACIÓN - Sistema Paints
// Gestión de login, logout, tokens y estado de usuario
// ==============================================

class AuthManager {
    constructor() {
        this.tokenKey = CONFIG.AUTH.TOKEN_KEY;
        this.userKey = CONFIG.AUTH.USER_KEY;
        this.rememberKey = CONFIG.AUTH.REMEMBER_KEY;
        this.tokenExpiry = CONFIG.AUTH.TOKEN_EXPIRY;
    }

    // ==============================================
    // GESTIÓN DE TOKENS
    // ==============================================

    /**
     * Guardar token de autenticación
     */
    saveToken(token, remember = false) {
        if (remember) {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.rememberKey, 'true');
            localStorage.setItem(`${this.tokenKey}_timestamp`, Date.now().toString());
        } else {
            sessionStorage.setItem(this.tokenKey, token);
            sessionStorage.setItem(`${this.tokenKey}_timestamp`, Date.now().toString());
        }
    }

    /**
     * Obtener token de autenticación
     */
    getToken() {
        let token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
        
        if (token && this.isTokenExpired()) {
            this.clearAuth();
            return null;
        }
        
        return token;
    }

    /**
     * Verificar si el token ha expirado
     */
    isTokenExpired() {
        const timestamp = localStorage.getItem(`${this.tokenKey}_timestamp`) || 
                         sessionStorage.getItem(`${this.tokenKey}_timestamp`);
        
        if (!timestamp) return true;
        
        const now = Date.now();
        const tokenTime = parseInt(timestamp);
        
        return (now - tokenTime) > this.tokenExpiry;
    }

    /**
     * Limpiar datos de autenticación
     */
    clearAuth() {
        // Limpiar localStorage
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.rememberKey);
        localStorage.removeItem(`${this.tokenKey}_timestamp`);
        
        // Limpiar sessionStorage
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.userKey);
        sessionStorage.removeItem(`${this.tokenKey}_timestamp`);
    }

    // ==============================================
    // GESTIÓN DE USUARIO
    // ==============================================

    /**
     * Guardar datos de usuario
     */
    saveUser(userData, remember = false) {
        const userString = JSON.stringify(userData);
        
        if (remember) {
            localStorage.setItem(this.userKey, userString);
        } else {
            sessionStorage.setItem(this.userKey, userString);
        }
    }

    /**
     * Obtener datos de usuario
     */
    getUser() {
        const userString = localStorage.getItem(this.userKey) || 
                          sessionStorage.getItem(this.userKey);
        
        if (!userString) return null;
        
        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }

    // ==============================================
    // VERIFICACIONES DE AUTENTICACIÓN
    // ==============================================

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        
        return !!(token && user && !this.isTokenExpired());
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    hasRole(role) {
        const user = this.getUser();
        if (!user || !user.perfil) return false;
        
        return user.perfil.nombre_perfil === role;
    }

    /**
     * Verificar si el usuario tiene uno de varios roles
     */
    hasAnyRole(roles) {
        return roles.some(role => this.hasRole(role));
    }

    /**
     * Obtener rol del usuario actual
     */
    getUserRole() {
        const user = this.getUser();
        return user?.perfil?.nombre_perfil || null;
    }

    // ==============================================
    // MÉTODOS DE AUTENTICACIÓN
    // ==============================================

    /**
     * Procesar login exitoso
     */
    handleLoginSuccess(response, remember = false) {
        try {
            const { token, user } = response.data;
            
            // Guardar token y usuario
            this.saveToken(token, remember);
            this.saveUser(user, remember);
            
            // Log para debugging
            if (CONFIG.DEBUG.ENABLED) {
                console.log('Login successful:', {
                    user: user.nombre_completo,
                    role: user.perfil?.nombre_perfil,
                    store: user.sucursal?.nombre
                });
            }
            
            return true;
        } catch (e) {
            console.error('Error processing login success:', e);
            return false;
        }
    }

    /**
     * Realizar logout
     */
    async logout() {
        try {
            // Intentar llamar al endpoint de logout
            if (this.isAuthenticated()) {
                await apiClient.logout();
            }
        } catch (e) {
            console.warn('Error calling logout endpoint:', e);
        } finally {
            // Limpiar datos locales siempre
            this.clearAuth();
            
            // Redirigir al login
            this.redirectToLogin();
        }
    }

    /**
     * Redirigir al login
     */
    redirectToLogin() {
        window.location.href = './login.html';
    }

    /**
     * Redirigir al dashboard
     */
    redirectToDashboard() {
        window.location.href = './dashboard.html';
    }

    /**
     * Proteger página (verificar autenticación)
     */
    protectPage() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    /**
     * Verificar permisos para página específica
     */
    checkPagePermissions(requiredRoles = []) {
        if (!this.protectPage()) return false;
        
        if (requiredRoles.length === 0) return true;
        
        if (!this.hasAnyRole(requiredRoles)) {
            alert('No tiene permisos para acceder a esta página.');
            this.redirectToDashboard();
            return false;
        }
        
        return true;
    }

    // ==============================================
    // UTILIDADES
    // ==============================================

    /**
     * Obtener información de sesión
     */
    getSessionInfo() {
        return {
            isAuthenticated: this.isAuthenticated(),
            user: this.getUser(),
            role: this.getUserRole(),
            tokenExists: !!this.getToken(),
            tokenExpired: this.isTokenExpired()
        };
    }

    /**
     * Inicializar verificación periódica de token
     */
    initTokenCheck() {
        // Verificar token cada 5 minutos
        setInterval(() => {
            if (this.isAuthenticated() && this.isTokenExpired()) {
                alert('Su sesión ha expirado. Será redirigido al login.');
                this.logout();
            }
        }, 5 * 60 * 1000); // 5 minutos
    }
}

// Crear instancia global del gestor de autenticación
window.authManager = new AuthManager();