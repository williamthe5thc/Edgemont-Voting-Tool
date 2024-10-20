/**
 * uiUtils.js
 * 
 * This utility file provides functions for common UI operations.
 * It includes:
 * 
 * 1. showToast: Displays toast notifications to the user
 * 2. Other UI-related utility functions as needed
 */
console.log("uiUtills.js loading");

/**
 * Displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (e.g., 'info', 'error', 'success')
 */

export function showToast(message, type = 'info', category = null) {
    console.log(`Toast: ${type} - ${message}`);
    
    let toastContainerId = category ? `toastContainer-${category}` : 'toastContainer';
    let toastContainer = document.getElementById(toastContainerId);
    
    if (!toastContainer) {
        console.error(`Toast container for category ${category} not found`);
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
    }, 5000);

    // Limit the number of visible toasts per category
    const maxVisibleToasts = 2;
    const toasts = toastContainer.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        toastContainer.removeChild(toasts[0]);
    }
}
console.log("uiutils loaded");

