// Vercel Serverless Function — proxy file uploads to ERPNext

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const ERP_URL = process.env.ERP_URL;
    const ERP_KEY = process.env.ERP_KEY;
    const ERP_SECRET = process.env.ERP_SECRET;

    try {
        // Forward the raw body to ERPNext
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        const response = await fetch(`${ERP_URL}/api/method/upload_file`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${ERP_KEY}:${ERP_SECRET}`,
                'Content-Type': req.headers['content-type']
            },
            body
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
