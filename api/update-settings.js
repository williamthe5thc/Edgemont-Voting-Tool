// api/update-settings.js
import { kv } from '@vercel/kv';
import { API_CATEGORIES } from './config.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Raw request body:', req.body);
        const { dishesPerCategory } = req.body;

        // Basic validation of input structure
        if (!dishesPerCategory || typeof dishesPerCategory !== 'object') {
            return res.status(400).json({
                error: 'Invalid request format',
                message: 'dishesPerCategory must be an object'
            });
        }

        // Create new settings object
        const newDishesPerCategory = {};

        // Process each category
        for (const category of API_CATEGORIES) {
            const settings = dishesPerCategory[category];
            
            // Ensure category exists
            if (!settings) {
                return res.status(400).json({
                    error: 'Missing category',
                    message: `Settings for ${category} are missing`
                });
            }

            // Parse values as integers and validate
            const min = parseInt(settings.min);
            const max = parseInt(settings.max);

            // Validate parsed values
            if (isNaN(min) || isNaN(max)) {
                return res.status(400).json({
                    error: 'Invalid values',
                    message: `Min and max must be numbers for ${category}`
                });
            }

            // Validate ranges
            if (min < 1 || max > 70 || min > max) {
                return res.status(400).json({
                    error: 'Invalid range',
                    message: `Invalid min/max values for ${category}. Min must be ≥ 1, max must be ≤ 70, and min must be ≤ max`
                });
            }

            // Store validated values
            newDishesPerCategory[category] = { min, max };
        }

        // Create complete settings object
        const settingsToSave = {
            dishesPerCategory: newDishesPerCategory,
            lastUpdated: new Date().toISOString()
        };

        console.log('Attempting to save settings:', settingsToSave);

        // Save to KV store
        await kv.set('settings', settingsToSave);

        // Verify save was successful
        const savedSettings = await kv.get('settings');
        if (!savedSettings) {
            throw new Error('Failed to verify settings were saved');
        }

        console.log('Settings saved successfully:', savedSettings);

        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings: savedSettings
        });

    } catch (error) {
        console.error('Server error in update-settings:', error);
        
        // Check if it's a KV connection error
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Database connection error',
                message: 'Unable to connect to the database'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while updating settings',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}