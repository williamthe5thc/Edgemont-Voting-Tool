// api/results.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Fetching votes from KV store');
        const votes = await kv.get('votes');
        console.log('Raw votes data:', votes);

        if (!votes || Object.keys(votes).length === 0) {
            return res.status(200).json({ message: 'No votes recorded yet' });
        }

        // Transform votes into array format with scores
        const results = {};
        Object.entries(votes).forEach(([category, categoryVotes]) => {
            results[category] = [];
            Object.entries(categoryVotes).forEach(([dishNumber, count]) => {
                results[category].push({
                    dish: `Dish #${dishNumber}`,
                    score: count
                });
            });
            // Sort by score in descending order
            results[category].sort((a, b) => b.score - a.score);
        });

        console.log('Processed results:', results);
        return res.status(200).json(results);

    } catch (error) {
        console.error('Error in results endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch results'
        });
    }
}