// api/clear-votes.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Check request method
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are allowed for this endpoint'
        });
    }

    try {
        console.log('Attempting to clear votes from KV store');
        
        // Initialize empty votes object
        const emptyVotes = {
            timestamp: new Date().toISOString(),
            votes: {}
        };

        // Attempt to clear votes by setting an empty object
        await kv.set('votes', emptyVotes);
        console.log('Successfully cleared votes');

        // Verify the votes were cleared
        const verifyVotes = await kv.get('votes');
        if (!verifyVotes) {
            throw new Error('Failed to verify votes were cleared');
        }

        console.log('Verified votes were cleared successfully');
        
        return res.status(200).json({ 
            success: true,
            message: 'Votes cleared successfully',
            timestamp: emptyVotes.timestamp
        });

    } catch (error) {
        console.error('Error in clear-votes:', error);
        
        // Check if it's a KV connection error
        if (error.code === 'ECONNREFUSED' || error.message.includes('connection')) {
            return res.status(503).json({
                error: 'Database connection error',
                message: 'Unable to connect to the database. Please try again later.'
            });
        }

        // Return a generic 500 error for other cases
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to clear votes. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}