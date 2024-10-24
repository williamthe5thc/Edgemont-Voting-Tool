// categoryLoader.js

import { CATEGORIES } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { makeAPIRequest, API_ENDPOINTS } from './utils/apiUtils.js';
import { createElement, toggleVisibility } from './utils/domUtils.js';
import { APP_CONFIG, UI_MESSAGES } from './utils/configUtils.js';
import { processSettings } from './utils/settingsUtils.js';

let categoriesLoaded = false;

/**
 * Creates HTML structure for a category
 * @param {string} category - Category name
 * @returns {HTMLElement} Category container element
 */
function createCategoryElement(category) {
    const categoryDiv = createElement('div', { className: 'category' }, [
        createElement('h2', {}, [category]),
        createElement('p', {}, ['Enter up to two dish numbers that were your favorite:']),
        ...Array(2).fill().map(() => createElement('input', {
            className: 'vote-input',
            dataset: { category },
            placeholder: 'e.g., 1',
            pattern: '[0-9]*',
            inputmode: 'numeric',
            maxlength: '2'
        })),
        createElement('div', {
            id: `toastContainer-${category}`,
            className: 'toast-container category-toast'
        })
    ]);

    return categoryDiv;
}

/**
 * Fetches and processes settings
 * @returns {Promise<Object>} Processed settings
 */
export async function getSettings() {
    try {
        const settings = await makeAPIRequest(API_ENDPOINTS.SETTINGS);
        return processSettings(settings);
    } catch (error) {
        showToast(UI_MESSAGES.ERROR_LOADING_SETTINGS, 'error');
        return processSettings(null); // Returns default settings
    }
}

/**
 * Loads categories progressively into the UI
 * @returns {Promise<void>}
 */
export async function loadCategoriesProgressively() {
    if (categoriesLoaded) {
        console.log("Categories already loaded, skipping");
        return;
    }

    const skeletonLoader = document.getElementById('loading-spinner');
    const categoriesContainer = document.getElementById('categories');
    
    if (!categoriesContainer) {
        throw new Error('Categories container not found');
    }

    toggleVisibility(skeletonLoader, true);
    categoriesContainer.innerHTML = '';

    try {
        for (const category of CATEGORIES) {
            const categoryElement = createCategoryElement(category);
            categoriesContainer.appendChild(categoryElement);
            
            // Progressive loading effect
            await new Promise(resolve => setTimeout(resolve, APP_CONFIG.CATEGORY_LOAD_DELAY));
        }
        
        categoriesLoaded = true;
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast(UI_MESSAGES.ERROR_LOADING_CATEGORIES, 'error');
    } finally {
        toggleVisibility(skeletonLoader, false);
    }
}
