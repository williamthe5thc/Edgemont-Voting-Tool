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
// results-display.js
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

console.log("results-display.js loading");

async function displayResults() {
    const resultsContainer = document.getElementById('results');
    
    try {
        // Show loading state
        resultsContainer.innerHTML = '<p>Loading results...</p>';
        
        // Fetch results from the API
        const results = await fetchData('/api/results');
        console.log('Fetched results:', results);
        
        resultsContainer.innerHTML = '';

        // Handle no votes case
        if (results.message === 'No votes recorded yet') {
            resultsContainer.innerHTML = '<p class="no-votes">No votes have been recorded yet.</p>';
            return;
        }

        // Display results for each category
        Object.entries(results).forEach(([category, dishes]) => {
            if (!Array.isArray(dishes)) {
                console.warn(`Invalid data for category ${category}:`, dishes);
                return;
            }

            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-results';
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categoryElement.appendChild(categoryTitle);

            // Create a list for the dishes
            const dishesList = document.createElement('div');
            dishesList.className = 'dishes-list';

            dishes.forEach((dish, index) => {
                const dishElement = document.createElement('div');
                dishElement.className = 'dish-result';
                dishElement.innerHTML = `
                    <span class="dish-rank">#${index + 1}</span>
                    <span class="dish-name">${dish.dish}</span>
                    <span class="dish-score">${dish.score} vote${dish.score !== 1 ? 's' : ''}</span>
                `;
                dishesList.appendChild(dishElement);
            });

            categoryElement.appendChild(dishesList);
            resultsContainer.appendChild(categoryElement);
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        resultsContainer.innerHTML = '<p class="error">Unable to load results at this time.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing results display');
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});

console.log("results-display.js loaded");
