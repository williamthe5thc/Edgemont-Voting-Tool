/**
 * storageUtils.js
 * 
 * This utility file provides functions for interacting with localStorage.
 * It includes:
 * 
 * 1. getFromLocalStorage: Retrieves and parses data from localStorage
 * 2. saveToLocalStorage: Saves data to localStorage
 * 
 * These utilities handle JSON parsing/stringifying and error handling,
 * simplifying localStorage operations throughout the application.
 */

import { showToast } from './uiUtils.js';
console.log("storageUtils.js loading");

/**
 * Retrieves data from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @returns {any|null} The parsed value from localStorage or null if not found or on error
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
 * @param {any} value - The value to store (will be JSON stringified)
 */
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Failed to save data locally', 'error');
    }
}

console.log("storageUtils.js loaded");
