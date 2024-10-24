// main.js

import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';
import { Preloader } from './preloader.js';
import { init } from './categoryLoader.js';


console.log("loading main.js");
document.addEventListener('DOMContentLoaded', () => {
    const preloader = new Preloader();
    preloader.start();
});
document.addEventListener('preloaderComplete', () => {
  // Initialize the main application
  init();
});
/**
 * Initializes the application
 */
export const init = async () => {
    console.log("Initializing application");
    // Set the page title to the competition theme
    document.querySelector('h1').textContent = THEME;
    
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
};
