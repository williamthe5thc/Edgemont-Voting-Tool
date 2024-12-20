/**
 * voteSubmitter.js
 * 
 * This file is responsible for managing the vote submission process in the cooking competition application.
 * It handles various aspects of the voting system, including:
 * 
 * 1. Setting up and managing vote input fields
 * 2. Validating user inputs in real-time
 * 3. Saving and loading votes from local storage to persist user progress
 * 4. Submitting final votes to the server (Vercel KV) and Google Sheets
 * 5. Providing user feedback through toast notifications and UI updates
 */

import { CATEGORIES } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageUtils.js';
import { validateVotes } from './utils/validationUtils.js';
import { generateDeviceFingerprint } from './utils/deviceUtils.js';


// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

/**
 * Sets the number of dishes for each category
 * @param {Object} dishes - Object containing dish counts for each category
 */
export function setDishesPerCategory(dishes) {
    DISHES_PER_CATEGORY = dishes;
}

/**
 * Sets up event listeners for vote input fields
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
 * Validates individual vote inputs
 * @param {HTMLInputElement} input - The input element to validate
 */
export function validateInput(input) {
    const value = parseInt(input.value);
    const category = input.dataset.category;
    const max = DISHES_PER_CATEGORY[category]?.max || 99;

    if (input.value === '') return;

    if (isNaN(value) || value < 1 || value > max) {
        input.value = '';
        console.log(`Validation failed for ${category}. Showing toast.`);
        showToast(`Error: You selected an invalid dish. Please enter a number between 1 and ${max}`, 'error', category);
        return;
    }

    // Check for duplicate entries within the same category
    const categoryInputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
    const categoryVotes = Array.from(categoryInputs).map(inp => inp.value).filter(val => val !== '');
    
    const { isValid, invalidCategories } = validateVotes({ [category]: categoryVotes });
    
    if (!isValid) {
        console.log(`Validation failed for ${category}. Reason: ${invalidCategories[0]}`);
        input.value = '';
    } else {
        console.log(`Input validated successfully for ${category}.`);
    }
}

/**
 * Saves current votes to local storage
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
 * Generates a summary of votes for confirmation
 * @param {Object} votes - The votes object
 * @returns {string} A formatted summary of votes
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
 * Loads saved votes from local storage
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
        console.log("Submitting votes to Vercel KV and Google Sheets");
        const [vercelResponse, googleSheetsResponse] = await Promise.all([
            submitToVercelKV(votes),
            submitToGoogleSheets(votes)
        ]);
        console.log("Votes submitted successfully");
        console.log("Vercel KV response:", vercelResponse);
        console.log("Google Sheets response:", googleSheetsResponse);

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
 * Submits votes to Vercel KV
 * @param {Object} votes - The votes object
 * @returns {Promise<Object>} The response from Vercel KV
 */
async function submitToVercelKV(votes) {
    console.log("Submitting to Vercel KV");
    const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(votes),
    });

    const responseData = await response.text();
    console.log("Vercel KV response:", responseData);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseData}`);
    }

    return JSON.parse(responseData);
}

/**
 * Submits votes to Google Sheets
 * @param {Object} votes - The votes object
 * @returns {Promise<Object>} The response from Google Sheets
 */
async function submitToGoogleSheets(votes) {
    console.log("Starting Google Sheets submission");
    
    try {
        const deviceFingerprint = await generateDeviceFingerprint();
        console.log("Generated device fingerprint:", deviceFingerprint);
        
        const payload = {
            votes: votes,
            metadata: {
                timestamp: new Date().toISOString(),
                deviceId: deviceFingerprint,
                userAgent: navigator.userAgent,
                confidence: 1.0
            }
        };
        
        console.log("Preparing to send payload:", payload);

        // Use your actual Google Script URL here
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcfei_YDOZquNZqOZFU9EhY2vAzfzZwTnwmIWxbhVQCUGGLvDj3tOLwg1GiT-gkwOH/exec';
        
        const formData = new URLSearchParams();
        formData.append('data', JSON.stringify(payload));

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        console.log("Response received:", response);
        return { success: true, message: "Vote submitted" };
        
    } catch (error) {
        console.error("Error in submitToGoogleSheets:", error);
        throw error;
    }
}
