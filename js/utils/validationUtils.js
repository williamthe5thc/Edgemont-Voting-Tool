// validationUtils.js

import { CATEGORIES } from '../constants.js';

/**
 * Validates a single vote input
 * @param {string|number} value - Input value
 * @param {string} category - Category name
 * @param {Object} settings - Category settings
 * @param {Array} existingVotes - Other votes in the same category
 * @returns {Object} Validation result
 */
export function validateSingleVote(value, category, settings, existingVotes = []) {
    const result = {
        isValid: false,
        error: null
    };

    const maxDishes = settings[category]?.max;
    if (!maxDishes) {
        result.error = `Invalid category: ${category}`;
        return result;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > maxDishes) {
        result.error = `Please enter a number between 1 and ${maxDishes} for ${category}`;
        return result;
    }

    if (existingVotes.includes(numValue)) {
        result.error = `You cannot vote for the same dish twice in ${category}`;
        return result;
    }

    result.isValid = true;
    return result;
}

/**
 * Validates complete votes object
 * @param {Object} votes - Votes to validate
 * @param {Object} settings - Competition settings
 * @returns {Object} Validation result
 */
export function validateVotes(votes, settings) {
    const result = {
        isValid: true,
        errors: [],
        invalidCategories: []
    };

    if (!votes || typeof votes !== 'object') {
        result.isValid = false;
        result.errors.push('Invalid votes structure');
        return result;
    }

    CATEGORIES.forEach(category => {
        const categoryVotes = votes[category] || [];
        const maxDishes = settings?.dishesPerCategory?.[category]?.max;

        // Validate vote count
        if (categoryVotes.length > 2) {
            result.isValid = false;
            result.errors.push(`Too many selections for ${category}`);
            result.invalidCategories.push(category);
            return;
        }

        // Validate vote values
        const uniqueVotes = new Set(categoryVotes);
        if (uniqueVotes.size !== categoryVotes.length) {
            result.isValid = false;
            result.errors.push(`Duplicate selections in ${category}`);
            result.invalidCategories.push(category);
            return;
        }

        // Validate vote range
        categoryVotes.forEach(vote => {
            if (!maxDishes || vote < 1 || vote > maxDishes) {
                result.isValid = false;
                result.errors.push(`Invalid dish number in ${category}: ${vote}`);
                result.invalidCategories.push(category);
            }
        });
    });

    return result;
}

/**
 * Formats validation errors for display
 * @param {Array} errors - Error messages
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(errors) {
    if (!errors || errors.length === 0) return '';
    return errors[0]; // Return first error for simplicity
}
