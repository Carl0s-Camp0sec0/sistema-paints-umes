// ==============================================
// CLIENTE API - Sistema Paints
// Manejo centralizado de todas las llamadas al API
// ==============================================

class ApiClient {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // ==============================================
    // MÉTODOS PRIVADOS
    // ==============================================

    /**
 * Obtener headers con autenticación
 */
    _getAuthHeaders() {
        // Buscar token en ambas ubicaciones (igual que en authManager.getToken())
        const token = localStorage.getItem(CONFIG.AUTH.TOKEN_KEY) ||
            sessionStorage.getItem(CONFIG.AUTH.TOKEN_KEY);

        const headers = { ...this.defaultHeaders };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Log para debugging
        if (CONFIG.DEBUG.SHOW_API_CALLS) {
            console.log('Auth headers:', {
                tokenFound: !!token,
                tokenSource: token ? (localStorage.getItem(CONFIG.AUTH.TOKEN_KEY) ? 'localStorage' : 'sessionStorage') : 'none'
            });
        }

        return headers;
    }

    /**
     * Procesar respuesta del API
     */
    async _processResponse(response) {
        // Log de la respuesta para debugging
        if (CONFIG.DEBUG.SHOW_API_CALLS) {
            console.log(`API Response [${response.status}]:`, response.url);
        }

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            // Manejar errores específicos
            if (response.status === 401) {
                this._handleUnauthorized();
                throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
            }
            
            if (response.status === 403) {
                throw new Error('No tiene permisos para realizar esta acción.');
            }

            if (response.status === 404) {
                throw new Error('Recurso no encontrado.');
            }

            if (response.status >= 500) {
                throw new Error('Error interno del servidor. Intente nuevamente.');
            }

            // Intentar obtener mensaje de error del servidor
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            } catch (e) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        // Intentar parsear JSON
        try {
            return await response.json();
        } catch (e) {
            throw new Error('Respuesta inválida del servidor.');
        }
    }

    /**
     * Manejar error de autorización
     */
    _handleUnauthorized() {
        // Limpiar datos de autenticación
        localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
        localStorage.removeItem(CONFIG.AUTH.USER_KEY);
        
        // Redirigir al login si no estamos ya ahí
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '../admin/login.html';
        }
    }

    /**
     * Realizar petición HTTP
     */
    async _request(method, endpoint, data = null, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = options.includeAuth !== false ? this._getAuthHeaders() : this.defaultHeaders;

        const config = {
            method: method.toUpperCase(),
            headers,
            ...options
        };

        // Agregar body si hay data y no es GET
        if (data && method.toUpperCase() !== 'GET') {
            config.body = JSON.stringify(data);
        }

        // Log de la petición para debugging
        if (CONFIG.DEBUG.SHOW_API_CALLS) {
            console.log(`API Request [${method.toUpperCase()}]:`, url, data);
        }

        try {
            const response = await fetch(url, config);
            return await this._processResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==============================================
    // MÉTODOS PÚBLICOS - HTTP VERBS
    // ==============================================

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this._request('GET', endpoint, null, options);
    }

    /**
     * POST request
     */
    async post(endpoint, data, options = {}) {
        return this._request('POST', endpoint, data, options);
    }

    /**
     * PUT request
     */
    async put(endpoint, data, options = {}) {
        return this._request('PUT', endpoint, data, options);
    }

    /**
     * PATCH request
     */
    async patch(endpoint, data, options = {}) {
        return this._request('PATCH', endpoint, data, options);
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this._request('DELETE', endpoint, null, options);
    }

    // ==============================================
    // MÉTODOS ESPECÍFICOS DE AUTENTICACIÓN
    // ==============================================

    /**
     * Login de usuario
     */
    async login(credentials) {
        return this.post(CONFIG.API_ENDPOINTS.AUTH.LOGIN, credentials, { includeAuth: false });
    }

    /**
     * Logout de usuario
     */
    async logout() {
        return this.post(CONFIG.API_ENDPOINTS.AUTH.LOGOUT);
    }

    /**
     * Obtener perfil de usuario
     */
    async getProfile() {
        return this.get(CONFIG.API_ENDPOINTS.AUTH.PROFILE);
    }

    /**
     * Cambiar contraseña
     */
    async changePassword(passwordData) {
        return this.post(CONFIG.API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    }

    // ==============================================
    // MÉTODOS ESPECÍFICOS DE RECURSOS
    // ==============================================

    /**
     * Productos
     */
    products = {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = queryString ? `${CONFIG.API_ENDPOINTS.PRODUCTS}?${queryString}` : CONFIG.API_ENDPOINTS.PRODUCTS;
            return this.get(endpoint);
        },
        getById: (id) => this.get(`${CONFIG.API_ENDPOINTS.PRODUCTS}/${id}`),
        create: (data) => this.post(CONFIG.API_ENDPOINTS.PRODUCTS, data),
        update: (id, data) => this.put(`${CONFIG.API_ENDPOINTS.PRODUCTS}/${id}`, data),
        delete: (id) => this.delete(`${CONFIG.API_ENDPOINTS.PRODUCTS}/${id}`),
        updateStock: (id, stockData) => this.patch(`${CONFIG.API_ENDPOINTS.PRODUCTS}/${id}/stock`, stockData)
    };

    /**
     * Usuarios
     */
    users = {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = queryString ? `${CONFIG.API_ENDPOINTS.USERS}?${queryString}` : CONFIG.API_ENDPOINTS.USERS;
            return this.get(endpoint);
        },
        getById: (id) => this.get(`${CONFIG.API_ENDPOINTS.USERS}/${id}`),
        create: (data) => this.post(CONFIG.API_ENDPOINTS.USERS, data),
        update: (id, data) => this.put(`${CONFIG.API_ENDPOINTS.USERS}/${id}`, data),
        delete: (id) => this.delete(`${CONFIG.API_ENDPOINTS.USERS}/${id}`)
    };

    /**
     * Categorías
     */
    categories = {
        getAll: () => this.get(CONFIG.API_ENDPOINTS.CATEGORIES),
        getById: (id) => this.get(`${CONFIG.API_ENDPOINTS.CATEGORIES}/${id}`),
        create: (data) => this.post(CONFIG.API_ENDPOINTS.CATEGORIES, data),
        update: (id, data) => this.put(`${CONFIG.API_ENDPOINTS.CATEGORIES}/${id}`, data),
        delete: (id) => this.delete(`${CONFIG.API_ENDPOINTS.CATEGORIES}/${id}`)
    };

    /**
     * Sucursales
     */
    stores = {
        getAll: () => this.get(CONFIG.API_ENDPOINTS.STORES),
        getById: (id) => this.get(`${CONFIG.API_ENDPOINTS.STORES}/${id}`),
        create: (data) => this.post(CONFIG.API_ENDPOINTS.STORES, data),
        update: (id, data) => this.put(`${CONFIG.API_ENDPOINTS.STORES}/${id}`, data),
        delete: (id) => this.delete(`${CONFIG.API_ENDPOINTS.STORES}/${id}`)
    };
}

// Crear instancia global del cliente API
window.apiClient = new ApiClient();