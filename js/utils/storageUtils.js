// storageUtils.js

import { showToast } from './uiUtils.js';

/**
 * Retrieves data from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @returns {any|null} The parsed value from localStorage or null if not found
 */
export function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        showToast('Failed to retrieve local data', 'error');
        return null;
    }
}

/**
 * Saves data to localStorage
 * @param {string} key - The key to use in localStorage
 * @param {any} value - The value to store
 */
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Failed to save data locally', 'error');
    }
}
