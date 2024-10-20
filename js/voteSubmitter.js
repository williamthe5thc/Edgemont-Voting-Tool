/**
 * voteSubmitter.js
 * 
 * This file is responsible for managing the vote submission process in the cooking competition application.
 * It handles various aspects of the voting system, including:
 * 
 * 1. Setting up and managing vote input fields
 * 2. Validating user inputs in real-time
 * 3. Saving and loading votes from local storage to persist user progress
 * 4. Submitting final votes to the server (Vercel KV)
 * 5. Providing user feedback through toast notifications and UI updates
 * 
 * Key functions:
 * - setDishesPerCategory: Sets the number of dishes for each category based on competition settings
 * - setupVoting: Initializes event listeners for vote inputs
 * - validateInput: Ensures individual vote inputs are valid
 * - saveVotesToLocalStorage / loadVotesFromLocalStorage: Manages vote persistence in local storage
 * - submitVotes: Handles the entire vote submission process, including validation and server communication
 * 
 * This file interacts closely with other modules like constants.js for competition categories,
 * uiUtils.js for displaying notifications, storageUtils.js for local storage operations,
 * and validationUtils.js for vote validation logic.
 */

import { CATEGORIES } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageUtils.js';
import { validateVotes } from './utils/validationUtils.js';

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

/**
 * Sets the number of dishes per category
 * @param {Object} dishes - Object containing dish counts for each category
 */
export function setDishesPerCategory(dishes) {
    DISHES_PER_CATEGORY = dishes;
}

/**
 * Sets up event listeners for voting inputs
 * This function is called once the voting interface is loaded
 */
export function setupVoting() {
    document.querySelectorAll('.vote-input').forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            validateInput(this);
            saveVotesToLocalStorage();
        });
    });
}

/**
 * Validates a single input field
 * @param {HTMLInputElement} input - The input element to validate
 */
export function validateInput(input) {
    const value = parseInt(input.value);
    const category = input.dataset.category;
    const max = DISHES_PER_CATEGORY[category]?.max || 99;

    if (input.value === '') return;

    if (isNaN(value) || value < 1 || value > max) {
        input.value = '';
        showToast(`Please enter a number between 1 and ${max} for ${category}`, 'error');
    }
}

/**
 * Saves the current votes to local storage
 */
export function saveVotesToLocalStorage() {
    const votes = {};
    CATEGORIES.forEach(category => {
        const inputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
        votes[category] = Array.from(inputs)
            .map(input => parseInt(input.value))
            .filter(value => !isNaN(value));
    });
    saveToLocalStorage('currentVotes', votes);
}

/**
 * Loads votes from local storage and populates the input fields
 */
export function loadVotesFromLocalStorage() {
    const votes = getFromLocalStorage('currentVotes');
    if (votes) {
        Object.entries(votes).forEach(([category, selections]) => {
            const inputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
            selections.forEach((value, index) => {
                if (inputs[index]) inputs[index].value = value;
            });
        });
    }
}

/**
 * Handles the vote submission process
 * @param {Event} e - The submit event
 */
export async function submitVotes(e) {
    e.preventDefault();
    console.log("Submit votes function called");
    
    saveVotesToLocalStorage();
    const votes = getFromLocalStorage('currentVotes');
    console.log("Votes to submit:", votes);
    
    const { isValid, invalidCategories } = validateVotes(votes);
    if (!isValid) {
        showToast(`Please enter valid and unique dish numbers for each category. Issues in: ${invalidCategories.join(', ')}`, 'error');
        return;
    }

    const summary = displayVoteSummary(votes);
    const confirmSubmit = confirm(`${summary}\n\nDo you want to submit these votes?\nClick OK to submit or Cancel to go back and edit`);
    if (!confirmSubmit) return;

    const submitButton = document.getElementById('submitVotes');
    submitButton.textContent = 'Voting...';
    submitButton.disabled = true;
    
    try {
        console.log("Submitting votes to Vercel KV");
        await submitToVercelKV(votes);
        console.log("Votes submitted to Vercel KV successfully");

        showToast('Thank you for voting!', 'success');
        localStorage.removeItem('currentVotes');
        
        document.querySelectorAll('.vote-input').forEach(input => input.disabled = true);
        submitButton.textContent = 'Votes Submitted';
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to submit vote. Please try again.', 'error');
        submitButton.textContent = 'Submit Votes';
        submitButton.disabled = false;
    }
}

/**
 * Generates a summary of the votes
 * @param {Object} votes - The votes object
 * @returns {string} A formatted summary of the votes
 */
function displayVoteSummary(votes) {
    let summary = 'Your Vote Summary:\n\n';
    
    CATEGORIES.forEach(category => {
        const categoryVotes = votes[category] || [];
        summary += `${category}:\n`;
        if (categoryVotes.length === 0) {
            summary += '  No votes\n';
        } else {
            categoryVotes.forEach((dish, index) => {
                summary += `  ${index + 1}${index === 0 ? 'st' : 'nd'} choice: Dish #${dish}\n`;
            });
        }
        summary += '\n';
    });
    
    return summary;
}

/**
 * Submits votes to the Vercel KV store
 * @param {Object} votes - The votes object to submit
 * @returns {Promise} A promise that resolves with the server response
 */
async function submitToVercelKV(votes) {
    const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(votes),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
}
