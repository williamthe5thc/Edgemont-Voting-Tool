// results-display.js
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';
import { CATEGORIES } from './constants.js';

console.log("results-display.js loading");

function createCategoryResult(category, dishes) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-results section';
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category;
    categoryElement.appendChild(categoryTitle);

    const resultsList = document.createElement('div');
    resultsList.className = 'results-list';

    // Create result entries
    dishes.forEach(dish => {
        const rankElement = document.createElement('div');
        rankElement.className = `result-entry rank-${dish.rank}`;

        let rankText;
        switch (dish.rank) {
            case 1:
                rankText = '🥇 First Place';
                break;
            case 2:
                rankText = '🥈 Second Place';
                break;
            case 3:
                rankText = '🥉 Third Place';
                break;
            default:
                rankText = `#${dish.rank}`;
        }

        rankElement.innerHTML = `
            <div class="rank-info">
                <span class="rank-text">${rankText}</span>
                <span class="dish-number">Dish #${dish.dishNumber}</span>
            </div>
            <div class="vote-count">${dish.votes} vote${dish.votes !== 1 ? 's' : ''}</div>
        `;

        resultsList.appendChild(rankElement);
    });

    // If no results, show a message
    if (!dishes.length) {
        const noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = 'No votes recorded for this category yet';
        resultsList.appendChild(noResults);
    }

    categoryElement.appendChild(resultsList);
    return categoryElement;
}

async function displayResults() {
    const resultsContainer = document.getElementById('results');
    
    try {
        // Show loading state
        resultsContainer.innerHTML = '<div class="loading">Loading results...</div>';
        
        // Fetch results from the API
        const results = await fetchData('/api/results');
        console.log('Fetched results:', results);
        
        resultsContainer.innerHTML = '';

        // Handle no votes case
        if (results.message === 'No votes recorded yet') {
            resultsContainer.innerHTML = '<div class="no-votes">No votes have been recorded yet.</div>';
            return;
        }

        // Create header section
        const header = document.createElement('div');
        header.className = 'results-header';
        header.innerHTML = `
            <h1>Competition Results</h1>
            <p class="subtitle">Top 3 Dishes in Each Category</p>
        `;
        resultsContainer.appendChild(header);

        // Display results for each category
        CATEGORIES.forEach(category => {
            const categoryResults = results.categories[category] || [];
            resultsContainer.appendChild(createCategoryResult(category, categoryResults));
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        resultsContainer.innerHTML = '<div class="error">Unable to load results at this time.</div>';
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