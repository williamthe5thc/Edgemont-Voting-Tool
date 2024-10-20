/**
 * categoryLoader.js
 * 
 * This file handles the loading of categories and competition settings for the voting application.
 * It includes functions to fetch settings from the server and dynamically load category inputs.
 */

import { CATEGORIES, THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

// Flag to prevent duplicate loading of categories
let categoriesLoaded = false;

/**
 * Fetches competition settings from the server
 * @returns {Promise<Object>} The settings object containing dishesPerCategory
 */
export async function getSettings() {
    try {
        // Fetch settings from the server
        const settings = await fetchData('/api/get-settings');
        console.log("Received settings:", settings);

        if (!settings || typeof settings !== 'object') {
            throw new Error('Invalid settings received from server');
        }

        // Process the settings and set up DISHES_PER_CATEGORY
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            const categorySettings = settings.dishesPerCategory?.[category] || {};
            acc[category] = {
                min: categorySettings.min || 1,
                max: categorySettings.max || 50
            };
            return acc;
        }, {});

        return { dishesPerCategory: DISHES_PER_CATEGORY };
    } catch (error) {
        console.error('Error fetching settings:', error);
        showToast('Error loading settings. Using default values.', 'error');
        // Set default values if settings fetch fails
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {});
        return { dishesPerCategory: DISHES_PER_CATEGORY };
    }
}

/**
 * Loads categories progressively into the UI
 * This function creates input fields for each category and handles loading animations
 */
export async function loadCategoriesProgressively() {
    console.log("Starting to load categories");
    if (categoriesLoaded) {
        console.log("Categories already loaded, skipping");
        return;
    }

    const skeletonLoader = document.getElementById('loading-spinner');
    const categoriesContainer = document.getElementById('categories');
    
    if (!categoriesContainer) {
        console.error('Categories container not found');
        return;
    }

    // Show loading spinner
    skeletonLoader.style.display = 'flex';
    categoriesContainer.innerHTML = '';

    try {
        console.log("Categories to load:", CATEGORIES);
        // Iterate through each category and create UI elements
        for (let category of CATEGORIES) {
        console.log(`Loading category: ${category}`);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
            <h2>${category}</h2>
            <p>Enter up to two dish numbers that were your favorite:</p>
            ${Array(2).fill().map(() => `
                <input type="text" 
                    class="vote-input" 
                    data-category="${category}" 
                    placeholder="e.g., 1" 
                    pattern="[0-9]*" 
                    inputmode="numeric"
                    maxlength="2">
            `).join('')}
            <div id="toastContainer-${category}" class="toast-container"></div>
        `;
        
        categoriesContainer.appendChild(categoryDiv);
        console.log(`Category ${category} loaded. Toast container ID: toastContainer-${category}`);
        // Small delay to allow for progressive loading effect
        await new Promise(resolve => setTimeout(resolve, 100));
    }
        console.log("All categories loaded");
        categoriesLoaded = true;
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories. Please refresh the page.', 'error');
    } finally {
        // Hide loading spinner
        skeletonLoader.style.display = 'none';
    }
}
