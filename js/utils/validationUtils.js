// validationUtils.js
console.log("validationUtils.js loading");

import { showToast } from './uiUtils.js';

// Remove the constants import and use these default values
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 50;

export function validateInput(value, category, existingVotes = [], settings = {}) {
    // Remove non-numeric characters
    const cleanedValue = value.replace(/\D/g, '');
    
    if (!cleanedValue) {
        return '';
    }

    const numValue = parseInt(cleanedValue, 10);
    
    // Get min/max from settings or use defaults
    const categorySettings = settings?.dishesPerCategory?.[category] || {};
    const minDish = categorySettings.min || DEFAULT_MIN;
    const maxDish = categorySettings.max || DEFAULT_MAX;

    // Check range
    if (numValue < minDish || numValue > maxDish) {
        showToast(
            `Please enter a dish number between ${minDish} and ${maxDish} for the ${category} category`, 
            'error',
            category
        );
        return '';
    }

    // Check for duplicates
    if (existingVotes.includes(cleanedValue)) {
        showToast(
            `You've already selected dish #${cleanedValue} for ${category} please select 2 unique dishes.`, 
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
        const maxSelections = 2;

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
        const minDish = categorySettings.min || DEFAULT_MIN;
        const maxDish = categorySettings.max || DEFAULT_MAX;

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
