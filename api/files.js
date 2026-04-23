// Vercel Serverless Function — proxy ERPNext files (images)
export default async function handler(req, res) {
    const ERP_URL = process.env.ERP_URL;
    const ERP_KEY = process.env.ERP_KEY;
    const ERP_SECRET = process.env.ERP_SECRET;

    if (!ERP_URL) {
        return res.status(500).json({ error: 'Server not configured' });
    }

    // Get file path from query
    const filePath = req.query.path;
    if (!filePath) {
        return res.status(400).json({ error: 'Missing path' });
    }

    try {
        const url = `${ERP_URL}${filePath}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${ERP_KEY}:${ERP_SECRET}`
            }
        });

        if (!response.ok) {
            return res.status(response.status).end();
        }

        // Forward content type and cache for 1 hour
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const buffer = Buffer.from(await response.arrayBuffer());
        res.status(200).send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
