/**
 * apiUtils.js
 * 
 * This utility file provides functions for making API calls.
 * It includes:
 * 
 * 1. fetchData: A function to fetch data from a given URL
 * 
 * This utility simplifies API calls across the application,
 * providing consistent error handling and response parsing.
 */
console.log("apiUtils.js loading");

/**
 * Fetches data from a given URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the fetch request fails or returns a non-OK status
 */
export async function fetchData(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API Request Error (${endpoint}):`, error);
        throw error;
    }
}

export async function submitData(endpoint, data, options = {}) {
    return fetchData(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options
    });
}

console.log("apiUtils.js loaded");