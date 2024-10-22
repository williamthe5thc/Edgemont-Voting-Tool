/**
 * categoryLoader.js
 */
import { CATEGORIES, THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

let DISHES_PER_CATEGORY = {};
let categoriesLoaded = false;

export async function getSettings() {
    try {
        const settings = await fetchData('/api/get-settings');
        console.log("Received settings:", settings);

        if (!settings || typeof settings !== 'object') {
            throw new Error('Invalid settings received from server');
        }

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
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {});
        return { dishesPerCategory: DISHES_PER_CATEGORY };
    }
}

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
        showToast('Error: Categories container not found', 'error');
        return;
    }

    // Only try to show the spinner if it exists
    if (skeletonLoader) {
        skeletonLoader.style.display = 'flex';
    } else {
        console.warn('Loading spinner element not found');
    }

    categoriesContainer.innerHTML = '';

    try {
        console.log("Categories to load:", CATEGORIES);
        for (let category of CATEGORIES) {
            console.log(`Loading category: ${category}`);
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');
            categoryDiv.innerHTML = `
                <h2>${category}</h2>
                <p>Enter the number of your favorite ${category} dish (You can pick up to 2):</p>
                ${Array(2).fill().map(() => `
                    <input type="text" 
                        class="vote-input" 
                        data-category="${category}" 
                        placeholder="e.g., 1" 
                        pattern="[0-9]*" 
                        inputmode="numeric"
                        maxlength="2">
                `).join('')}
                <div id="toastContainer-${category}" class="toast-container category-toast"></div>
            `;
            
            categoriesContainer.appendChild(categoryDiv);
            console.log(`Category ${category} loaded. Toast container ID: toastContainer-${category}`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("All categories loaded");
        categoriesLoaded = true;
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories. Please refresh the page.', 'error');
    } finally {
        // Only try to hide the spinner if it exists
        if (skeletonLoader) {
            skeletonLoader.style.display = 'none';
        }
    }
}
