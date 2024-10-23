// validationUtils.js
console.log("validationUtils.js loading");

import { showToast } from './uiUtils.js';

export function validateInput(value, category, existingVotes = []) {
    // Remove non-numeric characters
    const cleanedValue = value.replace(/\D/g, '');
    
    // If empty, that's okay
    if (!cleanedValue) {
        return '';
    }

    const numValue = parseInt(cleanedValue, 10);

    // Check range (1-99)
    if (numValue < 1 || numValue > 99) {
        showToast(`Please enter a number between 1 and 99 for ${category}`, 'error');
        return '';
    }

    // Check for duplicates
    if (existingVotes.includes(cleanedValue)) {
        showToast(`You've already selected dish #${cleanedValue} for ${category}`, 'error');
        return '';
    }

    return cleanedValue;
}

export function validateVotes(votes) {
    let isValid = true;
    let invalidCategories = [];

    Object.entries(votes).forEach(([category, selectedDishes]) => {
        // Filter out empty strings
        const validDishes = selectedDishes.filter(dish => dish);
        
        if (validDishes.length > 2) {
            isValid = false;
            invalidCategories.push(category);
            showToast(`Too many selections for ${category}. Please choose up to 2 unique dishes.`, 'error');
        }
        
        // Check for duplicates
        const uniqueDishes = new Set(validDishes);
        if (uniqueDishes.size !== validDishes.length) {
            isValid = false;
            invalidCategories.push(category);
            showToast(`Please choose unique dishes for ${category}.`, 'error');
        }
    });

    return { isValid, invalidCategories };
}

console.log("validationUtils.js loaded");
