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

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

export function setDishesPerCategory(dishes) {
    DISHES_PER_CATEGORY = dishes;
}

export function setupVoting() {
    document.querySelectorAll('.vote-input').forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            validateInput(this);
            saveVotesToLocalStorage();
        });
    });
}

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
        await Promise.all([
            submitToVercelKV(votes),
            submitToGoogleSheets(votes)
        ]);
        console.log("Votes submitted successfully");

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

async function submitToVercelKV(votes) {
    console.log("submitting to vercel KV");
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

async function submitToGoogleSheets(votes) {
    console.log("submitting to google");
    const response = await fetch('https://script.google.com/macros/s/AKfycbw-mf4ET7v5owXHVXlxcQup74TcFaQdnxuZWGwch0xpsDefewipZ2tsUWxRDptW5yU/exec', {
        method: 'POST',
        body: JSON.stringify(votes),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
}
