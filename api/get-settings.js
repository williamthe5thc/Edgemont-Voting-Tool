// api/get-settings.js

import { kv } from '@vercel/kv';
import { handleAPIError } from '../utils/errorUtils.js';

const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée'
];

/**
 * Processes and validates settings, creating default if needed
 * @param {Object|null} settings - The settings object from KV store
 * @returns {Object} Processed settings with defaults if needed
 */
function processSettings(settings) {
    // Default settings structure
    const defaultSettings = {
        dishesPerCategory: CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {})
    };

    if (!settings) {
        return defaultSettings;
    }

    // Ensure all categories exist in settings
    const processedSettings = {
        dishesPerCategory: { ...defaultSettings.dishesPerCategory }
    };

    // Merge existing settings with defaults
    if (settings.dishesPerCategory) {
        CATEGORIES.forEach(category => {
            if (settings.dishesPerCategory[category]) {
                processedSettings.dishesPerCategory[category] = {
                    min: settings.dishesPerCategory[category].min || defaultSettings.dishesPerCategory[category].min,
                    max: settings.dishesPerCategory[category].max || defaultSettings.dishesPerCategory[category].max
                };
            }
        });
    }

    return processedSettings;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Attempt to get settings from KV store
        let settings = await kv.get('settings');
        console.log('Retrieved settings from KV:', settings);

        // Process settings and ensure defaults
        settings = processSettings(settings);
        console.log('Processed settings:', settings);

        // If no settings exist, save the defaults
        if (!settings.dishesPerCategory) {
            settings = processSettings(null);
            try {
                await kv.set('settings', settings);
                console.log('Saved default settings to KV');
            } catch (saveError) {
                console.error('Error saving default settings:', saveError);
                // Continue even if save fails - we can still return the default settings
            }
        }

        return res.status(200).json(settings);
    } catch (error) {
        console.error('Error in get-settings:', error);
        return handleAPIError(res, error, 'Failed to fetch settings');
    }
}