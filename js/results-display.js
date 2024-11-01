// results-display.js

import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';

/**
 * Creates a result section for a category
 * @param {string} category - Category name
 * @param {Array} dishes - Dish results
 * @returns {HTMLElement} Category result element
 */
function createCategoryResult(category, dishes) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-result';
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category;
    categoryElement.appendChild(categoryTitle);

    if (Array.isArray(dishes)) {
        dishes.forEach((dish, index) => {
            if (dish && typeof dish.dishNumber === 'number') {
                const dishElement = document.createElement('p');
                dishElement.className = 'dish-result';
                dishElement.textContent = `Dish #${dish.dishNumber}: ${dish.votes} votes`;
                categoryElement.appendChild(dishElement);
            }
        });
    }

    return categoryElement;
}

/**
 * Creates statistics summary section
 * @param {Object} stats - Voting statistics
 * @returns {HTMLElement} Statistics element
 */
function createStatisticsSummary(stats) {
    const statsElement = document.createElement('div');
    statsElement.className = 'voting-statistics';
    
    const statsTitle = document.createElement('h3');
    statsTitle.textContent = 'Voting Statistics';
    statsElement.appendChild(statsTitle);

    const totalVotes = document.createElement('p');
    totalVotes.textContent = `Total Votes: ${stats.totalVotes || 0}`;
    statsElement.appendChild(totalVotes);

    if (stats.categoryStats) {
        Object.entries(stats.categoryStats).forEach(([category, catStats]) => {
            const categoryStats = document.createElement('p');
            categoryStats.textContent = `${category}: ${catStats.total || 0} votes`;
            statsElement.appendChild(categoryStats);
        });
    }

    return statsElement;
}

/**
 * Displays the voting results
 */
async function displayResults() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsContainer = document.getElementById('results');

    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }

    try {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        resultsContainer.innerHTML = '';

        // Fetch results using fetchData from apiUtils
        const results = await fetchData('/api/results');
        console.log('Fetched results:', results);

        if (results.message === 'No votes recorded yet') {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = 'No votes have been recorded yet.';
            resultsContainer.appendChild(noResults);
            return;
        }

        // Add statistics if available
        if (results.statistics) {
            resultsContainer.appendChild(createStatisticsSummary(results.statistics));
        }

        // Add results by category
        if (results.results) {
            Object.entries(results.results).forEach(([category, dishes]) => {
                resultsContainer.appendChild(createCategoryResult(category, dishes));
            });
        }

    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Failed to load results. Please try again later.', 'error');
        
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to load results. Please try again later.';
        resultsContainer.appendChild(errorMessage);
    } finally {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Initialize results display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing results display');
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});