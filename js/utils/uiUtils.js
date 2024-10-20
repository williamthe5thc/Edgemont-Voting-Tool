/**
 * uiUtils.js
 * 
 * This utility file provides functions for common UI operations.
 * It includes:
 * 
 * 1. showToast: Displays toast notifications to the user
 * 2. Other UI-related utility functions as needed
 */
console.log("uiUtils.js loading");

/**
 * Displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (e.g., 'info', 'error', 'success')
 * @param {string} category - The category of the toast (e.g., 'general', 'Bread', 'Appetizers')
 */
export function showToast(message, type = 'info', category = 'general') {
    console.log(`Attempting to show toast: ${type} - ${message} for category: ${category}`);
    
    const toastContainerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let toastContainer = document.getElementById(toastContainerId);
    
    if (!toastContainer && category === 'general') {
        toastContainer = document.createElement('div');
        toastContainer.id = toastContainerId;
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    if (!toastContainer) {
        console.error(`Toast container not found. Category: ${category}`);
        return;
    }
    
    console.log(`Toast container found for ${category}`);
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    toastContainer.appendChild(toast);
    console.log(`Toast appended to container for ${category}`);
    
    // Force a reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
        console.log(`Show class added to toast for ${category}`);
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
            console.log(`Toast removed for ${category}`);
        }, { once: true });
    }, 5000);

    // Limit the number of visible toasts
    const maxVisibleToasts = 3;
    const toasts = toastContainer.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        toastContainer.removeChild(toasts[0]);
        console.log(`Excess toast removed for ${category}`);
    }
}

console.log("uiUtils.js loaded");
