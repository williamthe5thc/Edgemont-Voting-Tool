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
