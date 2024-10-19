// Import utility functions for data fetching and toast notifications
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

/**
 * Fetches and displays the voting results.
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

// Initialize results display when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});