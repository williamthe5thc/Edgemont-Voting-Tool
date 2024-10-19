// Import the Vercel KV client
import { kv } from '@vercel/kv';

/**
 * Retrieves data from the KV store.
 * @param {string} key - The key to retrieve.
 * @returns {Promise<any>} The value associated with the key.
 * @throws {Error} If retrieval fails.
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
 * @param {string} key - The key to set.
 * @param {any} value - The value to store.
 * @throws {Error} If setting the value fails.
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
 * @param {Response} res - The response object.
 * @param {Error} error - The error that occurred.
 * @param {string} customMessage - A custom error message.
 */
export function handleApiError(res, error, customMessage) {
  console.error(customMessage, error);
  res.status(500).json({ error: customMessage, details: error.message });
}

/**
 * Sends a 405 Method Not Allowed response.
 * @param {Response} res - The response object.
 * @param {string[]} allowedMethods - The allowed HTTP methods.
 */
export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods);
  res.status(405).end(`Method ${res.req.method} Not Allowed`);
}
