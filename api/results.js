// api/results.js
import { kv } from '@vercel/kv';
import { CATEGORIES } from '../constants.js';

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

        // Transform votes into category rankings
        const results = {};
        
        CATEGORIES.forEach(category => {
            if (!votes[category]) {
                results[category] = [];
                return;
            }

            // Calculate scores for each dish
            const dishScores = [];
            Object.entries(votes[category]).forEach(([dishNumber, voteCount]) => {
                // For each dish, calculate total points
                // First place votes worth 2 points, second place worth 1 point
                dishScores.push({
                    dishNumber: parseInt(dishNumber),
                    totalVotes: voteCount,
                    score: voteCount
                });
            });

            // Sort by score (descending) and get top 3
            results[category] = dishScores
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((dish, index) => ({
                    rank: index + 1,
                    dishNumber: dish.dishNumber,
                    votes: dish.totalVotes
                }));
        });

        console.log('Processed results:', results);
        return res.status(200).json({
            categories: results
        });

    } catch (error) {
        console.error('Error in results endpoint:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch results'
        });
    }
}