// api/get-settings.js
import { kv } from '@vercel/kv';

// Define categories directly in the API to avoid import issues
const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée & Soups'
];
console.log("loading get-settings.js")

/**
 * Creates default settings object
 * @returns {Object} Default settings
 */
function getDefaultSettings() {
    return {
        dishesPerCategory: CATEGORIES.reduce((acc, category) => {
            acc[category] = {
                min: 1,
                max: 50
            };
            return acc;
        }, {})
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Attempting to fetch settings from KV store');
        let settings = await kv.get('settings');
        console.log('Raw settings from KV:', settings);

        // If no settings exist, create and save default settings
        if (!settings || !settings.dishesPerCategory) {
            console.log('No settings found, creating defaults');
            settings = getDefaultSettings();
            
            try {
                await kv.set('settings', settings);
                console.log('Default settings saved to KV store');
            } catch (saveError) {
                console.error('Failed to save default settings:', saveError);
                // Continue with default settings even if save fails
            }
        }

        // Ensure all categories exist in settings
        const processedSettings = {
            dishesPerCategory: { ...getDefaultSettings().dishesPerCategory }
        };

        // Merge existing settings with defaults
        if (settings.dishesPerCategory) {
            CATEGORIES.forEach(category => {
                if (settings.dishesPerCategory[category]) {
                    processedSettings.dishesPerCategory[category] = {
                        min: settings.dishesPerCategory[category].min || 1,
                        max: settings.dishesPerCategory[category].max || 50
                    };
                }
            });
        }

        console.log('Returning processed settings:', processedSettings);
        return res.status(200).json(processedSettings);

    } catch (error) {
        console.error('Error in get-settings:', error);
        
        // Check for KV connection errors
        if (error.code === 'ECONNREFUSED' || error.message.includes('connection')) {
            return res.status(503).json({
                error: 'Database connection error',
                message: 'Unable to connect to the database. Using default settings.',
                settings: getDefaultSettings()
            });
        }

        // For other errors, return default settings with 200 status
        // This ensures the application can continue functioning
        return res.status(200).json({
            warning: 'Error fetching settings. Using default values.',
            ...getDefaultSettings()
        });
    }
}