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
    
    // Create a map to track all selected dish numbers across categories
    const selectedDishes = new Map(); // dish number -> category name

    // First pass: check for duplicate selections across all categories
    for (const [category, categoryVotes] of Object.entries(votes)) {
        for (const dishNumber of categoryVotes) {
            if (selectedDishes.has(dishNumber)) {
                // Found a duplicate across categories
                const existingCategory = selectedDishes.get(dishNumber);
                isValid = false;
                
                // Add both categories to invalidCategories if not already present
                if (!invalidCategories.includes(category)) {
                    invalidCategories.push(category);
                }
                if (!invalidCategories.includes(existingCategory)) {
                    invalidCategories.push(existingCategory);
                }
                
                showToast(
                    `Dish #${dishNumber} was already selected in the ${existingCategory} category. ` +
                    `Please select different dish numbers for each category.`,
                    'error',
                    category
                );
            } else {
                selectedDishes.set(dishNumber, category);
            }
        }

        // Check for too many selections within the category
        if (categoryVotes.length > 2) {
            isValid = false;
            if (!invalidCategories.includes(category)) {
                invalidCategories.push(category);
            }
            showToast(
                `Too many selections for ${category}. Please choose up to 2 dishes.`,
                'error',
                category
            );
        }
    }

    // Check for missing categories (optional notification)
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