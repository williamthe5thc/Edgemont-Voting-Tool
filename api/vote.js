// api/vote.js
import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';
import { validateVotes } from '../utils/validationUtils.js';
import { getKVData } from '../utils/apiUtils.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const settings = await getKVData('settings');
        const newVote = req.body;
        
        const validation = validateVotes(newVote, settings);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid votes',
                details: validation.errors
            });
        }

        let votes = await kv.get('votes') || {};
        Object.entries(newVote).forEach(([category, selectedDishes]) => {
            if (!votes[category]) votes[category] = {};
            selectedDishes.forEach((dish, index) => {
                if (!votes[category][dish]) {
                    votes[category][dish] = { 1: 0, 2: 0 };
                }
                votes[category][dish][index + 1]++;
            });
        });

        await kv.set('votes', votes);
        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        handleAPIError(res, error, 'Failed to save vote');
    }
}
