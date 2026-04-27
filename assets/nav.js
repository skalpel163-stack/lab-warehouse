// ========================================
// Лаборатория Ремонта — Shared navigation
// Рендерит шапку с учётом роли пользователя
// ========================================

// ===== Theme management =====
const Theme = {
    KEY: 'lr-theme',
    get() {
        return localStorage.getItem(this.KEY) || 'light';
    },
    set(theme) {
        localStorage.setItem(this.KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    toggle() {
        this.set(this.get() === 'dark' ? 'light' : 'dark');
        // Update toggle icon
        const btn = document.querySelector('.theme-toggle');
        if (btn) btn.innerHTML = `<i class="ti ${this.get() === 'dark' ? 'ti-sun' : 'ti-moon'}"></i>`;
    },
    init() {
        document.documentElement.setAttribute('data-theme', this.get());
    }
};

// Apply theme immediately to prevent flash
Theme.init();

function renderNavbar(activePage = '') {
    const user = Auth.user;
    if (!user) return '';

    const isAdmin = user.role === 'admin';
    const initial = user.name.charAt(0).toUpperCase();

    // Menu items based on role — main + overflow ("Ещё")
    const mainItems = [];
    const moreItems = [];

    mainItems.push({ id: 'catalog', href: 'index.html', label: 'Склад', icon: 'ti-package' });
    mainItems.push({ id: 'avito', href: 'avito.html', label: 'Авито', icon: 'ti-shopping-cart' });

    if (isAdmin) {
        mainItems.push({ id: 'masters', href: 'masters.html', label: 'Мастера', icon: 'ti-users' });
        mainItems.push({ id: 'vykup', href: 'vykup.html', label: 'Выкуп склад', icon: 'ti-cash' });
        mainItems.push({ id: 'amway', href: 'amway.html', label: 'Amway', icon: 'ti-building-store' });
        moreItems.push({ id: 'purchases', href: 'purchases.html', label: 'Закупка', icon: 'ti-shopping-cart' });
        moreItems.push({ id: 'tech-details', href: 'tech-details.html', label: 'Детализация', icon: 'ti-cpu' });
        moreItems.push({ id: 'suppliers', href: 'suppliers.html', label: 'Поставщики', icon: 'ti-truck' });
        moreItems.push({ id: 'settings', href: 'settings.html', label: 'Настройки', icon: 'ti-settings' });
    } else {
        mainItems.push({ id: 'my', href: 'my.html', label: 'Мой подотчёт', icon: 'ti-briefcase' });
        mainItems.push({ id: 'purchases', href: 'purchases.html', label: 'Закупка', icon: 'ti-shopping-cart' });
        if (user.login === 'nebaikin') {
            mainItems.push({ id: 'amway', href: 'amway.html', label: 'Amway', icon: 'ti-building-store' });
        }
        moreItems.push({ id: 'tech-details', href: 'tech-details.html', label: 'Детализация', icon: 'ti-cpu' });
        moreItems.push({ id: 'suppliers', href: 'suppliers.html', label: 'Поставщики', icon: 'ti-truck' });
    }

    const mainHtml = mainItems.map(m => `
        <a class="nav-link ${activePage === m.id ? 'active' : ''}" href="${m.href}">
            <i class="ti ${m.icon} me-1"></i>${m.label}
        </a>
    `).join('');

    const moreActive = moreItems.some(m => m.id === activePage);
    const moreDropdownHtml = moreItems.length ? `
        <div class="nav-item dropdown">
            <a class="nav-link ${moreActive ? 'active' : ''}" href="#" data-bs-toggle="dropdown">
                <i class="ti ti-dots me-1"></i>Ещё<span id="nav-purchases-badge" class="badge bg-danger ms-1" style="display:none;font-size:10px;"></span>
            </a>
            <div class="dropdown-menu">
                ${moreItems.map(m => `
                    <a class="dropdown-item ${activePage === m.id ? 'active' : ''}" href="${m.href}">
                        <i class="ti ${m.icon} me-2"></i>${m.label}${m.id === 'purchases' ? '<span id="nav-purchases-badge-inner" class="badge bg-danger ms-1" style="display:none;font-size:10px;"></span>' : ''}
                    </a>
                `).join('')}
            </div>
        </div>
    ` : '';

    const menuHtml = mainHtml + moreDropdownHtml;

    const addButton = isAdmin
        ? `<button class="btn btn-yellow" onclick="openAddModal && openAddModal()">
               <i class="ti ti-plus"></i> Добавить товар
           </button>`
        : '';

    return `
    <header class="navbar navbar-expand-md lr-navbar d-print-none">
        <div class="container-xl">
            <a href="index.html" class="navbar-brand lr-logo">
                <svg class="lr-logo-tree" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#00c853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Trunk -->
                    <line x1="20" y1="38" x2="20" y2="14"/>
                    <!-- Main branches -->
                    <line x1="20" y1="22" x2="11" y2="16"/>
                    <line x1="20" y1="22" x2="29" y2="16"/>
                    <line x1="20" y1="16" x2="14" y2="10"/>
                    <line x1="20" y1="16" x2="26" y2="10"/>
                    <!-- Circuit nodes (leaves) -->
                    <circle cx="11" cy="16" r="2" fill="#00c853" stroke="none"/>
                    <circle cx="29" cy="16" r="2" fill="#00c853" stroke="none"/>
                    <circle cx="14" cy="10" r="2" fill="#00c853" stroke="none"/>
                    <circle cx="26" cy="10" r="2" fill="#00c853" stroke="none"/>
                    <circle cx="20" cy="6" r="2.5" fill="#00c853" stroke="none"/>
                    <line x1="20" y1="14" x2="20" y2="8.5"/>
                </svg>
                <div class="lr-logo-text">
                    <span class="lr-logo-line1">ЛАБОРАТОРИЯ</span>
                    <span class="lr-logo-line2">РЕМОНТА</span>
                </div>
            </a>

            <div class="navbar-nav flex-row d-none d-md-flex ms-4">
                ${menuHtml}
            </div>

            <div class="navbar-nav flex-row order-md-last ms-auto">
                <div class="nav-item d-none d-md-flex me-3">${addButton}</div>
                <div class="nav-item d-flex align-items-center me-2">
                    <button class="theme-toggle" onclick="Theme.toggle()" title="Переключить тему">
                        <i class="ti ${Theme.get() === 'dark' ? 'ti-sun' : 'ti-moon'}"></i>
                    </button>
                </div>
                <div class="nav-item dropdown">
                    <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
                        <span class="avatar avatar-sm" style="background:${isAdmin ? '#00c853' : '#f1f3f5'};color:${isAdmin ? '#fff' : '#001a34'};">${initial}</span>
                        <div class="d-none d-xl-block ps-2">
                            <div>${user.name}</div>
                            <div class="mt-1 small text-muted">${isAdmin ? 'Админ' : 'Мастер'}</div>
                        </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        ${isAdmin ? `
                            <a href="#" class="dropdown-item" onclick="openWriteOffModal && openWriteOffModal()"><i class="ti ti-file-minus me-2"></i>Списать товар</a>
                            <a href="#" class="dropdown-item" onclick="openHistoryModal && openHistoryModal()"><i class="ti ti-history me-2"></i>История списаний</a>
                            <div class="dropdown-divider"></div>
                        ` : ''}
                        <a href="#" class="dropdown-item" onclick="Theme.toggle(); return false;"><i class="ti ${Theme.get() === 'dark' ? 'ti-sun' : 'ti-moon'} me-2"></i>${Theme.get() === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</a>
                        <a href="#" class="dropdown-item" onclick="location.reload()"><i class="ti ti-refresh me-2"></i>Обновить</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="Auth.logout(); return false;"><i class="ti ti-logout me-2"></i>Выйти</a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
}

// Auto-insert navbar at page load
function initNavbar(activePage = '') {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('navbar-slot');
        if (container) container.innerHTML = renderNavbar(activePage);
        // Load purchase request badge (for admin)
        loadPurchaseBadge();
    });
}

// Load new purchase requests count for badge
async function loadPurchaseBadge() {
    const u = Auth.user;
    if (!u) return;
    try {
        const res = await (typeof API !== 'undefined' ? API : { getList: () => ({ message: [] }) })
            .getList('Note', ['title'], [['title', 'like', 'ZAK|new|%']], 100);
        const count = (res.message || []).length;
        if (count > 0) {
            const badge = document.getElementById('nav-purchases-badge');
            const badgeInner = document.getElementById('nav-purchases-badge-inner');
            if (badge) { badge.textContent = count; badge.style.display = 'inline'; }
            if (badgeInner) { badgeInner.textContent = count; badgeInner.style.display = 'inline'; }
        }
    } catch(e) {}
}
