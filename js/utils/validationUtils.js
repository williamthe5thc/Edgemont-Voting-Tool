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

import { CATEGORIES } from './constants.js';
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

    return { isValid, invalidCategories };
}
console.log("validationUtils.js loaded");
