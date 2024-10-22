/**
 * api/utils.js
 */
import { kv } from '@vercel/kv';

// Define categories and default values
export const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrées & Soups'
];

export const DEFAULT_MIN_DISH_COUNT = 1;
export const DEFAULT_MAX_DISH_COUNT = 50;

/**
 * Retrieves data from the KV store
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
 * Sets data in the KV store
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
 * Handles API errors
 */
export function handleApiError(res, error, customMessage) {
    console.error(customMessage, error);
    res.status(500).json({ 
        error: customMessage, 
        details: error.message,
        timestamp: new Date().toISOString()
    });
}

/**
 * Handles method not allowed responses
 */
export function methodNotAllowed(res, allowedMethods) {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${res.req.method} Not Allowed`);
}

/**
 * Sets CORS headers
 */
export function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
}
