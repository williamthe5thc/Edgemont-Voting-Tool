/**
 * validationUtils.js
 * 
 * This utility file provides functions for validating user votes.
 * It ensures that votes meet the required criteria before submission,
 * improving data integrity and user experience.
 */

import { CATEGORIES } from '/js/constants.js';
import { showToast } from './uiUtils.js';

console.log("validationUtils.js loading");

/**
 * Validates the votes object
 * @param {Object} votes - The votes object to validate
 * @returns {Object} An object containing isValid flag and invalidCategories array
 */
export function validateVotes(votes) {
    let isValid = true;
    let invalidCategories = [];

    Object.entries(votes).forEach(([category, selectedDishes]) => {
        if (selectedDishes.length > 2) {
            isValid = false;
            invalidCategories.push(category);
            showToast(`Too many selections for ${category}. Please choose up to 2 dishes.`, 'error', category);
        } else if (selectedDishes.length === 2 && selectedDishes[0] === selectedDishes[1]) {
            isValid = false;
            invalidCategories.push(category);
            showToast(`Please choose 2 unique favorite dishes.`, 'error', category);
        }
    });

    // Check for missing categories
    CATEGORIES.forEach(category => {
        if (!votes[category] || votes[category].length === 0) {
            console.log(`No votes for category: ${category}`);
            // Optionally, you can add a toast notification for categories with no votes
            // showToast(`No votes entered for ${category}.`, 'info', category);
        }
    });

    return { isValid, invalidCategories };
}

console.log("validationUtils.js loaded");
