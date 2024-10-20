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
 * The script uses utility functions for API calls and UI updates,
 * ensuring a smooth user experience when viewing competition results.
 */

import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

console.log("results-display.js loading");

async function displayResults() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsContainer = document.getElementById('results');

    try {
        loadingSpinner.style.display = 'flex';
        resultsContainer.innerHTML = '';

        const results = await fetchData('/api/results');

        if (results.message === 'No votes recorded yet') {
            resultsContainer.innerHTML = '<p class="message">No votes have been recorded yet.</p>';
            return;
        }

        for (const [category, dishes] of Object.entries(results)) {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('section');
            categoryElement.innerHTML = `<h2>${category}</h2>`;

            const resultsList = document.createElement('ul');
            resultsList.classList.add('results-list');

            dishes.forEach((dish, index) => {
                if (dish && typeof dish.score === 'number') {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${index + 1}. ${dish.dish} (Score: ${dish.score.toFixed(2)})`;
                    resultsList.appendChild(listItem);
                } else {
                    console.warn(`Invalid dish data for ${category}:`, dish);
                }
            });

            categoryElement.appendChild(resultsList);
            resultsContainer.appendChild(categoryElement);
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        resultsContainer.innerHTML = '<p class="message">Unable to load results at this time.</p>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});

console.log("results-display.js loaded");
console.log("results-display.js loaded");
