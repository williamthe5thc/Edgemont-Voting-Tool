// results-display.js
import { showToast } from './utils/uiUtils.js';
import { fetchData } from './utils/apiUtils.js';
import { CATEGORIES } from './constants.js';

console.log("results-display.js loading");

function createCategorySection(category, dishes) {
    const section = document.createElement('div');
    section.className = 'section';
    
    const title = document.createElement('h2');
    title.textContent = category;
    section.appendChild(title);

    if (!dishes || dishes.length === 0) {
        const noVotes = document.createElement('p');
        noVotes.textContent = 'No votes recorded for this category';
        section.appendChild(noVotes);
        return section;
    }

    dishes.forEach(dish => {
        const resultRow = document.createElement('div');
        resultRow.className = 'result-row';
        
        let rankSymbol;
        switch (dish.rank) {
            case 1: rankSymbol = '🥇 1st'; break;
            case 2: rankSymbol = '🥈 2nd'; break;
            case 3: rankSymbol = '🥉'; break;
            default: rankSymbol = `#${dish.rank}`;
        }

        resultRow.innerHTML = `
            <strong>${rankSymbol} Place:</strong> 
            Dish #${dish.dishNumber} 
            (${dish.votes} vote${dish.votes !== 1 ? 's' : ''})
        `;
        section.appendChild(resultRow);
    });

    return section;
}

async function displayResults() {
    const resultsContainer = document.getElementById('results');
    
    try {
        resultsContainer.innerHTML = '<p>Loading results...</p>';
        
        const results = await fetchData('/api/results');
        console.log('Fetched results:', results);
        
        resultsContainer.innerHTML = '';

        if (results.message === 'No votes recorded yet') {
            resultsContainer.innerHTML = '<p>No votes have been recorded yet.</p>';
            return;
        }

        const title = document.createElement('h1');
        title.textContent = 'Competition Results';
        resultsContainer.appendChild(title);

        CATEGORIES.forEach(category => {
            const categoryResults = results.categories[category] || [];
            resultsContainer.appendChild(createCategorySection(category, categoryResults));
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        resultsContainer.innerHTML = '<p>Unable to load results at this time.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing results display');
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});

console.log("results-display.js loaded");