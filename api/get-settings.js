/**
 * api/get-settings.js
 */
import { 
    getKVData, 
    setKVData, 
    handleApiError, 
    methodNotAllowed, 
    setCorsHeaders,
    CATEGORIES,
    DEFAULT_MIN_DISH_COUNT,
    DEFAULT_MAX_DISH_COUNT 
} from './utils.js';

export default async function handler(req, res) {
    // Set CORS headers
    setCorsHeaders(res);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return methodNotAllowed(res, ['GET']);
    }

    try {
        // Attempt to retrieve settings
        let settings = await getKVData('settings');
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

            // Save default settings
            try {
                await setKVData('settings', settings);
                console.log('Default settings saved successfully');
            } catch (saveError) {
                console.error('Error saving default settings:', saveError);
                // Continue even if save fails - we can still return the default settings
            }
        }

        // Return settings
        res.status(200).json(settings);
    } catch (error) {
        handleApiError(res, error, 'Failed to fetch settings');
    }
}
