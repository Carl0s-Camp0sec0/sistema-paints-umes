// ==============================================
// COMPONENTES DE MODALES - Sistema Paints
// Modales reutilizables para todo el sistema
// ==============================================

class ModalManager {
    constructor() {
        this.modals = new Map();
        this.activeModal = null;
    }

    // ==============================================
    // MODAL GENÉRICO
    // ==============================================

    /**
     * Crear modal genérico
     */
    createModal(id, options = {}) {
        const defaultOptions = {
            size: 'md', // sm, md, lg, xl
            closable: true,
            backdrop: true,
            centered: true,
            title: '',
            content: '',
            footer: true,
            className: ''
        };

        const config = { ...defaultOptions, ...options };

        // Crear estructura del modal
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `fixed inset-0 z-50 overflow-y-auto ${config.className}`;
        modal.setAttribute('aria-hidden', 'true');

        const sizeClasses = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            '2xl': 'max-w-6xl'
        };

        modal.innerHTML = `
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" ${config.backdrop ? 'data-close="true"' : ''}></div>
            
            <!-- Modal content -->
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[config.size]} transform transition-all">
                    
                    ${config.title ? `
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900" id="${id}-title">${config.title}</h3>
                        ${config.closable ? `
                        <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" data-close="true">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                        ` : ''}
                    </div>
                    ` : ''}
                    
                    <!-- Body -->
                    <div class="p-6" id="${id}-content">
                        ${config.content}
                    </div>
                    
                    ${config.footer ? `
                    <!-- Footer -->
                    <div class="flex justify-end space-x-3 p-6 border-t border-gray-200" id="${id}-footer">
                        ${config.closable ? `
                        <button type="button" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" data-close="true">
                            Cancelar
                        </button>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Event listeners para cerrar
        if (config.closable || config.backdrop) {
            modal.addEventListener('click', (e) => {
                if (e.target.dataset.close === 'true') {
                    this.closeModal(id);
                }
            });

            // ESC key para cerrar
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.activeModal === id) {
                    this.closeModal(id);
                }
            });
        }

        // Agregar al DOM
        document.body.appendChild(modal);
        this.modals.set(id, { element: modal, config });

        return modal;
    }

    /**
     * Mostrar modal
     */
    showModal(id) {
        const modalData = this.modals.get(id);
        if (!modalData) return;

        const modal = modalData.element;
        this.activeModal = id;

        // Prevenir scroll en el body
        document.body.style.overflow = 'hidden';

        // Mostrar modal
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');

        // Animación de entrada
        const content = modal.querySelector('.bg-white');
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';

        requestAnimationFrame(() => {
            content.style.transform = 'scale(1)';
            content.style.opacity = '1';
            content.style.transition = 'all 0.2s ease-out';
        });

        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    /**
     * Cerrar modal
     */
    closeModal(id) {
        const modalData = this.modals.get(id);
        if (!modalData) return;

        const modal = modalData.element;

        // Animación de salida
        const content = modal.querySelector('.bg-white');
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            this.activeModal = null;
        }, 200);
    }

    /**
     * Actualizar contenido del modal
     */
    updateModal(id, updates = {}) {
        const modalData = this.modals.get(id);
        if (!modalData) return;

        const modal = modalData.element;

        if (updates.title) {
            const titleElement = modal.querySelector(`#${id}-title`);
            if (titleElement) titleElement.textContent = updates.title;
        }

        if (updates.content) {
            const contentElement = modal.querySelector(`#${id}-content`);
            if (contentElement) {
                contentElement.innerHTML = updates.content;
            }
        }

