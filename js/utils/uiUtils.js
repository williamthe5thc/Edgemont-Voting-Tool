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
    
    // Use setTimeout to add the 'show' class in the next frame
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
        }, { once: true });
    }, 3000);
}

console.log("uiUtils.js loaded");

