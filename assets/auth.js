// ========================================
// Лаборатория Ремонта — Авторизация
// ВРЕМЕННОЕ решение (без бэкенда).
// При переезде на VPS переделать на JWT + ERPNext User API.
// ========================================

const DEFAULT_USERS = [
    { login: 'admin',      password: 'admin123', role: 'admin',  name: 'Администратор', responsible: null },
    { login: 'stebaev',    password: '1234',     role: 'master', name: 'Стебаев',       responsible: 'Стебаев' },
    { login: 'arsenyuk',   password: '1234',     role: 'master', name: 'Арсенюк',       responsible: 'Арсенюк' },
    { login: 'grichenko',  password: '1234',     role: 'master', name: 'Гриченко',      responsible: 'Гриченко' },
    { login: 'ermakovich', password: '1234',     role: 'master', name: 'Ермакович',     responsible: 'Ермакович' },
    { login: 'ershov',     password: '1234',     role: 'master', name: 'Ершов',         responsible: 'Ершов' },
    { login: 'legkodimov', password: '1234',     role: 'master', name: 'Легкодимов',    responsible: 'Легкодимов' },
    { login: 'balandin',   password: '1234',     role: 'master', name: 'Баландин',      responsible: 'Баландин' },
    { login: 'sopkin',     password: '1234',     role: 'master', name: 'Сопкин',        responsible: 'Сопкин' }
];

function getUsers() {
    try {
        const s = localStorage.getItem('lr_users');
        return s ? JSON.parse(s) : [...DEFAULT_USERS];
    } catch (e) { return [...DEFAULT_USERS]; }
}

function saveUsers(users) {
    localStorage.setItem('lr_users', JSON.stringify(users));
}

const Auth = {
    // Current session
    get user() {
        try {
            const s = sessionStorage.getItem('lr_user');
            return s ? JSON.parse(s) : null;
        } catch (e) { return null; }
    },

    login(login, password) {
        const users = getUsers();
        const u = users.find(u => u.login === login && u.password === password);
        if (!u) return { ok: false, error: 'Неверный логин или пароль' };
        const session = { login: u.login, role: u.role, name: u.name, responsible: u.responsible };
        sessionStorage.setItem('lr_user', JSON.stringify(session));
        return { ok: true, user: session };
    },

    logout() {
        sessionStorage.removeItem('lr_user');
        location.href = 'login.html';
    },

    // Require authentication — redirects to login if not logged in
    require(requiredRole = null) {
        const u = this.user;
        if (!u) {
            location.href = 'login.html';
            return null;
        }
        if (requiredRole && u.role !== requiredRole) {
            alert('Доступ запрещён');
            location.href = 'index.html';
            return null;
        }
        return u;
    },

    isAdmin() { return this.user?.role === 'admin'; },
    isMaster() { return this.user?.role === 'master'; }
};

// Get list of all masters (for admin views)
function getAllMasters() {
    return getUsers().filter(u => u.role === 'master');
}
