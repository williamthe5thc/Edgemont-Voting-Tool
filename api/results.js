// api/results.js
import { kv } from '@vercel/kv';

import CATEGORIES from './constants.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Fetching votes from KV store');
        const votes = await kv.get('votes');
        console.log('Raw votes from KV:', votes);

        if (!votes || Object.keys(votes).length === 0) {
            return res.status(200).json({ message: 'No votes recorded yet' });
        }

        // Transform votes into category rankings
        const results = {};
        
        CATEGORIES.forEach(category => {
            const categoryVotes = votes[category] || {};
            const dishScores = Object.entries(categoryVotes).map(([dishNumber, count]) => ({
                dishNumber: parseInt(dishNumber),
                votes: count
            }));

            // Sort by votes and get top 3
            results[category] = dishScores
                .sort((a, b) => b.votes - a.votes)
                .slice(0, 3)
                .map((dish, index) => ({
                    rank: index + 1,
                    dishNumber: dish.dishNumber,
                    votes: dish.votes
                }));
        });

        return res.status(200).json({ categories: results });

    } catch (error) {
        console.error('Error processing results:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch results',
            details: error.message
        });
    }
}