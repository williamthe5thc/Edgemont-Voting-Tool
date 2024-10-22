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
/**
 * Initializes the application
 * @async
 * @function init
 * @returns {Promise<void>}
 * 
 * This function is responsible for setting up the entire voting interface:
 * 1. Sets the page title to the competition theme
 * 2. Fetches competition settings from the server
 * 3. Loads the voting categories into the UI
 * 4. Sets up event listeners for the voting inputs
 * 5. Loads any previously saved votes from local storage
 * 6. Sets up the submit button event listener
 */
async function init() {
    console.log("Initializing application");
    // Set the page title to the competition theme
    document.querySelector('h1').textContent = THEME;
    try {
        console.log("Fetching settings");
        // Get the competition settings from the server
        const settings = await getSettings();
        console.log("Received settings in main:", settings);
        if (settings && settings.dishesPerCategory) {
            // Set the number of dishes per category based on the settings
            setDishesPerCategory(settings.dishesPerCategory);
        } else {
            console.error("Invalid settings structure:", settings);
            showToast('Error loading settings. Using default values.', 'error');
        }
        console.log("Settings fetched, loading categories");
        // Load the voting categories into the UI
        await loadCategoriesProgressively();
        console.log("Categories loaded");
        // Set up event listeners for the voting inputs
        setupVoting();
        // Load any previously saved votes from local storage
        loadVotesFromLocalStorage();
        
        // Set up the submit button event listener
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

/**
 * Event listener for DOMContentLoaded
 * 
 * This ensures that the init function is called only after
 * the DOM is fully loaded and ready to be manipulated.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing application");
    init().catch(error => {
        console.error("Unhandled error in init:", error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});
