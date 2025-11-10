// ==============================================
// COMPONENTES DE TABLAS - Sistema Paints
// Tablas reutilizables con paginación, filtros y sorting
// ==============================================

class TableManager {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // Configuración por defecto
        this.options = {
            pageSize: 10,
            sortable: true,
            filterable: true,
            selectable: true,
            searchable: true,
            ...options
        };

        // Estado de la tabla
        this.state = {
            data: [],
            filteredData: [],
            currentPage: 1,
            totalPages: 1,
            sortColumn: null,
            sortDirection: 'asc',
            selectedRows: new Set(),
            filters: {}
        };

        // Callbacks
        this.callbacks = {
            onRowClick: null,
            onRowSelect: null,
            onEdit: null,
            onDelete: null,
            onAction: null
        };
    }

    // ==============================================
    // CONFIGURACIÓN Y INICIALIZACIÓN
    // ==============================================

    /**
     * Configurar columnas de la tabla
     */
    setColumns(columns) {
        this.columns = columns.map(col => ({
            key: col.key,
            title: col.title,
            sortable: col.sortable !== false,
            filterable: col.filterable !== false,
            render: col.render || null,
            width: col.width || null,
            align: col.align || 'left',
            type: col.type || 'text' // text, number, date, boolean, custom
        }));
        return this;
    }

    /**
     * Configurar datos
     */
    setData(data) {
        this.state.data = Array.isArray(data) ? data : [];
        this.state.filteredData = [...this.state.data];
        this.updatePagination();
        this.render();
        return this;
    }

    /**
     * Configurar callbacks
     */
    onRowClick(callback) {
        this.callbacks.onRowClick = callback;
        return this;
    }

    onRowSelect(callback) {
        this.callbacks.onRowSelect = callback;
        return this;
    }

    onEdit(callback) {
        this.callbacks.onEdit = callback;
        return this;
    }

    onDelete(callback) {
        this.callbacks.onDelete = callback;
        return this;
    }

    onAction(callback) {
        this.callbacks.onAction = callback;
        return this;
    }

    // ==============================================
    // RENDERIZADO
    // ==============================================

    render() {
        if (!this.container) return;

        const startIndex = (this.state.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        const pageData = this.state.filteredData.slice(startIndex, endIndex);

        // Renderizar tabla
        this.renderTable(pageData);
        
        // Renderizar paginación
        this.renderPagination();
        
        // Actualizar contadores
        this.updateCounters();
    }

    renderTable(data) {
        const tableBody = this.container.querySelector('tbody');
        if (!tableBody) return;

        if (data.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();

        tableBody.innerHTML = data.map((row, index) => {
            const rowId = row.id || index;
            const isSelected = this.state.selectedRows.has(rowId);

            return `
                <tr class="hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}" data-row-id="${rowId}">
                    ${this.options.selectable ? `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" class="row-checkbox rounded border-gray-300" 
                                   ${isSelected ? 'checked' : ''} data-row-id="${rowId}">
                        </td>
                    ` : ''}
                    ${this.columns.map(column => this.renderCell(row, column)).join('')}
                    ${this.hasActions() ? this.renderActionsCell(row) : ''}
                </tr>
            `;
        }).join('');

        // Bind events
        this.bindTableEvents();
    }

    renderCell(row, column) {
        let value = this.getCellValue(row, column.key);
        let displayValue = value;

        // Aplicar render personalizado
        if (column.render) {
            displayValue = column.render(value, row);
        } else {
            // Formatear según tipo
            switch (column.type) {
                case 'currency':
                    displayValue = Utils.formatCurrency(value);
                    break;
                case 'number':
                    displayValue = Utils.formatNumber(value);
                    break;
                case 'date':
                    displayValue = Utils.formatDate(value);
                    break;
                case 'boolean':
                    displayValue = value ? 
                        '<i class="fas fa-check text-green-500"></i>' : 
                        '<i class="fas fa-times text-red-500"></i>';
                    break;
                case 'badge':
                    displayValue = `<span class="badge badge-${this.getBadgeColor(value)}">${value}</span>`;
                    break;
            }
        }

        const alignClass = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right'
        }[column.align] || 'text-left';

        return `
            <td class="px-6 py-4 whitespace-nowrap ${alignClass}">
                <div class="text-sm text-gray-900">${displayValue || '-'}</div>
            </td>
        `;
    }

    renderActionsCell(row) {
        const actions = [];
        
        if (this.callbacks.onEdit) {
            actions.push(`
                <button class="text-blue-600 hover:text-blue-900 mr-3" 
                        onclick="event.stopPropagation()" 
                        data-action="edit" 
                        data-row-id="${row.id}">
                    <i class="fas fa-edit"></i>
                </button>
            `);
        }

        if (this.callbacks.onDelete) {
            actions.push(`
                <button class="text-red-600 hover:text-red-900" 
                        onclick="event.stopPropagation()" 
                        data-action="delete" 
                        data-row-id="${row.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `);
        }

        return `
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${actions.join('')}
            </td>
        `;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('paginationButtons');
        if (!paginationContainer) return;

        const { currentPage, totalPages } = this.state;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        const buttons = [];

        // Botón anterior
        buttons.push(`
            <button class="px-3 py-1 text-sm border border-gray-300 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `);

        // Páginas
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            buttons.push(`<button class="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" data-page="1">1</button>`);
            if (startPage > 2) {
                buttons.push(`<span class="px-3 py-1 text-sm text-gray-500">...</span>`);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            buttons.push(`
                <button class="px-3 py-1 text-sm border rounded-md ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}" 
                        data-page="${i}">
                    ${i}
                </button>
            `);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(`<span class="px-3 py-1 text-sm text-gray-500">...</span>`);
            }
            buttons.push(`<button class="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" data-page="${totalPages}">${totalPages}</button>`);
        }

        // Botón siguiente
        buttons.push(`
            <button class="px-3 py-1 text-sm border border-gray-300 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `);

        paginationContainer.innerHTML = buttons.join('');
        this.bindPaginationEvents();
    }

    // ==============================================
    // EVENTOS
    // ==============================================

    bindTableEvents() {
        const tableBody = this.container.querySelector('tbody');
        if (!tableBody) return;

        // Click en fila
        tableBody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;

            const rowId = row.dataset.rowId;
            
            // Si es checkbox, manejar selección
            if (e.target.classList.contains('row-checkbox')) {
                this.toggleRowSelection(rowId);
                return;
            }

            // Si es botón de acción
            if (e.target.closest('[data-action]')) {
                const action = e.target.closest('[data-action]').dataset.action;
                const rowData = this.getRowData(rowId);
                
                if (action === 'edit' && this.callbacks.onEdit) {
                    this.callbacks.onEdit(rowData);
                } else if (action === 'delete' && this.callbacks.onDelete) {
                    this.callbacks.onDelete(rowData);
                } else if (this.callbacks.onAction) {
                    this.callbacks.onAction(action, rowData);
                }
                return;
            }

            // Click en fila
            if (this.callbacks.onRowClick) {
                const rowData = this.getRowData(rowId);
                this.callbacks.onRowClick(rowData);
            }
        });

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleAllRows(e.target.checked);
            });
        }
    }

    bindPaginationEvents() {
        const paginationContainer = document.getElementById('paginationButtons');
        if (!paginationContainer) return;

        paginationContainer.addEventListener('click', (e) => {
            const button = e.target.closest('[data-page]');
            if (!button || button.disabled) return;

            const page = parseInt(button.dataset.page);
            this.goToPage(page);
        });
    }

    // ==============================================
    // FUNCIONALIDAD
    // ==============================================

    search(query) {
        if (!query) {
            this.state.filteredData = [...this.state.data];
        } else {
            const searchColumns = this.columns.filter(col => col.filterable !== false);
            this.state.filteredData = this.state.data.filter(row => {
                return searchColumns.some(column => {
                    const value = this.getCellValue(row, column.key);
                    return value && value.toString().toLowerCase().includes(query.toLowerCase());
                });
            });
        }
        
        this.updatePagination();
        this.render();
    }

    filter(filters) {
        this.state.filters = filters;
        
        this.state.filteredData = this.state.data.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                const rowValue = this.getCellValue(row, key);
                return rowValue === value;
            });
        });
        
        this.updatePagination();
        this.render();
    }

    sort(column, direction = null) {
        if (!direction) {
            // Toggle sort direction
            if (this.state.sortColumn === column) {
                direction = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                direction = 'asc';
            }
        }

        this.state.sortColumn = column;
        this.state.sortDirection = direction;

        this.state.filteredData.sort((a, b) => {
            const aValue = this.getCellValue(a, column);
            const bValue = this.getCellValue(b, column);

            let result = 0;
            if (aValue < bValue) result = -1;
            else if (aValue > bValue) result = 1;

            return direction === 'desc' ? -result : result;
        });

        this.render();
    }

    goToPage(page) {
        if (page < 1 || page > this.state.totalPages) return;
        
        this.state.currentPage = page;
        this.render();
    }

    changePageSize(size) {
        this.options.pageSize = size;
        this.state.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    toggleRowSelection(rowId) {
        if (this.state.selectedRows.has(rowId)) {
            this.state.selectedRows.delete(rowId);
        } else {
            this.state.selectedRows.add(rowId);
        }

        if (this.callbacks.onRowSelect) {
            this.callbacks.onRowSelect(Array.from(this.state.selectedRows));
        }

        this.render();
    }

    toggleAllRows(select) {
        const currentPageData = this.getCurrentPageData();
        
        if (select) {
            currentPageData.forEach(row => {
                this.state.selectedRows.add(row.id);
            });
        } else {
            currentPageData.forEach(row => {
                this.state.selectedRows.delete(row.id);
            });
        }

        if (this.callbacks.onRowSelect) {
            this.callbacks.onRowSelect(Array.from(this.state.selectedRows));
        }

        this.render();
    }

    clearSelection() {
        this.state.selectedRows.clear();
        this.render();
    }

    // ==============================================
    // UTILIDADES
    // ==============================================

    getCellValue(row, key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], row);
    }

    getRowData(rowId) {
        return this.state.data.find(row => row.id == rowId);
    }

    getCurrentPageData() {
        const startIndex = (this.state.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        return this.state.filteredData.slice(startIndex, endIndex);
    }

    updatePagination() {
        this.state.totalPages = Math.ceil(this.state.filteredData.length / this.options.pageSize);
        if (this.state.currentPage > this.state.totalPages) {
            this.state.currentPage = Math.max(1, this.state.totalPages);
        }
    }

    updateCounters() {
        // Actualizar contador de productos
        const countersElements = document.querySelectorAll('#productsCount, [data-counter="products"]');
        countersElements.forEach(el => {
            el.textContent = `${this.state.filteredData.length} productos`;
        });

        // Actualizar info de paginación
        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Página ${this.state.currentPage} de ${this.state.totalPages}`;
        }
    }

    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const tableContainer = document.getElementById('productsTableContainer');
        
        if (emptyState) emptyState.classList.remove('hidden');
        if (tableContainer) tableContainer.classList.add('hidden');
    }

    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const tableContainer = document.getElementById('productsTableContainer');
        
        if (emptyState) emptyState.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.classList.remove('hidden');
        this.hideEmptyState();
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.classList.add('hidden');
    }

    hasActions() {
        return this.callbacks.onEdit || this.callbacks.onDelete || this.callbacks.onAction;
    }

    getBadgeColor(value) {
        const colorMap = {
            'Activo': 'success',
            'Inactivo': 'warning',
            'Descontinuado': 'error'
        };
        return colorMap[value] || 'secondary';
    }

    // Métodos públicos para control externo
    refresh() {
        this.render();
    }

    getSelectedRows() {
        return Array.from(this.state.selectedRows);
    }

    getState() {
        return { ...this.state };
    }
}

// Exportar para uso global
window.TableManager = TableManager;