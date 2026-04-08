// ========================================
// Лаборатория Ремонта — логика каталога
// ========================================

// ===== Auto-detection dictionaries (defaults) =====
const DEFAULT_PART_TYPES = {
    'Помпа': ['помпа', 'насос', 'pump', 'ulka', 'jypc'],
    'Двигатель': ['двигатель', 'мотор', 'motor', 'engine'],
    'Аккумулятор': ['аккумулятор', 'аккмулятор', 'батарея', 'battery', 'акб', 'li-pol', 'li-ion'],
    'Экран': ['экран', 'дисплей', 'display', 'lcd', 'oled', 'screen'],
    'Плата': ['плата', 'модуль', 'board', 'igbt', 'контроллер', 'pcb'],
    'Шлейф': ['шлейф', 'flex', 'кабель', 'cable'],
    'Корпус': ['корпус', 'крышка', 'рамка', 'case', 'housing'],
    'Камера': ['камера', 'camera', 'объектив'],
    'Динамик': ['динамик', 'спикер', 'speaker', 'звонок', 'buzzer'],
    'Микрофон': ['микрофон', 'microphone', 'mic'],
    'Кнопка': ['кнопка', 'button', 'клавиша'],
    'Щётка': ['щетка', 'щётка', 'brush'],
    'Фильтр': ['фильтр', 'filter'],
    'Стекло': ['стекло', 'glass', 'защитное'],
    'Разъём': ['разъем', 'разъём', 'коннектор', 'connector', 'jack'],
    'Тачскрин': ['тачскрин', 'тач', 'touch', 'сенсор'],
    'Зарядка': ['зарядка', 'зарядное', 'charger', 'адаптер'],
    'Клапан': ['клапан', 'valve'],
    'Бойлер': ['бойлер', 'boiler'],
    'Уплотнитель': ['уплотнитель', 'манжета', 'прокладка', 'gasket', 'seal']
};

const DEFAULT_BRANDS = {
    'Apple': ['apple', 'iphone', 'ipad', 'macbook', 'imac', 'airpods'],
    'Samsung': ['samsung', 'galaxy'],
    'Xiaomi': ['xiaomi', 'redmi', 'poco'],
    'Huawei': ['huawei', 'honor'],
    'Philips': ['philips', 'aquatrio'],
    'Miele': ['miele'],
    'Bosch': ['bosch'],
    'Siemens': ['siemens'],
    'LG': ['lg '],
    'Panasonic': ['panasonic'],
    'Sony': ['sony'],
    'Dyson': ['dyson'],
    'Karcher': ['karcher', 'керхер'],
    'DeLonghi': ['delonghi'],
    'Krups': ['krups'],
    'Saeco': ['saeco'],
    'Jura': ['jura'],
    'Nespresso': ['nespresso'],
    'Tefal': ['tefal'],
    'Rowenta': ['rowenta'],
    'Braun': ['braun'],
    'Domel': ['domel'],
    'Ulka': ['ulka'],
    'Nokia': ['nokia'],
    'Motorola': ['motorola'],
    'Asus': ['asus'], 'Acer': ['acer'], 'Lenovo': ['lenovo'], 'Dell': ['dell']
};

const DEFAULT_APPLIANCES = {
    'Телефон': ['iphone', 'phone', 'телефон', 'смартфон', 'galaxy', 'redmi', 'pixel'],
    'Планшет': ['ipad', 'планшет', 'tablet'],
    'Ноутбук': ['macbook', 'ноутбук', 'laptop', 'notebook'],
    'Пылесос': ['пылесос', 'vacuum', 'vaccum', 'aquatrio'],
    'Кофемашина': ['кофе', 'coffee', 'espresso', 'эспрессо', 'ulka', 'jypc', 'saeco', 'delonghi', 'jura', 'nespresso'],
    'Бритва': ['бритв', 'shaver', 'wes8163'],
    'Стиральная машина': ['стиральн', 'стиралка', 'washing', 'washer'],
    'Холодильник': ['холодильник', 'fridge'],
    'Микроволновка': ['микроволнов', 'microwave', 'свч'],
    'Блендер': ['блендер', 'blender'],
    'Чайник': ['чайник', 'kettle'],
    'Утюг': ['утюг', 'iron'],
    'Фен': ['фен', 'hairdryer'],
    'ИБП': ['ибп', 'ups', 'бесперебойн']
};

function detectTag(text, dict) {
    const lower = (text || '').toLowerCase();
    const matches = [];
    for (const [tag, keywords] of Object.entries(dict)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) { matches.push(tag); break; }
        }
    }
    return matches;
}

// Load dictionaries from localStorage (or use defaults)
function getDict(key, defaults) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : { ...defaults };
    } catch (e) { return { ...defaults }; }
}

function saveDict(key, dict) {
    localStorage.setItem(key, JSON.stringify(dict));
}

function getPartTypes() { return getDict('lr_dict_parttypes', DEFAULT_PART_TYPES); }
function getBrands() { return getDict('lr_dict_brands', DEFAULT_BRANDS); }
function getAppliances() { return getDict('lr_dict_appliances', DEFAULT_APPLIANCES); }

function detectPartType(t) { return detectTag(t, getPartTypes()); }
function detectBrands(t) { return detectTag(t, getBrands()); }
function detectAppliances(t) { return detectTag(t, getAppliances()); }

// ===== Metadata storage (localStorage, temp until ERPNext custom fields) =====
const Meta = {
    get(itemCode) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            return all[itemCode] || {};
        } catch (e) { return {}; }
    },
    set(itemCode, meta) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            all[itemCode] = { ...(all[itemCode] || {}), ...meta };
            localStorage.setItem('lr_item_meta', JSON.stringify(all));
        } catch (e) {}
    },
    remove(itemCode) {
        try {
            const all = JSON.parse(localStorage.getItem('lr_item_meta') || '{}');
            delete all[itemCode];
            localStorage.setItem('lr_item_meta', JSON.stringify(all));
        } catch (e) {}
    }
};

// ===== Settings =====
const DEFAULT_SETTINGS = {
    locations: ['Авангардная', 'Ленинский', 'Бирюзова', 'Нарния', 'Боксбери', 'У мастера', 'ВЫКУП', 'АВИТО', 'AMWAY'],
    responsible: [],
    groups: ['Запчасти', 'Доноры']
};

function getSettings() {
    const saved = localStorage.getItem('lr_settings');
    return saved ? JSON.parse(saved) : { ...DEFAULT_SETTINGS };
}

function saveSettings(s) {
    localStorage.setItem('lr_settings', JSON.stringify(s));
}

// ===== Format helpers =====
function formatPrice(v) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v || 0);
}

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStatusText(wh) {
    if (!wh) return '—';
    if (wh.includes('Подотчёт')) return 'Подотчёт';
    if (wh.includes('Списан')) return 'Списано';
    return 'На складе';
}

function fmtWh(w) { return (w || '—').replace(' - L', ''); }

function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
}

function toast(msg, type = '') {
    let t = document.getElementById('lr-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'lr-toast';
        t.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;background:#111;color:white;border-radius:12px;font-size:14px;font-weight:500;opacity:0;transform:translateY(10px);transition:all .3s;z-index:3000;box-shadow:0 4px 20px rgba(0,0,0,.2);';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    if (type === 'success') t.style.background = '#53b64c';
    else if (type === 'error') t.style.background = '#dc2626';
    else t.style.background = '#111';
    t.style.opacity = '1'; t.style.transform = 'translateY(0)';
    clearTimeout(t._tm);
    t._tm = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; }, 3000);
}
