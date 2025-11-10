// ==============================================
// MÓDULO DASHBOARD - Sistema Paints
// Lógica principal del panel de control
// ==============================================

const DashboardModule = {
    
    // ==============================================
    // INICIALIZACIÓN
    // ==============================================
    
    init() {
        this.user = null;
        this.stats = {};
        
        this.checkAuthentication();
        this.bindEvents();
        this.loadUserData();
        this.loadDashboardData();
        this.setupMobileMenu();
    },

    // ==============================================
    // AUTENTICACIÓN
    // ==============================================

    checkAuthentication() {
        if (!authManager.protectPage()) {
            return;
        }
        
        this.user = authManager.getUser();
        if (!this.user) {
            authManager.redirectToLogin();
            return;
        }
    },

    loadUserData() {
        // Actualizar información del usuario en la interfaz
        this.updateUserInterface();
        
        // Generar menú según el rol
        this.generateSidebar();
        
        // Configurar mensaje de bienvenida
        this.updateWelcomeMessage();
    },

    // ==============================================
    // INTERFAZ DE USUARIO
    // ==============================================

    updateUserInterface() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userInitials = document.getElementById('userInitials');

        if (userName) userName.textContent = this.user.nombre_completo;
        if (userRole) userRole.textContent = this.user.perfil?.nombre_perfil || 'Usuario';
        if (userInitials) userInitials.textContent = Utils.getInitials(this.user.nombre_completo);
    },

    updateWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        const welcomeSubtext = document.getElementById('welcomeSubtext');
        
        if (welcomeMessage) {
            const hora = new Date().getHours();
            let saludo = 'Buenos días';
            
            if (hora >= 12 && hora < 18) saludo = 'Buenas tardes';
            else if (hora >= 18) saludo = 'Buenas noches';
            
            welcomeMessage.textContent = `${saludo}, ${this.user.nombre_completo.split(' ')[0]}`;
        }
        
        if (welcomeSubtext) {
            const role = this.user.perfil?.nombre_perfil;
            const store = this.user.sucursal?.nombre;
            welcomeSubtext.textContent = `${role}${store ? ' - ' + store : ''}`;
        }
    },

    // ==============================================
    // NAVEGACIÓN Y MENÚ
    // ==============================================

    generateSidebar() {
        const sidebarMenu = document.getElementById('sidebarMenu');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!sidebarMenu) return;

        const menuItems = this.getMenuItems();
        const menuHTML = this.generateMenuHTML(menuItems);
        
        sidebarMenu.innerHTML = menuHTML;
        if (mobileMenu) mobileMenu.innerHTML = menuHTML;
    },

    getMenuItems() {
        const role = this.user.perfil?.nombre_perfil;
        
        const baseItems = [
            {
                title: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                href: './dashboard.html',
                active: true
            }
        ];

        // Elementos según rol
        const roleItems = {
            'Gerente': [
                {
                    title: 'Gestión',
                    icon: 'fas fa-cogs',
                    children: [
                        { title: 'Usuarios', href: './management/users.html', icon: 'fas fa-users' },
                        { title: 'Productos', href: './management/products.html', icon: 'fas fa-box' },
                        { title: 'Sucursales', href: './management/stores.html', icon: 'fas fa-store' },
                        { title: 'Categorías', href: './management/categories.html', icon: 'fas fa-tags' },
                        { title: 'Clientes', href: './management/customers.html', icon: 'fas fa-address-book' }
                    ]
                },
                {
                    title: 'Ventas',
                    icon: 'fas fa-shopping-cart',
                    children: [
                        { title: 'Cotizaciones', href: './sales/quotes.html', icon: 'fas fa-file-invoice' },
                        { title: 'Facturación', href: './sales/invoicing.html', icon: 'fas fa-receipt' },
                        { title: 'Lista Facturas', href: './sales/invoice-list.html', icon: 'fas fa-list' },
                        { title: 'Anular Facturas', href: './sales/cancel-invoice.html', icon: 'fas fa-ban' }
                    ]
                },
                {
                    title: 'Reportes',
                    icon: 'fas fa-chart-bar',
                    children: [
                        { title: 'Panel Reportes', href: './reports/reports.html', icon: 'fas fa-chart-line' },
                        { title: 'Ventas', href: './reports/sales-report.html', icon: 'fas fa-money-bill-wave' },
                        { title: 'Productos', href: './reports/products-report.html', icon: 'fas fa-boxes' },
                        { title: 'Inventario', href: './reports/inventory-report.html', icon: 'fas fa-warehouse' }
                    ]
                },
                {
                    title: 'Sistema',
                    icon: 'fas fa-server',
                    children: [
                        { title: 'Backup', href: './system/backup.html', icon: 'fas fa-database' },
                        { title: 'Logs', href: './system/logs.html', icon: 'fas fa-file-alt' },
                        { title: 'Configuración', href: './system/settings.html', icon: 'fas fa-cog' }
                    ]
                }
            ],
            'Digitador': [
                {
                    title: 'Gestión',
                    icon: 'fas fa-edit',
                    children: [
                        { title: 'Productos', href: './management/products.html', icon: 'fas fa-box' },
                        { title: 'Clientes', href: './management/customers.html', icon: 'fas fa-address-book' }
                    ]
                },
                {
                    title: 'Ventas',
                    icon: 'fas fa-shopping-cart',
                    children: [
                        { title: 'Cotizaciones', href: './sales/quotes.html', icon: 'fas fa-file-invoice' }
                    ]
                }
            ],
            'Cajero': [
                {
                    title: 'Ventas',
                    icon: 'fas fa-cash-register',
                    children: [
                        { title: 'Facturación', href: './sales/invoicing.html', icon: 'fas fa-receipt' },
                        { title: 'Lista Facturas', href: './sales/invoice-list.html', icon: 'fas fa-list' }
                    ]
                }
            ]
        };

        return [...baseItems, ...(roleItems[role] || [])];
    },

    generateMenuHTML(items) {
        return items.map(item => {
            if (item.children) {
                return `
                    <div class="space-y-1">
                        <button class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 group" data-toggle="submenu" data-target="submenu-${item.title.toLowerCase()}">
                            <i class="${item.icon} mr-3 text-gray-400 group-hover:text-gray-500"></i>
                            ${item.title}
                            <i class="fas fa-chevron-down ml-auto text-xs"></i>
                        </button>
                        <div class="pl-6 space-y-1 hidden" id="submenu-${item.title.toLowerCase()}">
                            ${item.children.map(child => `
                                <a href="${child.href}" class="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                                    <i class="${child.icon} mr-3 text-xs"></i>
                                    ${child.title}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <a href="${item.href}" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg ${item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}">
                        <i class="${item.icon} mr-3 ${item.active ? 'text-blue-500' : 'text-gray-400'}"></i>
                        ${item.title}
                    </a>
                `;
            }
        }).join('');
    },

    // ==============================================
    // DATOS DEL DASHBOARD
    // ==============================================

    async loadDashboardData() {
        this.showLoading(true);
        
        try {
            // Cargar estadísticas básicas
            await Promise.all([
                this.loadStats(),
                this.loadQuickActions(),
                this.loadRecentActivity()
            ]);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            Utils.showToast('Error al cargar datos del dashboard', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    async loadStats() {
        try {
            // Simular carga de estadísticas (puedes reemplazar con llamadas reales al API)
            const stats = {
                totalProducts: await this.getProductsCount(),
                totalUsers: await this.getUsersCount(),
                totalStores: await this.getStoresCount(),
                totalCustomers: await this.getCustomersCount()
            };
            
            this.renderStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    async getProductsCount() {
        try {
            const response = await apiClient.get('/test-models');
            return response.table_counts.products || 0;
        } catch (error) {
            return 0;
        }
    },

    async getUsersCount() {
        try {
            const response = await apiClient.get('/test-models');
            return response.table_counts.users || 0;
        } catch (error) {
            return 0;
        }
    },

    async getStoresCount() {
        try {
            const response = await apiClient.get('/test-models');
            return response.table_counts.stores || 0;
        } catch (error) {
            return 0;
        }
    },

    async getCustomersCount() {
        try {
            const response = await apiClient.get('/test-models');
            return response.table_counts.categories || 0; // Ajustar según API real
        } catch (error) {
            return 0;
        }
    },

    renderStats(stats) {
        const statsCards = document.getElementById('statsCards');
        if (!statsCards) return;

        const cards = [
            {
                title: 'Productos',
                value: Utils.formatNumber(stats.totalProducts),
                icon: 'fas fa-box',
                color: 'blue',
                change: '+5%'
            },
            {
                title: 'Usuarios',
                value: Utils.formatNumber(stats.totalUsers),
                icon: 'fas fa-users',
                color: 'green',
                change: '+2%'
            },
            {
                title: 'Sucursales',
                value: Utils.formatNumber(stats.totalStores),
                icon: 'fas fa-store',
                color: 'purple',
                change: '0%'
            },
            {
                title: 'Clientes',
                value: Utils.formatNumber(stats.totalCustomers),
                icon: 'fas fa-address-book',
                color: 'yellow',
                change: '+12%'
            }
        ];

        const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            yellow: 'bg-yellow-500'
        };

        statsCards.innerHTML = cards.map(card => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">${card.title}</p>
                        <p class="text-2xl font-bold text-gray-900">${card.value}</p>
                    </div>
                    <div class="w-12 h-12 ${colorClasses[card.color]} rounded-lg flex items-center justify-center">
                        <i class="${card.icon} text-white text-lg"></i>
                    </div>
                </div>
                <div class="mt-4 text-sm text-green-600">
                    <i class="fas fa-arrow-up mr-1"></i>
                    ${card.change} vs mes anterior
                </div>
            </div>
        `).join('');
    },

    loadQuickActions() {
        const quickActions = document.getElementById('quickActions');
        if (!quickActions) return;

        const role = this.user.perfil?.nombre_perfil;
        
        const actions = {
            'Gerente': [
                { title: 'Nuevo Producto', icon: 'fas fa-plus', href: './management/products.html?action=create', color: 'blue' },
                { title: 'Nueva Factura', icon: 'fas fa-file-invoice', href: './sales/invoicing.html', color: 'green' },
                { title: 'Ver Reportes', icon: 'fas fa-chart-line', href: './reports/reports.html', color: 'purple' },
                { title: 'Backup BD', icon: 'fas fa-database', href: './system/backup.html', color: 'red' }
            ],
            'Digitador': [
                { title: 'Nuevo Producto', icon: 'fas fa-plus', href: './management/products.html?action=create', color: 'blue' },
                { title: 'Nuevo Cliente', icon: 'fas fa-user-plus', href: './management/customers.html?action=create', color: 'green' },
                { title: 'Nueva Cotización', icon: 'fas fa-file-invoice', href: './sales/quotes.html?action=create', color: 'purple' },
                { title: 'Gestionar Inventario', icon: 'fas fa-boxes', href: './management/inventory.html', color: 'yellow' }
            ],
            'Cajero': [
                { title: 'Nueva Factura', icon: 'fas fa-receipt', href: './sales/invoicing.html', color: 'green' },
                { title: 'Ver Facturas', icon: 'fas fa-list', href: './sales/invoice-list.html', color: 'blue' },
                { title: 'Buscar Cliente', icon: 'fas fa-search', href: './management/customers.html', color: 'purple' },
                { title: 'Productos', icon: 'fas fa-box', href: './management/products.html', color: 'yellow' }
            ]
        };

        const userActions = actions[role] || [];
        
        const colorClasses = {
            blue: 'bg-blue-500 hover:bg-blue-600',
            green: 'bg-green-500 hover:bg-green-600',
            purple: 'bg-purple-500 hover:bg-purple-600',
            yellow: 'bg-yellow-500 hover:bg-yellow-600',
            red: 'bg-red-500 hover:bg-red-600'
        };

        quickActions.innerHTML = userActions.map(action => `
            <a href="${action.href}" class="flex flex-col items-center p-4 ${colorClasses[action.color]} text-white rounded-lg transition-colors">
                <i class="${action.icon} text-2xl mb-2"></i>
                <span class="text-sm font-medium text-center">${action.title}</span>
            </a>
        `).join('');
    },

    loadRecentActivity() {
        const recentActivity = document.getElementById('recentActivity');
        if (!recentActivity) return;

        // Simular actividad reciente
        const activities = [
            {
                text: 'Producto "Pintura Latex Blanca" creado',
                time: '5 minutos',
                icon: 'fas fa-plus text-green-500',
                user: 'Usted'
            },
            {
                text: 'Usuario iniciado sesión exitosamente',
                time: '10 minutos',
                icon: 'fas fa-sign-in-alt text-blue-500',
                user: 'Sistema'
            },
            {
                text: 'Base de datos sincronizada',
                time: '15 minutos',
                icon: 'fas fa-sync text-purple-500',
                user: 'Sistema'
            }
        ];

        recentActivity.innerHTML = activities.map(activity => `
            <div class="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <i class="${activity.icon} text-sm"></i>
                </div>
                <div class="flex-1">
                    <p class="text-sm text-gray-900">${activity.text}</p>
                    <p class="text-xs text-gray-500">Por ${activity.user} • Hace ${activity.time}</p>
                </div>
            </div>
        `).join('');
    },

    // ==============================================
    // EVENTOS
    // ==============================================

    bindEvents() {
        // Dropdown del perfil
        const profileButton = document.getElementById('profileButton');
        const profileMenu = document.getElementById('profileMenu');
        
        if (profileButton && profileMenu) {
            profileButton.addEventListener('click', (e) => {
                e.stopPropagation();
                Utils.toggleElement(profileMenu);
            });

            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', () => {
                if (!profileMenu.classList.contains('hidden')) {
                    profileMenu.classList.add('hidden');
                }
            });
        }

        // Logout
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout.bind(this));
        }

        // Toggle de submenús
        document.addEventListener('click', (e) => {
            if (e.target.dataset.toggle === 'submenu') {
                const targetId = e.target.dataset.target;
                const submenu = document.getElementById(targetId);
                const icon = e.target.querySelector('.fa-chevron-down');
                
                if (submenu && icon) {
                    Utils.toggleElement(submenu);
                    icon.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            }
        });
    },

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const closeMobileMenu = document.getElementById('closeMobileMenu');

        if (mobileMenuButton && mobileMenuOverlay) {
            mobileMenuButton.addEventListener('click', () => {
                Utils.toggleElement(mobileMenuOverlay, true);
            });
        }

        if (closeMobileMenu && mobileMenuOverlay) {
            closeMobileMenu.addEventListener('click', () => {
                Utils.toggleElement(mobileMenuOverlay, false);
            });
        }

        // Cerrar al hacer click en el overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === mobileMenuOverlay) {
                    Utils.toggleElement(mobileMenuOverlay, false);
                }
            });
        }
    },

    async handleLogout() {
        const confirmed = await modalManager.showConfirm({
            title: 'Cerrar Sesión',
            message: '¿Está seguro que desea cerrar su sesión?',
            type: 'warning',
            confirmText: 'Cerrar Sesión'
        });

        if (confirmed) {
            try {
                this.showLoading(true);
                await authManager.logout();
            } catch (error) {
                Utils.showToast('Error al cerrar sesión', 'error');
                this.showLoading(false);
            }
        }
    },

    // ==============================================
    // UTILIDADES
    // ==============================================

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            Utils.toggleElement(loadingOverlay, show);
        }
    }
};