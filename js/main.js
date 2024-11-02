import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';
import { Preloader } from './preloader.js';

async function init() {
    console.log("Initializing application");
    
    // Create preloader instance
    const preloader = new Preloader();
    const preloaderPromise = preloader.start();
    
    try {
        // Set the page title
        document.querySelector('h1').textContent = THEME;
        
        // Simulate initial progress
        preloader.updateProgress(20);
        
        // Fetch settings
        const settings = await getSettings();
        preloader.updateProgress(40);
        
        if (settings && settings.dishesPerCategory) {
            setDishesPerCategory(settings.dishesPerCategory);
        } else {
            console.error("Invalid settings structure:", settings);
            showToast('Error loading settings. Using default values.', 'error');
        }
        
        // Load categories
        preloader.updateProgress(60);
        await loadCategoriesProgressively();
        preloader.updateProgress(80);
        
        // Setup voting functionality
        setupVoting();
        loadVotesFromLocalStorage();
        
        // Set up submit button
        const submitButton = document.getElementById('submitVotes');
        if (submitButton) {
            submitButton.addEventListener('click', submitVotes);
        } else {
            console.error("Submit button not found");
        }
        
        // Ensure everything is loaded before completing
        preloader.updateProgress(100);
        
        // Wait for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM fully loaded, initializing application");
        init().catch(error => {
            console.error("Unhandled error in init:", error);
            showToast('An unexpected error occurred. Please refresh the page.', 'error');
        });
    });
} else {
    init().catch(error => {
        console.error("Unhandled error in init:", error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
}