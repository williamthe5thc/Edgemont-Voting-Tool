/**
 * get-settings.js
 */
import { kv } from '@vercel/kv';
import { handleApiError, methodNotAllowed, CATEGORIES, DEFAULT_MIN_DISH_COUNT, DEFAULT_MAX_DISH_COUNT } from './utils';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return methodNotAllowed(res, ['GET']);
    }

    try {
        // Log KV connection status
        console.log('Attempting to connect to KV store');
        
        // Check if KV is properly initialized
        if (!kv) {
            console.error('KV store not initialized');
            throw new Error('Database connection failed');
        }

        // Attempt to retrieve settings
        let settings = await kv.get('settings');
        console.log('Retrieved settings:', settings);

        // If no settings exist, create default settings
        if (!settings || !settings.dishesPerCategory) {
            settings = {
                dishesPerCategory: CATEGORIES.reduce((acc, category) => {
                    acc[category] = {
                        min: DEFAULT_MIN_DISH_COUNT,
                        max: DEFAULT_MAX_DISH_COUNT
                    };
                    return acc;
                }, {})
            };

            // Try to save default settings
            try {
                await kv.set('settings', settings);
                console.log('Default settings saved successfully');
            } catch (saveError) {
                console.error('Error saving default settings:', saveError);
                // Continue even if save fails - we can still return the default settings
            }
        }

        // Return settings
        res.status(200).json(settings);
    } catch (error) {
        console.error('Error in get-settings:', error);
        
        // Return a more detailed error response
        res.status(500).json({
            error: 'Failed to fetch settings',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
