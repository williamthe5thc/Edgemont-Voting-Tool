/**
 * update-settings.js
 * 
 * This file handles the server-side logic for updating competition settings.
 * It allows administrators to change the number of dishes allowed per category.
 */

import { getKVData, setKVData, handleApiError, methodNotAllowed } from './utils';

/**
 * API handler for updating competition settings
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export default async function handler(req, res) {
    // Only allow POST requests for updating settings
    if (req.method === 'POST') {
        try {
            const { dishesPerCategory } = req.body;

            // Validate the incoming data
            if (!dishesPerCategory || typeof dishesPerCategory !== 'object') {
                throw new Error('Invalid settings data');
            }

            // Fetch current settings
            let settings = await getKVData('settings') || {};

            // Update settings with new values
            settings.dishesPerCategory = {
                ...settings.dishesPerCategory,
                ...dishesPerCategory
            };

            // Save updated settings to KV store
            await setKVData('settings', settings);

            res.status(200).json({ message: 'Settings updated successfully' });
        } catch (error) {
            // Handle any errors that occur during the process
            handleApiError(res, error, 'Failed to update settings');
        }
    } else {
        // If the request method is not POST, return a method not allowed error
        methodNotAllowed(res, ['POST']);
    }
}
