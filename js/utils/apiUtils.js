// apiUtils.js

/**
 * Fetches data from a given URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<any>} The parsed JSON response
 */
export async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
