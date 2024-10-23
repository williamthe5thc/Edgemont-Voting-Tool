// validationUtils.js
import { showToast } from './uiUtils.js';
import { DEFAULT_MIN_DISH_COUNT, DEFAULT_MAX_DISH_COUNT } from './constants.js';

console.log("validationUtils.js loading");

export function validateInput(value, category, existingVotes = [], settings = {}) {
    // Remove non-numeric characters
    const cleanedValue = value.replace(/\D/g, '');
    
    // If empty, that's okay
    if (!cleanedValue) {
        return '';
    }

    const numValue = parseInt(cleanedValue, 10);
    
    // Get min/max from settings or use defaults
    const categorySettings = settings?.dishesPerCategory?.[category] || {};
    const minDish = categorySettings.min || DEFAULT_MIN_DISH_COUNT;
    const maxDish = categorySettings.max || DEFAULT_MAX_DISH_COUNT;

    // Check range
    if (numValue < minDish || numValue > maxDish) {
        showToast(
            `Please enter a dish number between ${minDish} and ${maxDish} for ${category}`, 
            'error',
            category
        );
        return '';
    }

    // Check for duplicates
    if (existingVotes.includes(cleanedValue)) {
        showToast(
            `You've already selected dish #${cleanedValue} for ${category}`, 
            'error',
            category
        );
        return '';
    }

    return cleanedValue;
}

export function validateVotes(votes, settings = {}) {
    let isValid = true;
    let invalidCategories = [];

    Object.entries(votes).forEach(([category, selectedDishes]) => {
        const validDishes = selectedDishes.filter(dish => dish);
        const maxSelections = 2; // Maximum allowed selections per category

        if (validDishes.length > maxSelections) {
            isValid = false;
            invalidCategories.push(category);
            showToast(
                `Too many selections for ${category}. Please choose up to ${maxSelections} dishes.`,
                'error',
                category
            );
        }

        // Check for duplicates
        const uniqueDishes = new Set(validDishes);
        if (uniqueDishes.size !== validDishes.length) {
            isValid = false;
            invalidCategories.push(category);
            showToast(
                `Please choose unique dishes for ${category}.`,
                'error',
                category
            );
        }

        // Validate each dish number against min/max
        const categorySettings = settings?.dishesPerCategory?.[category] || {};
        const minDish = categorySettings.min || DEFAULT_MIN_DISH_COUNT;
        const maxDish = categorySettings.max || DEFAULT_MAX_DISH_COUNT;

        validDishes.forEach(dish => {
            const dishNum = parseInt(dish, 10);
            if (dishNum < minDish || dishNum > maxDish) {
                isValid = false;
                invalidCategories.push(category);
                showToast(
                    `Dish #${dish} is outside the valid range (${minDish}-${maxDish}) for ${category}`,
                    'error',
                    category
                );
            }
        });
    });

    return { isValid, invalidCategories };
}

console.log("validationUtils.js loaded");
