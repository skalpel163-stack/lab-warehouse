// Vercel Serverless Function — proxy to ERPNext
// API keys are stored in Vercel Environment Variables, never exposed to browser

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const ERP_URL = process.env.ERP_URL;
    const ERP_KEY = process.env.ERP_KEY;
    const ERP_SECRET = process.env.ERP_SECRET;

    if (!ERP_URL || !ERP_KEY) {
        return res.status(500).json({ error: 'Server not configured' });
    }

    // Get the target path from query
    const { path, ...queryParams } = req.query;
    if (!path) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const targetUrl = `${ERP_URL}${path}`;
    const url = new URL(targetUrl);

    // Append query params (except 'path')
    Object.entries(queryParams).forEach(([k, v]) => {
        url.searchParams.set(k, v);
    });

    try {
        const fetchOptions = {
            method: req.method,
            headers: {
                'Authorization': `token ${ERP_KEY}:${ERP_SECRET}`,
                'Content-Type': 'application/json'
            }
        };

        if (['POST', 'PUT'].includes(req.method) && req.body) {
            fetchOptions.body = JSON.stringify(req.body);
        }

        const response = await fetch(url.toString(), fetchOptions);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
