/**
 * script.js
 * 
 * This file serves as the main JavaScript file for the voting application's user interface.
 * It orchestrates the core functionalities of the voting process, including:
 * 
 * 1. Initialization of the application
 * 2. Fetching and applying competition settings
 * 3. Dynamically loading voting categories
 * 4. Managing user input for votes
 * 5. Handling vote persistence through local storage
 * 6. Validating user votes
 * 7. Submitting votes to both Vercel KV and Google Sheets
 * 8. Providing user feedback through UI updates and toast notifications
 * 
 * Key functions:
 * - getSettings: Fetches competition settings from the server
 * - loadCategoriesProgressively: Dynamically loads voting categories into the UI
 * - setupVoting: Initializes vote input fields and their event listeners
 * - validateInput: Ensures individual vote inputs are valid
 * - saveVotesToLocalStorage / loadVotesFromLocalStorage: Manages vote persistence
 * - submitVotes: Handles the entire vote submission process
 * - submitToVercelKV / submitToGoogleSheets: Submits votes to different storage systems
 * - init: Initializes the entire application
 * 
 * This file interacts with various utility modules and constants to maintain
 * a modular and maintainable codebase. It's the central point of coordination
 * for the voting application's client-side functionality.
 */

import { CATEGORIES, THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageUtils.js';
import { validateVotes } from './utils/validationUtils.js';
console.log("script.js loading");

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

async function getSettings() {
    try {
        const settings = await fetchData('/api/get-settings');
        
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            const categorySettings = settings.dishesPerCategory[category] || {};
            acc[category] = {
                min: categorySettings.min || 1,
                max: categorySettings.max || 50
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching settings:', error);
        showToast('Error loading settings. Using default values.', 'error');
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {});
    }
}

async function loadCategoriesProgressively() {
    const skeletonLoader = document.getElementById('loading-spinner');
    const categoriesContainer = document.getElementById('categories');
    
    if (!categoriesContainer) {
        console.error('Categories container not found');
        return;
    }

    skeletonLoader.style.display = 'flex';
    categoriesContainer.innerHTML = '';

    try {
        for (let category of CATEGORIES) {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');
            categoryDiv.innerHTML = `
                <h2>${category}</h2>
                <p>Enter up to two dish numbers that were your favorite:</p>
                ${Array(2).fill().map(() => `
                    <input type="text" 
                        class="vote-input" 
                        data-category="${category}" 
                        placeholder="e.g., 1" 
                        pattern="[0-9]*" 
                        inputmode="numeric"
                        maxlength="2">
                `).join('')}
            `;
            
            categoriesContainer.appendChild(categoryDiv);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories. Please refresh the page.', 'error');
    } finally {
        skeletonLoader.style.display = 'none';
    }

    setupVoting();
    loadVotesFromLocalStorage();
}

function setupVoting() {
    document.querySelectorAll('.vote-input').forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            validateInput(this);
            saveVotesToLocalStorage();
        });
    });
}

function validateInput(input) {
    const value = parseInt(input.value);
    const category = input.dataset.category;
    const max = DISHES_PER_CATEGORY[category]?.max || 99;

    if (input.value === '') return;

    if (isNaN(value) || value < 1 || value > max) {
        input.value = '';
        showToast(`Please enter a number between 1 and ${max} for ${category}`, 'error');
    }
}

function saveVotesToLocalStorage() {
    const votes = {};
    CATEGORIES.forEach(category => {
        const inputs = document.querySelectorAll(`.vote-input[data-category="${category}"]`);
        votes[category] = Array.from(inputs)
            .map(input => parseInt(input.value))
            .filter(value => !isNaN(value));
    });
    saveToLocalStorage('currentVotes', votes);
}

function loadVotesFromLocalStorage() {
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

function displayVoteSummary(votes) {
    let summary = 'Your Vote Summary:\n\nYou selected the following as your favorite dishes:';
    
    if (!votes || Object.keys(votes).length === 0) {
        return summary + 'No votes found. Please make your selections.';
    }

    for (const category of CATEGORIES) {
        const selections = votes[category] || [];
        if (selections.length > 0) {
            summary += `\nIn the ${category}:\n`;
            selections.forEach(dish => summary += `  Dish #${dish}\n`);
        }
    }
    
    return summary;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, setting up event listeners");
    
    const submitButton = document.getElementById('submitVotes');
    if (submitButton) {
        console.log("Submit button found, adding event listener");
        submitButton.addEventListener('click', submitVotes);
    } else {
        console.error("Submit button not found");
    }

    init().catch(error => {
        console.error("Unhandled error in init:", error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});

async function submitVotes(e) {
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

async function submitToVercelKV(votes) {
    console.log("Sending votes to /api/vote:", votes);
    const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(votes),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return await response.json();
}

function submitToGoogleSheets(votes) {
    return new Promise((resolve, reject) => {
        // Create a hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbzXFKZVM1EhLT8b7sz21RY5u2AzrpwktrkmGTz6UV5DXS-nQEk0MFGZGQT0pIcQJjMz/exec';
        form.target = 'hidden-iframe';

        // Create a hidden input to hold the votes data
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(votes);
        form.appendChild(input);

        // Create or reuse a hidden iframe for the form submission
        let iframe = document.getElementById('hidden-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        // Set up success handler
        iframe.onload = () => {
            document.body.removeChild(form);
            resolve();
        };

        // Set up error handler
        iframe.onerror = () => {
            document.body.removeChild(form);
            reject(new Error('Failed to submit to Google Sheets'));
        };

        // Submit the form
        document.body.appendChild(form);
        form.submit();
    });
}

async function init() {
    document.querySelector('h1').textContent = THEME;
    try {
        await getSettings();
        await loadCategoriesProgressively();
    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
    }
}

// Initialize the application
init().catch(error => {
    console.error("Unhandled error in init:", error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});
console.log("script.js loaded");
