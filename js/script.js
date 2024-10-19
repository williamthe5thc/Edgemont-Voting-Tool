/**
 * script.js
 * 
 * This file contains the main logic for the voting application's user interface.
 * It handles the following key functionalities:
 * 
 * 1. Fetching and applying competition settings
 * 2. Dynamically loading voting categories
 * 3. Managing user input for votes
 * 4. Saving and loading votes from local storage
 * 5. Validating user votes
 * 6. Submitting votes to both Vercel KV and Google Sheets
 * 7. Displaying vote summaries and feedback to users
 * 
 * The script interacts with various utility modules to handle storage,
 * UI updates, API calls, and validation. It also uses constants defined
 * in a separate module to maintain consistency across the application.
 */

import { CATEGORIES, THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageUtils.js';
import { validateVotes } from './utils/validationUtils.js';

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

/**
 * Fetches competition settings from the server and sets up DISHES_PER_CATEGORY
 * If fetching fails, it uses default values
 * DISHES_PER_CATEGORY structure: { category: { min: number, max: number } }
 */
async function getSettings() {
    try {
        const settings = await fetchData('/api/get-settings');
        
        // Set up DISHES_PER_CATEGORY based on fetched settings or use defaults
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
        // Use default values if fetching fails
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {});
    }
}

/**
 * Loads voting categories progressively with a loading animation
 * Creates input fields for each category based on the competition settings
 */
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
            // Small delay for progressive loading effect
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

async function submitVotes(e) {
    e.preventDefault();
    
    saveVotesToLocalStorage();
    const votes = getFromLocalStorage('currentVotes');
    
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
        await submitToVercelKV(votes);
        await submitToGoogleSheets(votes);

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
    const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(votes),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}


/**
 * Submits votes to Google Sheets via a hidden form submission
 * This method is used to provide redundancy in vote storage
 * @param {Object} votes - The votes object to submit
 * @returns {Promise} A promise that resolves when the submission is complete
 */
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

/**
 * Initializes the application
 * Sets the competition theme, fetches settings, and loads categories
 */
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

// Event listener for vote submission
document.getElementById('submitVotes').addEventListener('click', submitVotes);

// Initialize the application
init().catch(error => {
    console.error("Unhandled error in init:", error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});
