/**
 * main.js
 * 
 * This is the main entry point for the voting application.
 * It handles the initialization of the app, including setting up the UI,
 * loading competition settings, and setting up event listeners.
 * 
 * Functions:
 * - init: Initializes the application
 * 
 * This file coordinates the following actions:
 * 1. Setting the page title
 * 2. Fetching competition settings
 * 3. Loading voting categories
 * 4. Setting up voting functionality
 * 5. Loading any saved votes
 * 6. Setting up the submit button
 */

import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';
console.log("loading main.js");
export async function initApp() {  // Changed function name to be more explicit
    console.log("Initializing application");
    try {
        console.log("Fetching settings");
        const settings = await getSettings();
        console.log("Received settings in main:", settings);
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

// Export a default object for compatibility
export default {
    initApp
};
});
