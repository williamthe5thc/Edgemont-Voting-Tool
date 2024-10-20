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
    console.log("loading current settings");
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
 * This function ensures that:
 * 1. The input is always a number
 * 2. The number is between 1 and 100 (inclusive)
 * 3. Invalid inputs are automatically corrected
 */
function setupValidation() {
    console.log("setup Validation");
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            // If the input is not a number or less than 1, set it to 1
            if (isNaN(value) || value < 1) {
                this.value = 1;
            // If the input is greater than 100, set it to 100
            } else if (value > 100) {
                this.value = 100;
            }
            // If the input is a valid number between 1 and 100, it remains unchanged
        });
    });
}

/**
 * Updates competition settings based on admin input
 * This function:
 * 1. Validates the input for each category
 * 2. Constructs the new settings object
 * 3. Sends the updated settings to the server
 * 4. Provides feedback to the admin user
 */
async function updateSettings() {
    console.log("updating setting");
    const dishesPerCategory = {};
    let isValid = true;

    CATEGORIES.forEach(category => {
        const minInput = document.getElementById(`${category}-min`);
        const maxInput = document.getElementById(`${category}-max`);
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);

        // Validate input: ensure min <= max and both are within allowed range
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
 * This function sends a request to the server to reset all vote counts
 */
async function clearVotes() {
    console.log("clearing Votes");
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
    console.log("setupevent");
    const updateSettingsButton = document.querySelector('.admin-section button');
    if (updateSettingsButton) {
        updateSettingsButton.addEventListener('click', updateSettings);
    }

    const clearVotesButton = document.querySelector('.admin-section:nth-child(2) button');
    if (clearVotesButton) {
        clearVotesButton.addEventListener('click', clearVotes);
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
