// main.js

import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';

async function init() {
    console.log("Initializing application");
    document.querySelector('h1').textContent = THEME;
    try {
        console.log("Fetching settings");
        const settings = await getSettings();
        console.log("Received settings in main:", settings); // Add this line for debugging
        if (settings && settings.dishesPerCategory) {
            setDishesPerCategory(settings.dishesPerCategory);
        } else {
            console.error("Invalid settings structure:", settings);
            showToast('Error loading settings. Using default values.', 'error');
        }
        console.log("Settings fetched, loading categories");
        await loadCategoriesProgressively();
        console.log("Categories loaded");
        setupVoting();
        loadVotesFromLocalStorage();
        
        const submitButton = document.getElementById('submitVotes');
        if (submitButton) {
            submitButton.addEventListener('click', submitVotes);
        } else {
            console.error("Submit button not found");
        }
    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing application");
    init().catch(error => {
        console.error("Unhandled error in init:", error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});
