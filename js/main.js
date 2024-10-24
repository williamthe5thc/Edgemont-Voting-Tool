// main.js
document.addEventListener('DOMContentLoaded', async () => {
    const preloader = new Preloader();
    try {
        // Start the preloader and get its promise
        const preloaderPromise = preloader.start();
        
        // Fetch settings first
        console.log("Fetching settings");
        const settings = await getSettings();
        console.log("Received settings in main:", settings);
        
        if (settings && settings.dishesPerCategory) {
            setDishesPerCategory(settings.dishesPerCategory);
        } else {
            console.error("Invalid settings structure:", settings);
            showToast('Error loading settings. Using default values.', 'error');
        }
        
        // Load categories with the preloader reference
        await loadCategoriesProgressively(preloader);
        
        // Wait for the preloader to complete
        await preloaderPromise;
        
        // Setup the rest of the application
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
});
