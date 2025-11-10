// ==============================================
// UTILIDADES COMUNES - Sistema Paints
// Funciones reutilizables para todo el frontend
// ==============================================

class Utils {
    
    // ==============================================
    // FORMATEO DE DATOS
    // ==============================================

    /**
     * Formatear número como moneda
     */
    static formatCurrency(amount, currency = 'GTQ') {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Formatear fecha
     */
    static formatDate(date, format = 'short') {
        if (!date) return '-';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        const options = {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            },
            time: { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        };

        return dateObj.toLocaleDateString('es-GT', options[format] || options.short);
    }

    /**
     * Formatear número
     */
    static formatNumber(number, decimals = 0) {
        if (number === null || number === undefined) return '-';
        
        return new Intl.NumberFormat('es-GT', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    /**
     * Obtener iniciales de un nombre
     */
    static getInitials(name) {
        if (!name) return 'U';
        
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    // ==============================================
    // MANIPULACIÓN DEL DOM
    // ==============================================

    /**
     * Crear elemento HTML con atributos
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Establecer atributos
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Establecer contenido
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Mostrar/ocultar elemento
     */
    static toggleElement(element, show = null) {
        if (!element) return;
        
        if (show === null) {
            show = element.classList.contains('hidden');
        }
        
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }

    /**
     * Limpiar contenido de elemento
     */
    static clearElement(element) {
        if (element) {
            element.innerHTML = '';
        }
    }

    /**
     * Agregar clase con animación
     */
    static addClassWithAnimation(element, className, duration = 300) {
        if (!element) return;
        
        element.classList.add(className);
        
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }

    // ==============================================
    // VALIDACIONES
    // ==============================================

    /**
     * Validar email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validar teléfono guatemalteco
     */
    static validatePhone(phone) {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s|-/g, ''));
    }

    /**
     * Validar NIT guatemalteco
     */
    static validateNIT(nit) {
        const nitRegex = /^[0-9]{1,8}-?[0-9Kk]$/;
        return nitRegex.test(nit);
    }

    /**
     * Validar campo requerido
     */
    static validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    // ==============================================
    // NOTIFICACIONES Y ALERTAS
    // ==============================================

    /**
     * Mostrar notificación toast
     */
    static showToast(message, type = 'info', duration = 3000) {
        // Crear elemento toast
        const toast = Utils.createElement('div', {
            className: `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 transform translate-x-full opacity-0`
        });

        // Establecer clases según el tipo
        const typeClasses = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.classList.add(...typeClasses[type].split(' '));
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type]} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-current hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(toast);

        // Animar entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 10);

        // Remover automáticamente
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Confirmar acción
     */
    static async confirm(message, title = '¿Está seguro?') {
        return new Promise((resolve) => {
            // Crear modal de confirmación simple
            const modal = Utils.createElement('div', {
                className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            });

            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    <h3 class="text-lg font-semibold mb-4">${title}</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <div class="flex justify-end space-x-3">
                        <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" data-action="cancel">
                            Cancelar
                        </button>
                        <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" data-action="confirm">
                            Confirmar
                        </button>
                    </div>
                </div>
            `;

            // Event listeners
            modal.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'confirm') {
                    modal.remove();
                    resolve(true);
                } else if (e.target.dataset.action === 'cancel' || e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });

            document.body.appendChild(modal);
        });
    }

    // ==============================================
    // UTILIDADES DE URL Y NAVEGACIÓN
    // ==============================================

    /**
     * Obtener parámetros de URL
     */
    static getUrlParams() {
        return new URLSearchParams(window.location.search);
    }

    /**
     * Actualizar parámetro de URL sin recargar
     */
    static updateUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    /**
     * Redirigir con delay
     */
    static redirectTo(url, delay = 0) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }

    // ==============================================
    // UTILIDADES DE ALMACENAMIENTO
    // ==============================================

    /**
     * Guardar en localStorage con manejo de errores
     */
    static saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }

    /**
     * Obtener de localStorage con manejo de errores
     */
    static getFromStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    }

    // ==============================================
    // UTILIDADES DE DEBUGGING
    // ==============================================

    /**
     * Log con timestamp
     */
    static log(message, type = 'info') {
        if (!CONFIG.DEBUG.ENABLED) return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        
        switch (type) {
            case 'error':
                console.error(prefix, message);
                break;
            case 'warn':
                console.warn(prefix, message);
                break;
            case 'debug':
                console.debug(prefix, message);
                break;
            default:
                console.log(prefix, message);
        }
    }

    // ==============================================
    // UTILIDADES DE RENDIMIENTO
    // ==============================================

    /**
     * Debounce function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==============================================
    // UTILIDADES DE ARCHIVOS
    // ==============================================

    /**
     * Convertir bytes a formato legible
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Validar tipo de archivo
     */
    static validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    }
}

// Exportar utilidades
window.Utils = Utils;