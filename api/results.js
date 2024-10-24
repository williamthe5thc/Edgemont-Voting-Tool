// api/results.js
import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';
import { aggregateVotes, calculateStatistics } from '../utils/transformUtils.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const votes = await kv.get('votes');
        if (!votes || Object.keys(votes).length === 0) {
            return res.status(200).json({ message: 'No votes recorded yet' });
        }

        const aggregatedResults = aggregateVotes(votes);
        const statistics = calculateStatistics(votes);

        res.status(200).json({
            results: aggregatedResults,
            statistics: statistics
        });
    } catch (error) {
        handleAPIError(res, error, 'Failed to fetch results');
    }
}

