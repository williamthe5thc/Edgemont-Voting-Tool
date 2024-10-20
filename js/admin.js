/**
 * admin.js
 * 
 * This file contains the logic for the admin panel of the voting application.
 * It handles the following key functionalities:
 * 
 * 1. Loading and displaying current competition settings
 * 2. Updating competition settings (number of dishes per category)
 * 3. Clearing all votes from the system
 * 4. Input validation for admin settings
 * 5. Displaying feedback to admin users via toast notifications
 * 
 * The script interacts with the backend API to fetch and update settings,
 * as well as to clear votes. It uses utility functions for UI updates and
 * API calls, and relies on constants for category information.
 */

import { CATEGORIES } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

console.log("admin.js loading");

/**
 * Loads current competition settings and populates the admin interface
 */
async function loadCurrentSettings() {
    try {
        const settings = await fetchData('/api/get-settings');
        const dishCountContainer = document.getElementById('dishCountContainer');
        
        if (!dishCountContainer) {
            throw new Error('Dish count container not found in the HTML');
        }

        dishCountContainer.innerHTML = '';

        // Create input fields for min and max dish counts for each category
        CATEGORIES.forEach(category => {
            const minCount = settings.dishesPerCategory?.[category]?.min || 1;
            const maxCount = settings.dishesPerCategory?.[category]?.max || 5;
            const inputHtml = `
                <div class="dish-count-input">
                    <label>${category}:</label>
                    <input type="number" id="${category}-min" name="${category}-min" value="${minCount}" min="1" max="100">
                    <input type="number" id="${category}-max" name="${category}-max" value="${maxCount}" min="1" max="100">
                </div>
            `;
            dishCountContainer.innerHTML += inputHtml;
        });

        setupValidation();
    } catch (error) {
        console.error('Error loading settings:', error);
        showToast(`Failed to load current settings: ${error.message}`, 'error');
    }
}

/**
 * Sets up input validation for dish count inputs
 */
function setupValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 100) {
                this.value = 100;
            }
        });
    });
}

/**
 * Updates competition settings based on admin input
 */
async function updateSettings() {
    const dishesPerCategory = {};
    let isValid = true;

    CATEGORIES.forEach(category => {
        const minInput = document.getElementById(`${category}-min`);
        const maxInput = document.getElementById(`${category}-max`);
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);

        if (isNaN(min) || isNaN(max) || min < 1 || max < 1 || min > 100 || max > 100 || min > max) {
            isValid = false;
            showToast(`Invalid input for ${category}. Min should be less than or equal to Max.`, 'error');
        } else {
            dishesPerCategory[category] = { min, max };
        }
    });

    if (!isValid) {
        return;
    }

    try {
        const response = await fetch('/api/update-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dishesPerCategory }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showToast('Settings updated successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast(`Failed to update settings: ${error.message}`, 'error');
    }
}

/**
 * Clears all votes from the system
 */
async function clearVotes() {
    try {
        const response = await fetch('/api/clear-votes', {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showToast('Votes cleared successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast(`Failed to clear votes: ${error.message}`, 'error');
    }
}

/**
 * Sets up event listeners for the admin panel
 */
function setupEventListeners() {
    const updateSettingsButton = document.querySelector('.admin-section:nth-child(1) button');
    if (updateSettingsButton) {
        console.log("update settings");
        updateSettingsButton.addEventListener('click', updateSettings);
        
    } else {
        console.error("Update settings button not found");
    }

    const clearVotesButton = document.querySelector('.admin-section:nth-child(2) button');
    if (clearVotesButton) {
        console.log("cleaer votes true");
        clearVotesButton.addEventListener('click', clearVotes);
    } else {
        console.error("Clear votes button not found");
    }
}

/**
 * Initializes the admin panel
 */
function init() {
    loadCurrentSettings();
    setupEventListeners();
}

// Initialize the admin panel when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
console.log("admin.js loaded");
