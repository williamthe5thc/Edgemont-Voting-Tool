import { THEME } from './constants.js';
import { showToast } from './utils/uiUtils.js';
import { getSettings, loadCategoriesProgressively } from './categoryLoader.js';
import { setupVoting, loadVotesFromLocalStorage, submitVotes, setDishesPerCategory } from './voteSubmitter.js';

async function init() {
    console.log("Initializing application");
    
    const preloader = window.preloader;
    
    try {
        // Set the page title
        document.querySelector('h1').textContent = THEME;
        
        // Fetch settings
        preloader.updateProgress(20);
        const settings = await getSettings();
        console.log('Settings loaded');
        
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
        console.log('Categories loaded');
        
        preloader.updateProgress(80);
        // Setup voting functionality
        setupVoting();
        loadVotesFromLocalStorage();
        console.log('Voting setup complete');
        
        // Set up submit button
        const submitButton = document.getElementById('submitVotes');
        if (submitButton) {
            submitButton.addEventListener('click', submitVotes);
        } else {
            console.error("Submit button not found");
        }
        
        // Hide loading spinner
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Ensure all content is visible
        document.querySelector('.container').style.opacity = '1';
        
        // Complete loading with a small delay to ensure smooth transition
        console.log('Completing initialization...');
        preloader.updateProgress(100);
        
        // Give a small delay before completing
        await new Promise(resolve => setTimeout(resolve, 300));
        preloader.complete();
        console.log('Initialization complete');
        
    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
        preloader.complete(); // Ensure preloader is removed even on error
    }
}

// Start initialization immediately
init().catch(error => {
    console.error("Unhandled error in init:", error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
    if (window.preloader) {
        window.preloader.complete();
    }
});