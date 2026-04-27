// ========================================
// Лаборатория Ремонта — API layer
// All requests go through /api/proxy serverless function
// API keys are stored server-side, never exposed to browser
// For local dev: set window.LOCAL_DEV = true to use direct ERPNext
// ========================================

const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';

const API = {
    // URL prefix for images — direct for local, empty for production (images proxied via imgUrl)
    get URL() {
        return IS_LOCAL ? this._localUrl : '';
    },

    // Get proxied image URL for production
    imgUrl(path) {
        if (!path) return '';
        if (IS_LOCAL) return `${this._localUrl}${path}`;
        return `/api/files?path=${encodeURIComponent(path)}`;
    },

    // Local dev fallback (only used when opening file:// directly)
    _localUrl: 'http://localhost:8080',
    _localKey: 'ffdaeed6662f499',
    _localSecret: '70595909d34a5bb',

    _proxyCall(method, path, queryParams = {}, body = null) {
        if (IS_LOCAL) {
            // Direct ERPNext call for local development
            const url = new URL(`${this._localUrl}${path}`);
            Object.entries(queryParams).forEach(([k, v]) => url.searchParams.set(k, v));
            const opts = {
                method,
                headers: {
                    'Authorization': `token ${this._localKey}:${this._localSecret}`,
                    'Content-Type': 'application/json'
                }
            };
            if (body) opts.body = JSON.stringify(body);
            return fetch(url.toString(), opts).then(r => r.json());
        }

        // Production: go through serverless proxy
        const params = new URLSearchParams({ path, ...queryParams });
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) opts.body = JSON.stringify(body);
        return fetch(`/api/proxy?${params}`, opts).then(r => r.json());
    },

    async getList(doctype, fields, filters = [], limit = 1000) {
        return this._proxyCall('GET', '/api/method/frappe.client.get_list', {
            doctype, fields: JSON.stringify(fields), filters: JSON.stringify(filters), limit_page_length: limit
        });
    },

    async getDoc(doctype, name) {
        return this._proxyCall('GET', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
    },

    async create(doctype, data) {
        return this._proxyCall('POST', `/api/resource/${encodeURIComponent(doctype)}`, {}, data);
    },

    async update(doctype, name, data) {
        return this._proxyCall('PUT', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {}, data);
    },

    async remove(doctype, name) {
        return this._proxyCall('DELETE', `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
    },

    async uploadFile(file, docname) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('doctype', 'Item');
        fd.append('docname', docname);
        fd.append('is_private', '0');

        if (IS_LOCAL) {
            const res = await fetch(`${this._localUrl}/api/method/upload_file`, {
                method: 'POST',
                headers: { 'Authorization': `token ${this._localKey}:${this._localSecret}` },
                body: fd
            });
            return res.json();
        }

        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        return res.json();
    }
};

// ===== High-level operations =====

async function fetchWarehouseData() {
    const [binRes, itemsRes] = await Promise.all([
        API.getList('Bin', ['item_code', 'warehouse', 'actual_qty', 'valuation_rate', 'stock_value'], [['actual_qty', '>', 0]]),
        API.getList('Item', ['item_code', 'item_name', 'image', 'custom_notes', 'custom_location', 'custom_locация', 'custom_responsible', 'item_group', 'custom_source_type'])
    ]);
    const itemsMap = {};
    (itemsRes.message || []).forEach(i => { itemsMap[i.item_code] = i; });

    return (binRes.message || []).map(bin => {
        const item = itemsMap[bin.item_code] || {};
        const name = item.item_name || bin.item_code;
        const searchText = name + ' ' + (item.custom_notes || '');
        const meta = Meta.get(bin.item_code);
        return {
            ...bin,
            item_name: name,
            image: item.image,
            notes: item.custom_notes,
            location: item.custom_location,
            locация: item['custom_locация'],
            responsible: item.custom_responsible,
            item_group: item.item_group,
            _partTypes: meta.partTypes && meta.partTypes.length ? meta.partTypes : detectPartType(searchText),
            _brands: meta.brands && meta.brands.length ? meta.brands : detectBrands(searchText),
            _models: [],
            _appliances: meta.appliances && meta.appliances.length ? meta.appliances : detectAppliances(searchText),
            article: meta.article || '',
            link: meta.link || '',
            compatibility: meta.compatibility || '',
            supplier: meta.supplier || '',
            purchasePrice: meta.purchasePrice || 0,
            minStock: meta.minStock || 0,
            analogs: meta.analogs || '',
            sourceType: item.custom_source_type || ''
        };
    });
}

async function createItemWithStock(name, group, qty, price, loc, place, responsible, notes, photoFile, sourceType) {
    const code = generateItemCode(name);

    const itemData = {
        item_code: code, item_name: name, item_group: group, stock_uom: 'Nos', is_stock_item: 1,
        custom_notes: notes, custom_location: place, 'custom_locация': loc, custom_responsible: responsible
    };
    if (sourceType) itemData.custom_source_type = sourceType;

    const itemRes = await API.create('Item', itemData);
    if (itemRes.exception) throw new Error(itemRes.exception);

    if (photoFile) {
        const upRes = await API.uploadFile(photoFile, code);
        if (upRes.message && upRes.message.file_url) {
            await API.update('Item', code, { image: upRes.message.file_url });
        }
    }

    const seRes = await API.create('Stock Entry', {
        stock_entry_type: 'Material Receipt',
        to_warehouse: 'Основной склад - L',
        company: 'LabRemonta',
        items: [{
            item_code: code, qty: parseFloat(qty), basic_rate: parseFloat(price),
            t_warehouse: 'Основной склад - L'
        }]
    });
    if (seRes.exception) throw new Error(seRes.exception);

    await API.update('Stock Entry', seRes.data.name, { docstatus: 1 });
    return code;
}

async function transferItem(code, fromWh, toWh, qty, remarks = '') {
    const seRes = await API.create('Stock Entry', {
        stock_entry_type: 'Material Transfer',
        from_warehouse: fromWh, to_warehouse: toWh, company: 'LabRemonta', remarks,
        items: [{ item_code: code, qty, s_warehouse: fromWh, t_warehouse: toWh }]
    });
    if (seRes.exception) throw new Error(seRes.exception);
    await API.update('Stock Entry', seRes.data.name, { docstatus: 1 });
}

async function deleteItemCompletely(code) {
    // Cancel & delete stock entries
    const seList = await API.getList('Stock Entry Detail', ['parent'], [['item_code', '=', code]]);
    const seNames = [...new Set((seList.message || []).map(d => d.parent))];
    for (const n of seNames) {
        try { await API.update('Stock Entry', n, { docstatus: 2 }); } catch (e) {}
        try { await API.remove('Stock Entry', n); } catch (e) {}
    }
    // Delete SLE
    const sleList = await API.getList('Stock Ledger Entry', ['name'], [['item_code', '=', code]]);
    for (const s of (sleList.message || [])) {
        try { await API.remove('Stock Ledger Entry', s.name); } catch (e) {}
    }
    // Delete Bins
    const binList = await API.getList('Bin', ['name'], [['item_code', '=', code]], 100);
    for (const b of (binList.message || [])) {
        try { await API.remove('Bin', b.name); } catch (e) {}
    }
    // Delete Item
    try { await API.remove('Item', code); } catch (e) {}
    Meta.remove(code);
}

async function fetchItemHistory(itemCode) {
    const res = await API.getList('Stock Ledger Entry',
        ['posting_date', 'posting_time', 'voucher_type', 'voucher_no', 'warehouse', 'actual_qty', 'qty_after_transaction'],
        [['item_code', '=', itemCode]], 50);
    const entries = res.message || [];
    const seNames = [...new Set(entries.filter(e => e.voucher_type === 'Stock Entry').map(e => e.voucher_no))];
    const seDetails = {};
    await Promise.all(seNames.map(async name => {
        try {
            const d = await API.getDoc('Stock Entry', name);
            if (d.data) seDetails[name] = { remarks: d.data.remarks || '', from_warehouse: d.data.from_warehouse || '', to_warehouse: d.data.to_warehouse || '' };
        } catch (e) {}
    }));
    return entries.map(e => ({ ...e, _se: seDetails[e.voucher_no] || {} }));
}

function generateItemCode(name) {
    const short = (name || '').substring(0, 30).toUpperCase().replace(/\s+/g, '-').replace(/[^A-ZА-Я0-9\-]/gi, '');
    return `${short}-${Date.now().toString(36).toUpperCase()}`;
}
