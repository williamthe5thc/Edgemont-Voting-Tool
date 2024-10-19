import { kv } from '@vercel/kv';
import { handleApiError, methodNotAllowed } from './utils';

export default async function handler(req, res) {
    console.log('Received request method:', req.method);
    console.log('Received request body:', JSON.stringify(req.body));

    if (req.method === 'POST') {
        try {
            console.log('Processing vote:', JSON.stringify(req.body));
            let votes = await kv.get('votes') || {};
            console.log('Current votes:', JSON.stringify(votes));
            
            const newVote = req.body;
            
            Object.entries(newVote).forEach(([category, selectedDishes]) => {
                if (!votes[category]) {
                    votes[category] = {};
                }
                selectedDishes.forEach((dish, index) => {
                    if (!votes[category][dish]) {
                        votes[category][dish] = { 1: 0, 2: 0 };
                    }
                    votes[category][dish][index + 1]++;
                });
            });
            
            console.log('Updated votes:', JSON.stringify(votes));
            await kv.set('votes', votes);
            console.log('Votes saved to KV store');
            res.status(200).json({ message: 'Vote recorded successfully' });
        } catch (error) {
            console.error('Error in vote handler:', error);
            handleApiError(res, error, 'Failed to save vote');
        }
    } else {
        console.log('Method not allowed:', req.method);
        methodNotAllowed(res, ['POST']);
    }
}
