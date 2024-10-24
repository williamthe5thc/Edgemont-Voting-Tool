// voteSubmitter.js

import { CATEGORIES } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { APP_CONFIG, UI_MESSAGES } from './utils/configUtils.js';
import { makeAPIRequest, API_ENDPOINTS } from './utils/apiUtils.js';
import { validateVotes, validateSingleVote } from './utils/validationUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageUtils.js';
import { formatVoteData } from './utils/transformUtils.js';
import { toggleFormDisabled } from './utils/formUtils.js';
import { debounce } from './utils/eventUtils.js';

let DISHES_PER_CATEGORY = {};

/**
 * Sets the number of dishes for each category
 * @param {Object} dishes - Object containing dish counts for each category
 */
export function setDishesPerCategory(dishes) {
    DISHES_PER_CATEGORY = dishes;
}

/**
 * Sets up event listeners for vote inputs
 */
export function setupVoting() {
    const inputs = document.querySelectorAll('.vote-input');
    inputs.forEach(input => {
        const debouncedValidation = debounce((e) => {
            validateAndSaveInput(e.target);
        }, APP_CONFIG.INPUT_DEBOUNCE_DELAY);

        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            debouncedValidation(e);
        });
    });
}

/**
 * Validates and saves a single input
 * @param {HTMLInputElement} input - The input element to validate
 */
function validateAndSaveInput(input) {
    const category = input.dataset.category;
    const value = input.value;
    
    if (value === '') return;

    const categoryInputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
    const existingVotes = Array.from(categoryInputs)
        .filter(inp => inp !== input && inp.value !== '')
        .map(inp => parseInt(inp.value));

    const validation = validateSingleVote(value, category, DISHES_PER_CATEGORY, existingVotes);
    
    if (!validation.isValid) {
        input.value = '';
        showToast(validation.error, 'error', category);
        return;
    }

    saveVotesToLocalStorage();
}

/**
 * Saves current votes to local storage
 */
export function saveVotesToLocalStorage() {
    const votes = CATEGORIES.reduce((acc, category) => {
        const inputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
        acc[category] = Array.from(inputs)
            .map(input => parseInt(input.value))
            .filter(value => !isNaN(value));
        return acc;
    }, {});

    saveToLocalStorage(APP_CONFIG.LOCAL_STORAGE_KEYS.CURRENT_VOTES, votes);
}

/**
 * Loads saved votes from local storage
 */
export function loadVotesFromLocalStorage() {
    const votes = getFromLocalStorage(APP_CONFIG.LOCAL_STORAGE_KEYS.CURRENT_VOTES);
    if (!votes) return;

    Object.entries(votes).forEach(([category, selections]) => {
        const inputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
        selections.forEach((value, index) => {
            if (inputs[index]) inputs[index].value = value;
        });
    });
}

/**
 * Handles vote submission
 * @param {Event} e - Submit event
 */
export async function submitVotes(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitVotes');
    const votes = getFromLocalStorage(APP_CONFIG.LOCAL_STORAGE_KEYS.CURRENT_VOTES);
    const validation = validateVotes(votes, { dishesPerCategory: DISHES_PER_CATEGORY });
    
    if (!validation.isValid) {
        showToast(validation.errors[0], 'error');
        return;
    }

    try {
        toggleFormDisabled(submitButton.form, true);
        submitButton.textContent = UI_MESSAGES.SUBMITTING_VOTES;

        const formattedVotes = formatVoteData(votes);
        await makeAPIRequest(API_ENDPOINTS.VOTE, {
            method: 'POST',
            body: JSON.stringify(formattedVotes)
        });

        showToast(UI_MESSAGES.VOTES_SUBMITTED, 'success');
        localStorage.removeItem(APP_CONFIG.LOCAL_STORAGE_KEYS.CURRENT_VOTES);
        disableVotingInputs();
        
    } catch (error) {
        showToast(UI_MESSAGES.ERROR_SUBMITTING_VOTES, 'error');
    } finally {
        toggleFormDisabled(submitButton.form, false);
        submitButton.textContent = UI_MESSAGES.SUBMIT_VOTES;
    }
}

/**
 * Disables all voting inputs after successful submission
 */
function disableVotingInputs() {
    document.querySelectorAll('.vote-input').forEach(input => {
        input.disabled = true;
    });
}
