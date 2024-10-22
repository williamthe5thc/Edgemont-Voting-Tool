/**
 * utils.js
 * 
 * This file contains utility functions used throughout the application.
 * It provides abstracted methods for interacting with the KV store,
 * handling API errors, and managing HTTP method restrictions.
 */

import { kv } from '@vercel/kv';
/*
*****************************
******************************
* EDIT THE VARIABLES BELOW
******************************
******************************
*/

/** 
* This is for the API variables to know what the categories are, 
* and can't be combined with the constants in the js/ folder.
*/
const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée'
];
// Default values for dish counts
const DEFAULT_MIN_DISH_COUNT = 1;
const DEFAULT_MAX_DISH_COUNT = 50;

/*
*****************************
******************************
* EDIT THE VARIABLES ABOVE
******************************
******************************
*/


/**
 * Retrieves data from the KV store.
 * This function wraps the KV get operation with error handling.
 * 
 * @param {string} key - The key to retrieve from the KV store.
 * @returns {Promise<any>} The value associated with the key.
 * @throws {Error} If there's an issue fetching from the KV store.
 */
export async function getKVData(key) {
    try {
        return await kv.get(key);
    } catch (error) {
        console.error(`Error fetching ${key} from KV:`, error);
        throw new Error(`Failed to fetch ${key}`);
    }
}

/**
 * Sets data in the KV store.
 * This function wraps the KV set operation with error handling.
 * 
 * @param {string} key - The key to set in the KV store.
 * @param {any} value - The value to store.
 * @throws {Error} If there's an issue setting data in the KV store.
 */
export async function setKVData(key, value) {
    try {
        await kv.set(key, value);
    } catch (error) {
        console.error(`Error setting ${key} in KV:`, error);
        throw new Error(`Failed to set ${key}`);
    }
}

/**
 * Handles API errors by logging and sending an appropriate response.
 * This function provides a consistent way to handle errors across API routes.
 * 
 * @param {Response} res - The response object.
 * @param {Error} error - The error that occurred.
 * @param {string} customMessage - A custom error message to include in the response.
 */
export function handleApiError(res, error, customMessage) {
    console.error(customMessage, error);
    res.status(500).json({ error: customMessage, details: error.message });
}

/**
 * Sends a 405 Method Not Allowed response.
 * This function is used to restrict API routes to specific HTTP methods.
 * 
 * @param {Response} res - The response object.
 * @param {string[]} allowedMethods - An array of allowed HTTP methods.
 */
export function methodNotAllowed(res, allowedMethods) {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${res.req.method} Not Allowed`);
}
