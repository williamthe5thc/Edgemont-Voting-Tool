/**
 * admin.js
 * 
 * This file contains the logic for the admin panel of the voting application.
 * It handles loading current settings, updating competition settings, 
 * clearing votes, and managing the admin interface.
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
            ;
            dishCountContainer.innerHTML += inputHtml;
        });

        setupValidation();
    } catch (error) {
        console.error('Error loading settings:', error);
        /* showToast(`Failed to load current settings: ${error.message}`, 'error'); */
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
            } else if (value > 100) {  // Updated max value
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

    if (!isValid) return;

    const updateButton = document.getElementById('updateDishCount');
    if (updateButton) {
        updateButton.disabled = true;
        updateButton.textContent = 'Updating...';
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
    } finally {
        if (updateButton) {
            updateButton.disabled = false;
            updateButton.textContent = 'Update Dish Count';
        }
    }
}

/**
 * Clears all votes from the system
 */
async function clearVotes() {
    // First confirmation dialog
    if (!confirm('Are you sure you want to clear all votes? This action cannot be undone.')) {
        return;
    }
    
    // Second confirmation dialog with type-to-confirm
    const confirmationPhrase = 'CLEAR ALL VOTES';
    const userInput = prompt(`To confirm, please type "${confirmationPhrase}" exactly:`);
    
    if (userInput !== confirmationPhrase) {
        showToast('Vote clearing cancelled. The confirmation phrase did not match.', 'info');
        return;
    }

    // Disable the clear button to prevent double-clicks
    const clearButton = document.getElementById('clearVotes');
    if (clearButton) {
        clearButton.disabled = true;
        clearButton.textContent = 'Clearing...';
    }

    try {
        const response = await fetch('/api/clear-votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showToast('All votes have been cleared successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast(`Failed to clear votes: ${error.message}`, 'error');
    } finally {
        // Re-enable the clear button
        if (clearButton) {
            clearButton.disabled = false;
            clearButton.textContent = 'Clear All Votes';
        }
    }
}

/**
 * Sets up event listeners for the admin panel
 */
function setupEventListeners() {
    const updateButton = document.getElementById('updateDishCount');
    if (updateButton) {
        updateButton.addEventListener('click', updateSettings);
    }

    const clearButton = document.getElementById('clearVotes');
    if (clearButton) {
        clearButton.addEventListener('click', clearVotes);
    }
}

/**
 * Initializes the admin panel
 */
function init() {
    loadCurrentSettings();
    setupEventListeners();
    console.log("Admin panel initialized");
}

// Initialize the admin panel when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log("admin.js loaded");