        if (updates.footer) {
            const footerElement = modal.querySelector(`#${id}-footer`);
            if (footerElement) {
                footerElement.innerHTML = updates.footer;
            }
        }
    }

    // ==============================================
    // MODALES ESPECÍFICOS
    // ==============================================

    /**
     * Modal de confirmación
     */
    showConfirm(options = {}) {
        return new Promise((resolve) => {
            const id = 'confirm-modal';
            const config = {
                title: options.title || '¿Está seguro?',
                content: `
                    <div class="text-center">
                        <div class="mx-auto w-16 h-16 rounded-full ${options.type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'} flex items-center justify-center mb-4">
                            <i class="fas ${options.type === 'danger' ? 'fa-exclamation-triangle text-red-600' : 'fa-question text-yellow-600'} text-2xl"></i>
                        </div>
                        <p class="text-gray-600">${options.message || '¿Desea continuar con esta acción?'}</p>
                    </div>
                `,
                footer: `
                    <button type="button" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" data-action="cancel">
                        ${options.cancelText || 'Cancelar'}
                    </button>
                    <button type="button" class="px-4 py-2 ${options.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors" data-action="confirm">
                        ${options.confirmText || 'Confirmar'}
                    </button>
                `,
                size: 'sm'
            };

            // Eliminar modal existente
            this.destroyModal(id);

            // Crear nuevo modal
            const modal = this.createModal(id, config);

            // Event listeners específicos
            modal.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'confirm') {
                    this.closeModal(id);
                    resolve(true);
                } else if (e.target.dataset.action === 'cancel') {
                    this.closeModal(id);
                    resolve(false);
                }
            });

            this.showModal(id);
        });
    }

    /**
     * Modal de formulario
     */
    showForm(options = {}) {
        const id = options.id || 'form-modal';
        const config = {
            title: options.title || 'Formulario',
            content: options.content || '',
            footer: `
                <button type="button" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" data-close="true">
                    Cancelar
                </button>
                <button type="submit" form="${options.formId || 'modal-form'}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    ${options.submitText || 'Guardar'}
                </button>
            `,
            size: options.size || 'md'
        };

        // Eliminar modal existente
        this.destroyModal(id);

        // Crear nuevo modal
        const modal = this.createModal(id, config);

        // Manejar envío del formulario
        if (options.onSubmit) {
            const form = modal.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    options.onSubmit(new FormData(form), this);
                });
            }
        }

        this.showModal(id);
        return modal;
    }

    /**
     * Modal de información
     */
    showInfo(options = {}) {
        const id = 'info-modal';
        const config = {
            title: options.title || 'Información',
            content: `
                <div class="text-center">
                    <div class="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <i class="fas fa-info text-blue-600 text-2xl"></i>
                    </div>
                    <div class="text-gray-600">${options.message || ''}</div>
                </div>
            `,
            footer: `
                <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-close="true">
                    Entendido
                </button>
            `,
            size: 'sm'
        };

        // Eliminar modal existente
        this.destroyModal(id);

        // Crear y mostrar
        this.createModal(id, config);
        this.showModal(id);
    }

    /**
     * Modal de loading
     */
    showLoading(message = 'Cargando...') {
        const id = 'loading-modal';
        const config = {
            title: '',
            content: `
                <div class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">${message}</p>
                </div>
            `,
            footer: false,
            closable: false,
            backdrop: false,
            size: 'sm'
        };

        // Eliminar modal existente
        this.destroyModal(id);

        // Crear y mostrar
        this.createModal(id, config);
        this.showModal(id);
    }

    /**
     * Cerrar modal de loading
     */
    hideLoading() {
        this.closeModal('loading-modal');
    }

    // ==============================================
    // UTILIDADES
    // ==============================================

    /**
     * Destruir modal
     */
    destroyModal(id) {
        const modalData = this.modals.get(id);
        if (modalData) {
            modalData.element.remove();
            this.modals.delete(id);
            
            if (this.activeModal === id) {
                this.activeModal = null;
                document.body.style.overflow = '';
            }
        }
    }

    /**
     * Cerrar todos los modales
     */
    closeAll() {
        this.modals.forEach((modalData, id) => {
            this.closeModal(id);
        });
    }

    /**
     * Verificar si hay un modal activo
     */
    hasActiveModal() {
        return this.activeModal !== null;
    }
}

// Crear instancia global
window.modalManager = new ModalManager();