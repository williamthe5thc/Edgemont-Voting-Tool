/**
 * validationUtils.js
 * 
 * This utility file provides functions for validating user votes.
 * It includes:
 * 
 * 1. validateVotes: Checks if the votes object is valid according to competition rules
 * 
 * This utility ensures that votes meet the required criteria before submission,
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

    CATEGORIES.forEach(category => {
        const categoryVotes = votes[category] || [];
        if (categoryVotes.length > 2) {
            isValid = false;
            invalidCategories.push(category);
        } else if (categoryVotes.length === 2 && categoryVotes[0] === categoryVotes[1]) {
            isValid = false;
            invalidCategories.push(`${category} (duplicate selection)`);
        }
    });


    Object.entries(votes).forEach(([category, selectedDishes]) => {
        if (selectedDishes.length > 2) {
            isValid = false;
            invalidCategories.push(category);
            showToast(`Too many selections for ${category}. Please choose up to 2 dishes.`, 'error', category);
        } else if (selectedDishes.length === 2 && selectedDishes[0] === selectedDishes[1]) {
            isValid = false;
            invalidCategories.push(`${category}`);
            showToast(`Duplicate entries detected for ${category}. Please choose 2 unique favorite dishes.`, 'error', category);
        }
    });

    return { isValid, invalidCategories };
    
}
console.log("validationUtils.js loaded");
