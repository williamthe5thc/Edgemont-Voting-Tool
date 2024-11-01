// Add this to validationUtils.js

/**
 * Validates settings object
 * @param {Object} dishesPerCategory - Settings to validate
 * @returns {Object} Validation result
 */
export function validateSettings(dishesPerCategory) {
    const result = {
        isValid: true,
        errors: []
    };

    if (!dishesPerCategory || typeof dishesPerCategory !== 'object') {
        result.isValid = false;
        result.errors.push('Invalid settings structure');
        return result;
    }

    Object.entries(dishesPerCategory).forEach(([category, settings]) => {
        // Validate category exists
        if (!CATEGORIES.includes(category)) {
            result.isValid = false;
            result.errors.push(`Invalid category: ${category}`);
            return;
        }

        // Validate min/max values
        if (typeof settings.min !== 'number' || settings.min < 1) {
            result.isValid = false;
            result.errors.push(`Invalid minimum value for ${category}`);
        }

        if (typeof settings.max !== 'number' || settings.max < settings.min) {
            result.isValid = false;
            result.errors.push(`Invalid maximum value for ${category}`);
        }

        if (settings.max > 100) {
            result.isValid = false;
            result.errors.push(`Maximum value too high for ${category}`);
        }
    });

    return result;
}

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
            showToast(`You already selected dish #${selectedDishes[0]} in the ${category} category. Please choose 2 unique favorite dishes.`, 'error', category);
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
