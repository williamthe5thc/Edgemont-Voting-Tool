// api/get-settings.js

import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';
import { processSettings } from '../utils/settingsUtils.js';

const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée'
];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let settings = await kv.get('settings');
        
        // If no settings exist, create default settings
        if (!settings || !settings.dishesPerCategory) {
            settings = processSettings(null);
            await kv.set('settings', settings);
        }
        
        res.status(200).json(settings);
    } catch (error) {
        handleAPIError(res, error, 'Failed to fetch settings');
    }
}

// api/update-settings.js

import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';
import { validateSettings } from '../utils/validationUtils.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { dishesPerCategory } = req.body;

        // Validate the incoming settings
        const validation = validateSettings(dishesPerCategory);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid settings',
                details: validation.errors
            });
        }

        // Get current settings and update
        let settings = await kv.get('settings') || {};
        settings.dishesPerCategory = {
            ...settings.dishesPerCategory,
            ...dishesPerCategory
        };

        // Save updated settings
        await kv.set('settings', settings);
        
        res.status(200).json({ 
            message: 'Settings updated successfully',
            settings: settings
        });
    } catch (error) {
        handleAPIError(res, error, 'Failed to update settings');
    }
}
