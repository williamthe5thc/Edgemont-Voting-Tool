// Import utility functions and constants
import { fetchData, showToast, CATEGORIES, THEME, saveToLocalStorage, getFromLocalStorage, validateVotes } from './client-utils.js';

// Object to store the number of dishes per category
let DISHES_PER_CATEGORY = {};

/**
 * Fetches competition settings from the server
 */
async function getSettings() {
    try {
        const response = await fetch('/api/get-settings');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const settings = await response.json();
        
        // Set up DISHES_PER_CATEGORY based on fetched settings
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
        // Set default values if fetching fails
        DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
            acc[category] = { min: 1, max: 50 };
            return acc;
        }, {});
    }
}

/**
 * Loads categories progressively and sets up the voting interface
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

/**
 * Sets up event listeners for voting inputs
 */
function setupVoting() {
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

/**
 * Saves current votes to local storage
 */
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

/**
 * Loads votes from local storage and populates input fields
 */
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

/**
 * Generates a summary of the user's votes
 * @param {Object} votes - The votes object
 * @returns {string} A formatted string summarizing the votes
 */
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

/**
 * Handles the submission of votes
 * @param {Event} e - The event object
 */
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

/**
 * Submits votes to Vercel KV
 * @param {Object} votes - The votes object
 * @returns {Promise} A promise that resolves with the response from the server
 */
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
 * Submits votes to Google Sheets
 * @param {Object} votes - The votes object
 * @returns {Promise} A promise that resolves when the submission is complete
 */
function submitToGoogleSheets(votes) {
    return new Promise((resolve, reject) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://script.google.com/macros/s/AKfycbzXFKZVM1EhLT8b7sz21RY5u2AzrpwktrkmGTz6UV5DXS-nQEk0MFGZGQT0pIcQJjMz/exec';
        form.target = 'hidden-iframe';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(votes);
        form.appendChild(input);

        let iframe = document.getElementById('hidden-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        iframe.onload = () => {
            document.body.removeChild(form);
            resolve();
        };

        iframe.onerror = () => {
            document.body.removeChild(form);
            reject(new Error('Failed to submit to Google Sheets'));
        };

        document.body.appendChild(form);
        form.submit();
    });
}

/**
 * Initializes the application
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

// Set up event listener for vote submission
document.getElementById('submitVotes').addEventListener('click', submitVotes);

// Initialize the application
init().catch(error => {
    console.error("Unhandled error in init:", error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});
