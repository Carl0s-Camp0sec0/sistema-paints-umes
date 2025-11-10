// ==============================================
// MÓDULO DE PRODUCTOS - Sistema Paints
// Gestión completa de productos con CRUD
// ==============================================

const ProductsModule = {
    
    // ==============================================
    // INICIALIZACIÓN
    // ==============================================
    
    init() {
        this.user = authManager.getUser();
        this.checkPermissions();
        
        this.table = null;
        this.productForm = null;
        this.categories = [];
        this.units = [];
        this.colors = [];
        
        this.bindEvents();
        this.loadInitialData();
    },

    checkPermissions() {
        // Verificar permisos según rol
        const role = this.user?.perfil?.nombre_perfil;
        
        if (!authManager.hasAnyRole(['Gerente', 'Digitador'])) {
            Utils.showToast('No tiene permisos para gestionar productos', 'error');
            setTimeout(() => {
                window.location.href = '../dashboard.html';
            }, 2000);
            return false;
        }
        
        // Ajustar interfaz según permisos
        if (role === 'Digitador') {
            // Los digitadores no pueden eliminar productos
            this.canDelete = false;
        } else {
            this.canDelete = true;
        }
        
        return true;
    },

    // ==============================================
    // CARGA DE DATOS INICIALES
    // ==============================================

    async loadInitialData() {
        try {
            this.showLoading(true);
            
            // Cargar datos de apoyo en paralelo
            await Promise.all([
                this.loadCategories(),
                this.loadUnits(),
                this.loadColors()
            ]);
            
            // Inicializar tabla
            this.initializeTable();
            
            // Cargar productos
            await this.loadProducts();
            
            // Actualizar información del usuario
            this.updateUserInfo();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            Utils.showToast('Error al cargar datos iniciales', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    async loadCategories() {
        try {
            const response = await apiClient.categories.getAll();
            this.categories = response.data || [];
            this.populateCategoryFilter();
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [];
        }
    },

    async loadUnits() {
        try {
            // Asumiendo que existe un endpoint para unidades
            const response = await apiClient.get('/api/units');
            this.units = response.data || [];
        } catch (error) {
            console.error('Error loading units:', error);
            this.units = [];
        }
    },

    async loadColors() {
        try {
            // Asumiendo que existe un endpoint para colores
            const response = await apiClient.get('/api/colors');
            this.colors = response.data || [];
        } catch (error) {
            console.error('Error loading colors:', error);
            this.colors = [];
        }
    },

    async loadProducts(filters = {}) {
        try {
            this.showLoading(true);
            
            const queryParams = {
                page: filters.page || 1,
                limit: filters.limit || 10,
                search: filters.search || '',
                category: filters.category || '',
                status: filters.status || ''
            };

            const response = await apiClient.products.getAll(queryParams);
            
            // Transformar datos para la tabla
            const products = this.transformProductsData(response.data?.productos || []);
            
            // Actualizar tabla
            if (this.table) {
                this.table.setData(products);
            }
            
        } catch (error) {
            console.error('Error loading products:', error);
            Utils.showToast('Error al cargar productos', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    transformProductsData(products) {
        return products.map(product => ({
            id: product.id_producto,
            codigo: product.codigo,
            nombre: product.nombre,
            descripcion: product.descripcion,
            categoria: product.categoria?.nombre_categoria || 'Sin categoría',
            precio: product.precio_venta,
            stock: product.stock_actual,
            unidad: product.unidad_medida?.nombre_unidad || 'Unidad',
            marca: product.marca,
            estado: product.estado,
            created_at: product.createdAt
        }));
    },

    // ==============================================
    // INICIALIZACIÓN DE COMPONENTES
    // ==============================================

    initializeTable() {
        this.table = new TableManager('productsTable', {
            pageSize: 10,
            selectable: true,
            sortable: true
        });

        // Configurar columnas
        this.table.setColumns([
            {
                key: 'codigo',
                title: 'Código',
                sortable: true,
                render: (value, row) => `
                    <div>
                        <div class="font-medium text-gray-900">${value}</div>
                        <div class="text-sm text-gray-500">${row.nombre}</div>
                    </div>
                `
            },
            {
                key: 'categoria',
                title: 'Categoría',
                type: 'text'
            },
            {
                key: 'precio',
                title: 'Precio',
                type: 'currency',
                align: 'right'
            },
            {
                key: 'stock',
                title: 'Stock',
                align: 'center',
                render: (value, row) => {
                    const isLow = value <= 10;
                    const colorClass = isLow ? 'text-red-600' : 'text-gray-900';
                    const icon = isLow ? 'fas fa-exclamation-triangle' : 'fas fa-box';
                    
                    return `
                        <div class="flex items-center justify-center">
                            <i class="${icon} ${colorClass} mr-2"></i>
                            <span class="${colorClass} font-medium">${value} ${row.unidad}</span>
                        </div>
                    `;
                }
            },
            {
                key: 'estado',
                title: 'Estado',
                type: 'badge',
                align: 'center'
            }
        ]);

        // Configurar callbacks
        this.table
            .onEdit(this.handleEdit.bind(this))
            .onRowClick(this.handleRowClick.bind(this));

        // Solo agregar delete si tiene permisos
        if (this.canDelete) {
            this.table.onDelete(this.handleDelete.bind(this));
        }
    },

    // ==============================================
    // EVENTOS
    // ==============================================

    bindEvents() {
        // Botón crear producto
        const createBtn = document.getElementById('createProductBtn');
        const createFirstBtn = document.getElementById('createFirstProductBtn');
        
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showProductModal());
        }
        
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => this.showProductModal());
        }

        // Filtros
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', this.applyFilters.bind(this));
        }
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.clearFilters.bind(this));
        }

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = Utils.debounce(this.handleSearch.bind(this), 300);
            searchInput.addEventListener('input', debouncedSearch);
        }

        // Cambio de página
        const pageSizeSelect = document.getElementById('pageSizeSelect');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.table.changePageSize(parseInt(e.target.value));
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
    },

    // ==============================================
    // MANEJO DE EVENTOS
    // ==============================================

    handleSearch(e) {
        const query = e.target.value.trim();
        if (this.table) {
            this.table.search(query);
        }
    },

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        
        const filters = {};
        
        if (categoryFilter) filters.categoria = categoryFilter;
        if (statusFilter) filters.estado = statusFilter;
        
        if (this.table) {
            this.table.filter(filters);
        }
    },

    clearFilters() {
        // Limpiar campos de filtro
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');
        
        if (categoryFilter) categoryFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        if (searchInput) searchInput.value = '';
        
        // Limpiar filtros en tabla
        if (this.table) {
            this.table.filter({});
            this.table.search('');
        }
    },

    handleRowClick(product) {
        this.showProductModal(product);
    },

    handleEdit(product) {
        this.showProductModal(product);
    },

    async handleDelete(product) {
        const confirmed = await modalManager.showConfirm({
            title: 'Eliminar Producto',
            message: `¿Está seguro que desea eliminar el producto "${product.nombre}"?`,
            type: 'danger',
            confirmText: 'Eliminar'
        });

        if (!confirmed) return;

        try {
            modalManager.showLoading('Eliminando producto...');
            
            await apiClient.products.delete(product.id);
            
            Utils.showToast('Producto eliminado correctamente', 'success');
            
            // Recargar productos
            await this.loadProducts();
            
        } catch (error) {
            console.error('Error deleting product:', error);
            Utils.showToast(error.message || 'Error al eliminar producto', 'error');
        } finally {
            modalManager.hideLoading();
        }
    },

    async handleLogout() {
        const confirmed = await modalManager.showConfirm({
            title: 'Cerrar Sesión',
            message: '¿Está seguro que desea cerrar su sesión?',
            confirmText: 'Cerrar Sesión'
        });

        if (confirmed) {
            await authManager.logout();
        }
    },

    // ==============================================
    // MODALES Y FORMULARIOS
    // ==============================================

    showProductModal(product = null) {
        const isEdit = !!product;
        const title = isEdit ? 'Editar Producto' : 'Nuevo Producto';
        
        const formContent = this.generateProductForm(product);
        
        modalManager.showForm({
            id: 'product-modal',
            title: title,
            content: formContent,
            size: 'lg',
            formId: 'product-form',
            submitText: isEdit ? 'Actualizar' : 'Crear',
            onSubmit: this.handleProductSubmit.bind(this)
        });
    },

    generateProductForm(product = null) {
        return `
            <form id="product-form" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Código -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Código <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="codigo" 
                            required 
                            maxlength="20"
                            value="${product?.codigo || ''}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: PAINT-001"
                        >
                        <div id="codigo-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Nombre -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Nombre <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="nombre" 
                            required 
                            maxlength="150"
                            value="${product?.nombre || ''}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre del producto"
                        >
                        <div id="nombre-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Categoría -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Categoría <span class="text-red-500">*</span>
                        </label>
                        <select 
                            name="id_categoria" 
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Seleccione una categoría</option>
                            ${this.categories.map(cat => `
                                <option value="${cat.id_categoria}" ${product?.id_categoria == cat.id_categoria ? 'selected' : ''}>
                                    ${cat.nombre_categoria}
                                </option>
                            `).join('')}
                        </select>
                        <div id="id_categoria-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Precio -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Precio de Venta <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Q.</span>
                            <input 
                                type="number" 
                                name="precio_venta" 
                                required 
                                min="0" 
                                step="0.01"
                                value="${product?.precio || ''}"
                                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                            >
                        </div>
                        <div id="precio_venta-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Stock -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Stock Actual <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="number" 
                            name="stock_actual" 
                            required 
                            min="0"
                            value="${product?.stock || ''}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                        >
                        <div id="stock_actual-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Unidad de medida -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Unidad de Medida <span class="text-red-500">*</span>
                        </label>
                        <select 
                            name="id_unidad_medida" 
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Seleccione una unidad</option>
                            ${this.units.map(unit => `
                                <option value="${unit.id_unidad}" ${product?.id_unidad_medida == unit.id_unidad ? 'selected' : ''}>
                                    ${unit.nombre_unidad} (${unit.simbolo})
                                </option>
                            `).join('')}
                        </select>
                        <div id="id_unidad_medida-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    </div>

                    <!-- Marca -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                        <input 
                            type="text" 
                            name="marca" 
                            maxlength="50"
                            value="${product?.marca || ''}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Marca del producto"
                        >
                    </div>

                    <!-- Estado -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select 
                            name="estado"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Activo" ${!product || product.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                            <option value="Inactivo" ${product?.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                            <option value="Descontinuado" ${product?.estado === 'Descontinuado' ? 'selected' : ''}>Descontinuado</option>
                        </select>
                    </div>
                </div>

                <!-- Descripción -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                        name="descripcion" 
                        required 
                        rows="3"
                        maxlength="500"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Descripción detallada del producto"
                    >${product?.descripcion || ''}</textarea>
                    <div id="descripcion-error" class="text-red-500 text-xs mt-1 hidden"></div>
                    <div class="text-xs text-gray-500 mt-1">
                        <span id="descripcion-count">0</span>/500 caracteres
                    </div>
                </div>

                ${product ? `<input type="hidden" name="id_producto" value="${product.id}">` : ''}
            </form>
        `;
    },

    async handleProductSubmit(formData) {
        const data = Object.fromEntries(formData);
        const isEdit = !!data.id_producto;

        try {
            modalManager.showLoading(isEdit ? 'Actualizando producto...' : 'Creando producto...');

            if (isEdit) {
                await apiClient.products.update(data.id_producto, data);
                Utils.showToast('Producto actualizado correctamente', 'success');
            } else {
                await apiClient.products.create(data);
                Utils.showToast('Producto creado correctamente', 'success');
            }

            modalManager.closeModal('product-modal');
            await this.loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            Utils.showToast(error.message || 'Error al guardar producto', 'error');
            throw error; // Para que el formulario maneje el error
        } finally {
            modalManager.hideLoading();
        }
    },

    // ==============================================
    // UTILIDADES
    // ==============================================

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter || !this.categories.length) return;

        const currentValue = categoryFilter.value;
        
        // Limpiar opciones existentes (excepto la primera)
        while (categoryFilter.children.length > 1) {
            categoryFilter.removeChild(categoryFilter.lastChild);
        }

        // Agregar categorías
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.nombre_categoria;
            option.textContent = category.nombre_categoria;
            if (currentValue === category.nombre_categoria) {
                option.selected = true;
            }
            categoryFilter.appendChild(option);
        });
    },

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.user) {
            userInfo.textContent = `${this.user.nombre_completo} (${this.user.perfil?.nombre_perfil})`;
        }
    },

    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const tableContainer = document.getElementById('productsTableContainer');
        
        if (show) {
            if (loadingState) loadingState.classList.remove('hidden');
            if (tableContainer) tableContainer.classList.add('hidden');
        } else {
            if (loadingState) loadingState.classList.add('hidden');
            if (tableContainer) tableContainer.classList.remove('hidden');
        }
    }
};