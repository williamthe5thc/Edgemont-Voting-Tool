// api/results.js
import { kv } from '@vercel/kv';

/**
 * Processes votes data into a structured format
 * @param {Object} rawVotes - Raw votes data from KV store
 * @returns {Object} Processed results and statistics
 */
function processVotes(rawVotes) {
    if (!rawVotes || Object.keys(rawVotes).length === 0) {
        return {
            message: 'No votes recorded yet'
        };
    }

    const results = {};
    const statistics = {
        totalVotes: 0,
        categoryStats: {}
    };

    // Process each category
    Object.entries(rawVotes).forEach(([category, categoryVotes]) => {
        results[category] = [];
        statistics.categoryStats[category] = {
            total: 0,
            uniqueVoters: new Set()
        };

        // Process votes for each dish in the category
        Object.entries(categoryVotes).forEach(([dishNumber, voteCount]) => {
            results[category].push({
                dishNumber: parseInt(dishNumber),
                votes: voteCount
            });
            
            statistics.categoryStats[category].total += voteCount;
            statistics.categoryStats[category].uniqueVoters.add(dishNumber);
            statistics.totalVotes += voteCount;
        });

        // Sort dishes by vote count (descending)
        results[category].sort((a, b) => b.votes - a.votes);
        
        // Convert Set to number for JSON serialization
        statistics.categoryStats[category].uniqueVoters = 
            statistics.categoryStats[category].uniqueVoters.size;
    });

    return {
        results,
        statistics
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Fetching votes from KV store');
        const votes = await kv.get('votes');
        console.log('Raw votes data:', votes);

        // Process the votes data
        const processedResults = processVotes(votes);
        console.log('Processed results:', processedResults);

        return res.status(200).json(processedResults);

    } catch (error) {
        console.error('Error in results endpoint:', error);
        
        // Check for KV store connection errors
        if (error.code === 'ECONNREFUSED' || error.message.includes('connection')) {
            return res.status(503).json({
                error: 'Database connection error',
                message: 'Unable to connect to the database. Please try again later.'
            });
        }

        // Return a generic 500 error for other cases
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch results. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}