// api/vote.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Received vote submission:', req.body);

        // Get current votes
        let currentVotes = await kv.get('votes') || {};
        console.log('Current votes from KV:', currentVotes);

        // Process new votes
        const newVotes = req.body;
        
        // Initialize categories if they don't exist
        Object.entries(newVotes).forEach(([category, selectedDishes]) => {
            if (!currentVotes[category]) {
                currentVotes[category] = {};
            }

            // Process each selected dish
            selectedDishes.forEach((dishNumber) => {
                if (!currentVotes[category][dishNumber]) {
                    currentVotes[category][dishNumber] = 0;
                }
                currentVotes[category][dishNumber]++;
            });
        });

        console.log('Updated votes to save:', currentVotes);

        // Save updated votes
        await kv.set('votes', currentVotes);
        console.log('Successfully saved votes to KV');

        // Verify the save was successful
        const verifyVotes = await kv.get('votes');
        if (!verifyVotes) {
            throw new Error('Failed to verify vote submission');
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Vote recorded successfully'
        });

    } catch (error) {
        console.error('Error in vote submission:', error);

        // Check for specific KV store errors
        if (error.code === 'ECONNREFUSED' || error.message.includes('connection')) {
            return res.status(503).json({
                error: 'Database connection error',
                message: 'Unable to connect to the database. Please try again later.'
            });
        }

        // Return a generic 500 error for other cases
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to record vote. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}