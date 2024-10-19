// client-utils.js
console.log('client-utils.js is being loaded');

// Define constants for categories and theme
export const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée'
];

export const THEME = "Dia de Los Ancestros";

/**
 * Retrieves data from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @returns {any|null} The parsed value from localStorage or null if not found
 */
export function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        showToast('Failed to retrieve local data', 'error');
        return null;
    }
}

/**
 * Saves data to localStorage
 * @param {string} key - The key to use in localStorage
 * @param {any} value - The value to store
 */
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Failed to save data locally', 'error');
    }
}

/**
 * Displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (e.g., 'info', 'error', 'success')
 */
export function showToast(message, type = 'info') {
    console.log(`Toast: ${type} - ${message}`);
    
    const toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toastContainer.appendChild(toast);
    
    // Force a reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
        }, { once: true });
    }, 3000);
}

/**
 * Fetches data from a given URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<any>} The parsed JSON response
 */
export async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

/**
 * Validates the votes object
 * @param {Object} votes - The votes object to validate
 * @returns {Object} An object containing isValid flag and invalidCategories array
 */
export function validateVotes(votes) {
    let isValid = true;
    let invalidCategories = [];

    CATEGORIES.forEach(category => {
        const categoryVotes = votes[category] || [];
        if (categoryVotes.length > 2) {
            isValid = false;
            invalidCategories.push(category);
        } else if (categoryVotes.length === 2 && categoryVotes[0] === categoryVotes[1]) {
            isValid = false;
            invalidCategories.push(`${category} (duplicate selection)`);
        }
    });

    return { isValid, invalidCategories };
}

console.log('end of client utils');
