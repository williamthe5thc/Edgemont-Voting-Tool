/**
 * main.js
 * 
 * This is the main entry point for the voting application.
 */

import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';
import { Preloader } from './preloader.js';

async function init() {
    console.log("Initializing application");
    
    // Initialize and start the preloader
    const preloader = new Preloader();
    await preloader.start();
    
    try {
        // Set the page title
        document.querySelector('h1').textContent = THEME;
        
        // Update preloader progress as we fetch settings
        preloader.updateProgress(20);
        const settings = await getSettings();
        
        preloader.updateProgress(40);
        console.log("Received settings in main:", settings);
        
        if (settings && settings.dishesPerCategory) {
            setDishesPerCategory(settings.dishesPerCategory);
        } else {
            console.error("Invalid settings structure:", settings);
            showToast('Error loading settings. Using default values.', 'error');
        }
        
        preloader.updateProgress(60);
        await loadCategoriesProgressively();
        
        preloader.updateProgress(80);
        setupVoting();
        loadVotesFromLocalStorage();
        
        // Set up the submit button
        const submitButton = document.getElementById('submitVotes');
        if (submitButton) {
            submitButton.addEventListener('click', submitVotes);
        } else {
            console.error("Submit button not found");
        }
        
        // Complete the loading process
        preloader.updateProgress(100);

    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing application");
    init().catch(error => {
        console.error("Unhandled error in init:", error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});