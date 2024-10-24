// api/clear-votes.js
import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await kv.set('votes', {});
        res.status(200).json({ message: 'Votes cleared successfully' });
    } catch (error) {
        handleAPIError(res, error, 'Failed to clear votes');
    }
}
