// ==============================================
// MÓDULO DE LOGIN - Sistema Paints
// Manejo específico de la página de login
// ==============================================

const AuthModule = {
    
    // ==============================================
    // INICIALIZACIÓN
    // ==============================================
    
    init() {
        this.bindEvents();
        this.checkExistingSession();
        this.setupPasswordToggle();
    },

    // ==============================================
    // EVENTOS
    // ==============================================

    bindEvents() {
        // Evento del formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }

        // Evento para mostrar/ocultar contraseña
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        }

        // Eventos de validación en tiempo real
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput) {
            usernameInput.addEventListener('input', () => this.clearFieldError('username'));
            usernameInput.addEventListener('blur', () => this.validateUsername());
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.clearFieldError('password'));
            passwordInput.addEventListener('blur', () => this.validatePassword());
        }
    },

    // ==============================================
    // MANEJO DE LOGIN
    // ==============================================

    async handleLoginSubmit(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        this.clearAllErrors();
        
        // Obtener datos del formulario
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username').trim(),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        // Validar formulario
        if (!this.validateForm(credentials)) {
            return;
        }

        try {
            // Mostrar estado de carga
            this.setLoadingState(true);
            
            // Realizar login
            const response = await apiClient.login({
                username: credentials.username,
                password: credentials.password
            });

            // Procesar respuesta exitosa
            if (authManager.handleLoginSuccess(response, credentials.remember)) {
                this.showAlert('success', '¡Bienvenido al sistema!');
                
                // Pequeña pausa para mostrar el mensaje
                setTimeout(() => {
                    authManager.redirectToDashboard();
                }, 1000);
            } else {
                throw new Error('Error procesando la respuesta del servidor');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('error', error.message || 'Error al iniciar sesión');
        } finally {
            this.setLoadingState(false);
        }
    },

    // ==============================================
    // VALIDACIONES
    // ==============================================

    validateForm(credentials) {
        let isValid = true;

        // Validar username
        if (!credentials.username) {
            this.showFieldError('username', 'El usuario es requerido');
            isValid = false;
        } else if (credentials.username.length < 3) {
            this.showFieldError('username', 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        }

        // Validar password
        if (!credentials.password) {
            this.showFieldError('password', 'La contraseña es requerida');
            isValid = false;
        } else if (credentials.password.length < 6) {
            this.showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        return isValid;
    },

    validateUsername() {
        const username = document.getElementById('username').value.trim();
        
        if (username && username.length < 3) {
            this.showFieldError('username', 'El usuario debe tener al menos 3 caracteres');
            return false;
        }
        
        this.clearFieldError('username');
        return true;
    },

    validatePassword() {
        const password = document.getElementById('password').value;
        
        if (password && password.length < 6) {
            this.showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        this.clearFieldError('password');
        return true;
    },

    // ==============================================
    // UI - ESTADOS Y ALERTAS
    // ==============================================

    setLoadingState(loading) {
        const loginButton = document.getElementById('loginButton');
        const loginButtonText = document.getElementById('loginButtonText');
        const loginSpinner = document.getElementById('loginSpinner');
        const form = document.getElementById('loginForm');

        if (loading) {
            loginButton.disabled = true;
            loginButton.classList.add('opacity-75', 'cursor-not-allowed');
            loginButtonText.classList.add('hidden');
            loginSpinner.classList.remove('hidden');
            form.classList.add('pointer-events-none');
        } else {
            loginButton.disabled = false;
            loginButton.classList.remove('opacity-75', 'cursor-not-allowed');
            loginButtonText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
            form.classList.remove('pointer-events-none');
        }
    },

    showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.getElementById('alert');

        // Definir clases según el tipo
        const alertClasses = {
            success: 'bg-green-50 border border-green-200 text-green-800',
            error: 'bg-red-50 border border-red-200 text-red-800',
            warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border border-blue-200 text-blue-800'
        };

        // Definir iconos según el tipo
        const alertIcons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        // Limpiar clases previas
        alert.className = 'p-4 rounded-lg text-sm';
        alert.classList.add(...alertClasses[type].split(' '));

        // Establecer contenido
        alert.innerHTML = `
            <i class="${alertIcons[type]} mr-2"></i>
            ${message}
        `;

        // Mostrar alerta
        alertContainer.classList.remove('hidden');

        // Ocultar después de 5 segundos
        setTimeout(() => {
            alertContainer.classList.add('hidden');
        }, CONFIG.ALERTS.DURATION);
    },

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);

        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            inputElement.classList.add('border-red-500', 'focus:ring-red-500');
        }
    },

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);

        if (errorElement && inputElement) {
            errorElement.classList.add('hidden');
            inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
        }
    },

    clearAllErrors() {
        this.clearFieldError('username');
        this.clearFieldError('password');
        
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.classList.add('hidden');
        }
    },

    // ==============================================
    // FUNCIONALIDADES ADICIONALES
    // ==============================================

    setupPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');

        if (toggleButton && passwordInput && eyeIcon) {
            toggleButton.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                
                passwordInput.type = isPassword ? 'text' : 'password';
                eyeIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            });
        }
    },

    checkExistingSession() {
        // Si ya está autenticado, redirigir al dashboard
        if (authManager.isAuthenticated()) {
            authManager.redirectToDashboard();
            return;
        }

        // Verificar si se debe recordar la sesión
        const remember = localStorage.getItem(CONFIG.AUTH.REMEMBER_KEY) === 'true';
        if (remember) {
            const rememberCheckbox = document.getElementById('remember');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    },

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');

        if (passwordInput && eyeIcon) {
            const isPassword = passwordInput.type === 'password';
            
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        }
    }
};