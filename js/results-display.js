// results-display.js

import { showToast } from './utils/uiUtils.js';
import { makeAPIRequest, API_ENDPOINTS } from './utils/apiUtils.js';
import { UI_MESSAGES } from './utils/configUtils.js';
import { createElement, toggleVisibility } from './utils/domUtils.js';
import { aggregateVotes, calculateStatistics } from './utils/transformUtils.js';

/**
 * Creates a result section for a category
 * @param {string} category - Category name
 * @param {Array} dishes - Dish results
 * @returns {HTMLElement} Category result element
 */
function createCategoryResult(category, dishes) {
    const categoryElement = createElement('div', { className: 'category-result' }, [
        createElement('h2', {}, [category])
    ]);

    dishes.forEach((dish, index) => {
        if (dish && typeof dish.score === 'number') {
            categoryElement.appendChild(
                createElement('p', { className: 'dish-result' }, [
                    `${index + 1}. ${dish.dish} (Score: ${dish.score.toFixed(2)})`
                ])
            );
        }
    });

    return categoryElement;
}

/**
 * Creates statistics summary section
 * @param {Object} stats - Voting statistics
 * @returns {HTMLElement} Statistics element
 */
function createStatisticsSummary(stats) {
    return createElement('div', { className: 'voting-statistics' }, [
        createElement('h3', {}, ['Voting Statistics']),
        createElement('p', {}, [`Total Votes: ${stats.totalVotes}`]),
        ...Object.entries(stats.categoryStats).map(([category, catStats]) =>
            createElement('p', {}, [
                `${category}: ${catStats.total} votes from ${catStats.uniqueVoters} unique voters`
            ])
        )
    ]);
}

/**
 * Displays the voting results
 */
async function displayResults() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsContainer = document.getElementById('results');

    try {
        toggleVisibility(loadingSpinner, true);
        resultsContainer.innerHTML = '';

        const results = await makeAPIRequest(API_ENDPOINTS.RESULTS);

        if (results.message === 'No votes recorded yet') {
            resultsContainer.appendChild(
                createElement('p', { className: 'no-results' }, 
                    [UI_MESSAGES.NO_VOTES_RECORDED]
                )
            );
            return;
        }

        // Process and display results
        const aggregatedResults = aggregateVotes(results);
        const statistics = calculateStatistics(results);

        // Create and append statistics summary
        resultsContainer.appendChild(createStatisticsSummary(statistics));

        // Create and append category results
        Object.entries(aggregatedResults).forEach(([category, dishes]) => {
            resultsContainer.appendChild(createCategoryResult(category, dishes));
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        showToast(UI_MESSAGES.ERROR_LOADING_RESULTS, 'error');
        resultsContainer.appendChild(
            createElement('p', { className: 'error-message' }, 
                [UI_MESSAGES.RESULTS_LOAD_ERROR]
            )
        );
    } finally {
        toggleVisibility(loadingSpinner, false);
    }
}

// Initialize results display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast(UI_MESSAGES.UNEXPECTED_ERROR, 'error');
    });
});
