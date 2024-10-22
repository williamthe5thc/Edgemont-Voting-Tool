/**
 * get-settings.js
 * 
 * This file handles the server-side logic for retrieving competition settings.
 * It's essential for initializing the application with the correct parameters,
 * such as the number of dishes allowed per category.
 */

import { getKVData, setKVData, handleApiError, methodNotAllowed } from './utils';
import { CATEGORIES } from '../js/constants.js';
console.log("get settings imported");
const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée'
];

// Default values for dish counts
const DEFAULT_MIN_DISH_COUNT = 1;
const DEFAULT_MAX_DISH_COUNT = 50;


/**
 * API handler for retrieving competition settings
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export default async function handler(req, res) {
    // Only allow GET requests for fetching settings
    if (req.method === 'GET') {
        try {
            // Attempt to retrieve settings from KV store
            let settings = await getKVData('settings');
            
            // If settings don't exist, create default settings
            // This ensures the application always has a valid configuration
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
                // Save default settings to KV store for future use
                await setKVData('settings', settings);
            }
            
            // Return settings as JSON response
            res.status(200).json(settings);
        } catch (error) {
            // Handle any errors that occur during the process
            handleApiError(res, error, 'Failed to fetch settings');
        }
    } else {
        // If the request method is not GET, return a method not allowed error
        methodNotAllowed(res, ['GET']);
    }
}
