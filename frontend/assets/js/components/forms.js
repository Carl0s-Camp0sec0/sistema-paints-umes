// ==============================================
// COMPONENTES DE FORMULARIOS - Sistema Paints
// Formularios dinámicos reutilizables para CRUDs
// ==============================================

class FormManager {
    constructor(formId, options = {}) {
        this.formId = formId;
        this.form = document.getElementById(formId);
        
        // Configuración por defecto
        this.options = {
            validateOnSubmit: true,
            validateOnBlur: true,
            showSuccessMessage: true,
            resetOnSuccess: false,
            ...options
        };

        // Estado del formulario
        this.state = {
            isValid: false,
            isSubmitting: false,
            isDirty: false,
            errors: {},
            data: {},
            originalData: {}
        };

        // Campos del formulario
        this.fields = new Map();
        
        // Callbacks
        this.callbacks = {
            onSubmit: null,
            onValidate: null,
            onChange: null,
            onReset: null
        };

        this.init();
    }

    // ==============================================
    // INICIALIZACIÓN
    // ==============================================

    init() {
        if (!this.form) {
            console.error(`Form with id "${this.formId}" not found`);
            return;
        }

        this.bindEvents();
        this.discoverFields();
    }

    discoverFields() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.name) {
                this.addField(input.name, {
                    element: input,
                    type: this.getInputType(input),
                    required: input.required,
                    validators: this.getValidators(input)
                });
            }
        });
    }

    bindEvents() {
        // Submit del formulario
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Cambios en campos
        this.form.addEventListener('input', this.handleInput.bind(this));
        this.form.addEventListener('change', this.handleChange.bind(this));
        
        // Blur para validación
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', this.handleBlur.bind(this), true);
        }
    }

    // ==============================================
    // CONFIGURACIÓN DE CAMPOS
    // ==============================================

    addField(name, config) {
        const defaultConfig = {
            type: 'text',
            required: false,
            validators: [],
            formatter: null,
            parser: null,
            dependencies: []
        };

        this.fields.set(name, { ...defaultConfig, ...config });
        
        // Inicializar estado del campo
        if (!this.state.errors[name]) {
            this.state.errors[name] = [];
        }
        
        return this;
    }

    setFieldValidators(fieldName, validators) {
        const field = this.fields.get(fieldName);
        if (field) {
            field.validators = validators;
        }
        return this;
    }

    setFieldFormatter(fieldName, formatter) {
        const field = this.fields.get(fieldName);
        if (field) {
            field.formatter = formatter;
        }
        return this;
    }

    // ==============================================
    // CALLBACKS
    // ==============================================

    onSubmit(callback) {
        this.callbacks.onSubmit = callback;
        return this;
    }

    onValidate(callback) {
        this.callbacks.onValidate = callback;
        return this;
    }

    onChange(callback) {
        this.callbacks.onChange = callback;
        return this;
    }

    onReset(callback) {
        this.callbacks.onReset = callback;
        return this;
    }

    // ==============================================
    // EVENTOS
    // ==============================================

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.state.isSubmitting) return;
        
        // Validar formulario
        const isValid = await this.validate();
        
        if (!isValid && this.options.validateOnSubmit) {
            this.showValidationErrors();
            return;
        }

        this.setSubmitting(true);

        try {
            const formData = this.getData();
            
            if (this.callbacks.onSubmit) {
                await this.callbacks.onSubmit(formData, this);
            }

            if (this.options.showSuccessMessage) {
                Utils.showToast('Datos guardados correctamente', 'success');
            }

            if (this.options.resetOnSuccess) {
                this.reset();
            }

            this.state.isDirty = false;

        } catch (error) {
            console.error('Form submission error:', error);
            Utils.showToast(error.message || 'Error al guardar', 'error');
        } finally {
            this.setSubmitting(false);
        }
    }

    handleInput(e) {
        const field = e.target;
        if (!field.name) return;

        this.state.isDirty = true;
        this.updateFieldValue(field.name, field.value);
        
        // Limpiar errores del campo mientras escribe
        this.clearFieldErrors(field.name);

        if (this.callbacks.onChange) {
            this.callbacks.onChange(field.name, field.value, this.getData());
        }
    }

    handleChange(e) {
        const field = e.target;
        if (!field.name) return;

        this.updateFieldValue(field.name, field.value);
        
        // Validar dependencias
        this.validateFieldDependencies(field.name);
    }

    async handleBlur(e) {
        const field = e.target;
        if (!field.name) return;

        // Validar campo individual
        await this.validateField(field.name);
    }

    // ==============================================
    // VALIDACIÓN
    // ==============================================

    async validate() {
        this.clearAllErrors();
        
        let isValid = true;
        
        // Validar cada campo
        for (const [fieldName, fieldConfig] of this.fields) {
            const fieldValid = await this.validateField(fieldName);
            if (!fieldValid) {
                isValid = false;
            }
        }

        // Validación personalizada
        if (this.callbacks.onValidate) {
            try {
                const customValidation = await this.callbacks.onValidate(this.getData(), this);
                if (customValidation && customValidation.errors) {
                    Object.entries(customValidation.errors).forEach(([field, errors]) => {
                        this.addFieldErrors(field, errors);
                    });
                    isValid = false;
                }
            } catch (error) {
                console.error('Custom validation error:', error);
                isValid = false;
            }
        }

        this.state.isValid = isValid;
        return isValid;
    }

    async validateField(fieldName) {
        const field = this.fields.get(fieldName);
        if (!field) return true;

        const value = this.getFieldValue(fieldName);
        const errors = [];

        // Validación requerido
        if (field.required && !this.hasValue(value)) {
            errors.push('Este campo es requerido');
        }

        // Validadores personalizados
        if (field.validators && field.validators.length > 0) {
            for (const validator of field.validators) {
                try {
                    const result = await validator(value, this.getData(), field);
                    if (result !== true) {
                        errors.push(typeof result === 'string' ? result : 'Valor inválido');
                    }
                } catch (error) {
                    errors.push('Error de validación');
                }
            }
        }

        // Actualizar errores
        this.state.errors[fieldName] = errors;
        this.showFieldErrors(fieldName);

        return errors.length === 0;
    }

    validateFieldDependencies(fieldName) {
        // Encontrar campos que dependen de este
        this.fields.forEach((fieldConfig, name) => {
            if (fieldConfig.dependencies && fieldConfig.dependencies.includes(fieldName)) {
                this.validateField(name);
            }
        });
    }

    // ==============================================
    // MANEJO DE DATOS
    // ==============================================

    setData(data) {
        this.state.data = { ...data };
        this.state.originalData = { ...data };
        
        // Llenar formulario
        Object.entries(data).forEach(([key, value]) => {
            this.setFieldValue(key, value);
        });

        this.state.isDirty = false;
        return this;
    }

    getData() {
        const data = {};
        
        this.fields.forEach((fieldConfig, fieldName) => {
            const value = this.getFieldValue(fieldName);
            
            // Aplicar parser si existe
            if (fieldConfig.parser) {
                data[fieldName] = fieldConfig.parser(value);
            } else {
                data[fieldName] = this.parseValue(value, fieldConfig.type);
            }
        });

        return data;
    }

    getFieldValue(fieldName) {
        const field = this.fields.get(fieldName);
        if (!field || !field.element) return null;

        const element = field.element;
        
        switch (field.type) {
            case 'checkbox':
                return element.checked;
            case 'radio':
                const radioGroup = this.form.querySelectorAll(`input[name="${fieldName}"]`);
                const checked = Array.from(radioGroup).find(r => r.checked);
                return checked ? checked.value : null;
            case 'select-multiple':
                return Array.from(element.selectedOptions).map(opt => opt.value);
            default:
                return element.value;
        }
    }

    setFieldValue(fieldName, value) {
        const field = this.fields.get(fieldName);
        if (!field || !field.element) return;

        const element = field.element;
        
        // Aplicar formatter si existe
        let displayValue = value;
        if (field.formatter) {
            displayValue = field.formatter(value);
        }

        switch (field.type) {
            case 'checkbox':
                element.checked = Boolean(value);
                break;
            case 'radio':
                const radioGroup = this.form.querySelectorAll(`input[name="${fieldName}"]`);
                radioGroup.forEach(radio => {
                    radio.checked = radio.value === value;
                });
                break;
            case 'select-multiple':
                const values = Array.isArray(value) ? value : [value];
                Array.from(element.options).forEach(option => {
                    option.selected = values.includes(option.value);
                });
                break;
            default:
                element.value = displayValue || '';
        }

        this.updateFieldValue(fieldName, value);
    }

    updateFieldValue(fieldName, value) {
        this.state.data[fieldName] = value;
    }

    // ==============================================
    // MANEJO DE ERRORES
    // ==============================================

    addFieldErrors(fieldName, errors) {
        if (!this.state.errors[fieldName]) {
            this.state.errors[fieldName] = [];
        }
        
        const errorArray = Array.isArray(errors) ? errors : [errors];
        this.state.errors[fieldName].push(...errorArray);
        this.showFieldErrors(fieldName);
    }

    clearFieldErrors(fieldName) {
        this.state.errors[fieldName] = [];
        this.hideFieldErrors(fieldName);
    }

    clearAllErrors() {
        Object.keys(this.state.errors).forEach(fieldName => {
            this.clearFieldErrors(fieldName);
        });
    }

    showFieldErrors(fieldName) {
        const errors = this.state.errors[fieldName] || [];
        const errorContainer = this.form.querySelector(`#${fieldName}-error, [data-error="${fieldName}"]`);
        const fieldElement = this.form.querySelector(`[name="${fieldName}"]`);

        if (errorContainer) {
            if (errors.length > 0) {
                errorContainer.textContent = errors[0]; // Mostrar solo el primer error
                errorContainer.classList.remove('hidden');
            } else {
                errorContainer.classList.add('hidden');
            }
        }

        // Agregar clase de error al campo
        if (fieldElement) {
            if (errors.length > 0) {
                fieldElement.classList.add('border-red-500', 'focus:ring-red-500');
                fieldElement.classList.remove('border-gray-300');
            } else {
                fieldElement.classList.remove('border-red-500', 'focus:ring-red-500');
                fieldElement.classList.add('border-gray-300');
            }
        }
    }

    hideFieldErrors(fieldName) {
        const errorContainer = this.form.querySelector(`#${fieldName}-error, [data-error="${fieldName}"]`);
        const fieldElement = this.form.querySelector(`[name="${fieldName}"]`);

        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }

        if (fieldElement) {
            fieldElement.classList.remove('border-red-500', 'focus:ring-red-500');
            fieldElement.classList.add('border-gray-300');
        }
    }

    showValidationErrors() {
        Object.keys(this.state.errors).forEach(fieldName => {
            this.showFieldErrors(fieldName);
        });

        // Scroll al primer campo con error
        const firstErrorField = this.form.querySelector('.border-red-500');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
    }

    // ==============================================
    // UTILIDADES
    // ==============================================

    getInputType(element) {
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'input') {
            return element.type;
        } else if (tagName === 'select') {
            return element.multiple ? 'select-multiple' : 'select';
        } else if (tagName === 'textarea') {
            return 'textarea';
        }
        
        return 'text';
    }

    getValidators(element) {
        const validators = [];
        
        // Email validation
        if (element.type === 'email') {
            validators.push((value) => {
                if (value && !Utils.validateEmail(value)) {
                    return 'Email inválido';
                }
                return true;
            });
        }
        
        // Number validation
        if (element.type === 'number') {
            validators.push((value) => {
                if (value && isNaN(value)) {
                    return 'Debe ser un número válido';
                }
                return true;
            });
        }
        
        // Min/Max length
        if (element.minLength || element.maxLength) {
            validators.push((value) => {
                if (value) {
                    if (element.minLength && value.length < element.minLength) {
                        return `Mínimo ${element.minLength} caracteres`;
                    }
                    if (element.maxLength && value.length > element.maxLength) {
                        return `Máximo ${element.maxLength} caracteres`;
                    }
                }
                return true;
            });
        }
        
        return validators;
    }

    parseValue(value, type) {
        switch (type) {
            case 'number':
                return value ? parseFloat(value) : null;
            case 'checkbox':
                return Boolean(value);
            case 'date':
                return value ? new Date(value) : null;
            default:
                return value || null;
        }
    }

    hasValue(value) {
        return value !== null && value !== undefined && value !== '';
    }

    setSubmitting(isSubmitting) {
        this.state.isSubmitting = isSubmitting;
        
        // Deshabilitar/habilitar botón submit
        const submitButton = this.form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isSubmitting;
            
            if (isSubmitting) {
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        // Deshabilitar/habilitar campos
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.disabled = isSubmitting;
        });
    }

    reset() {
        this.form.reset();
        this.clearAllErrors();
        this.state.data = {};
        this.state.isDirty = false;
        
        if (this.callbacks.onReset) {
            this.callbacks.onReset();
        }
    }

    isDirty() {
        return this.state.isDirty;
    }

    isValid() {
        return this.state.isValid;
    }

    isSubmitting() {
        return this.state.isSubmitting;
    }
}

// Validadores comunes
const FormValidators = {
    required: (value) => {
        return value !== null && value !== undefined && value !== '' ? true : 'Este campo es requerido';
    },

    email: (value) => {
        if (!value) return true;
        return Utils.validateEmail(value) ? true : 'Email inválido';
    },

    minLength: (min) => (value) => {
        if (!value) return true;
        return value.length >= min ? true : `Mínimo ${min} caracteres`;
    },

    maxLength: (max) => (value) => {
        if (!value) return true;
        return value.length <= max ? true : `Máximo ${max} caracteres`;
    },

    min: (min) => (value) => {
        if (!value) return true;
        return parseFloat(value) >= min ? true : `Valor mínimo: ${min}`;
    },

    max: (max) => (value) => {
        if (!value) return true;
        return parseFloat(value) <= max ? true : `Valor máximo: ${max}`;
    },

    pattern: (pattern, message = 'Formato inválido') => (value) => {
        if (!value) return true;
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return regex.test(value) ? true : message;
    }
};

// Exportar para uso global
window.FormManager = FormManager;
window.FormValidators = FormValidators;