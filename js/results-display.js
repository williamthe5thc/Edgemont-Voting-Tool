/**
 * results-display.js
 * 
 * This file handles the display of voting results for the cooking competition.
 * It includes the following main functionalities:
 * 
 * 1. Fetching voting results from the API
 * 2. Dynamically generating and displaying result content
 * 3. Handling cases where no votes have been recorded
 * 4. Error handling and displaying appropriate messages to users
 * 
 * Functions:
 * - displayResults: Main function to fetch and display voting results
 * 
 * The script uses utility functions for API calls and UI updates,
 * ensuring a smooth user experience when viewing competition results.
 */

// Import utility functions for data fetching and toast notifications
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

console.log("results-display.js loading");

/**
 * Fetches and displays the voting results.
 * @async
 * @function displayResults
 * @returns {Promise<void>}
 * 
 * This function:
 * 1. Fetches results from the API
 * 2. Clears any existing content in the results container
 * 3. Handles the case where no votes have been recorded
 * 4. Iterates through each category and displays the top dishes
 * 5. Handles any errors that occur during the process
 */
async function displayResults() {
    try {
        // Fetch results from the API
        const results = await fetchData('/api/results');
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Display a message if no votes have been recorded
        if (results.message === 'No votes recorded yet') {
            resultsContainer.textContent = 'No votes have been recorded yet.';
            return;
        }

        // Iterate through each category and display results
        for (const [category, dishes] of Object.entries(results)) {
            const categoryElement = document.createElement('div');
            categoryElement.innerHTML = `<h2>${category}</h2>`;

            dishes.forEach((dish, index) => {
                if (dish && typeof dish.score === 'number') {
                    const dishElement = document.createElement('p');
                    dishElement.textContent = `${index + 1}. ${dish.dish} (Score: ${dish.score.toFixed(2)})`;
                    categoryElement.appendChild(dishElement);
                } else {
                    console.warn(`Invalid dish data for ${category}:`, dish);
                }
            });

            resultsContainer.appendChild(categoryElement);
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        document.getElementById('results').textContent = 'Unable to load results at this time.';
    }
}

/**
 * Event listener for DOMContentLoaded
 * 
 * This ensures that the displayResults function is called only after
 * the DOM is fully loaded and ready to be manipulated.
 */
document.addEventListener('DOMContentLoaded', () => {
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});

console.log("results-display.js loaded");
