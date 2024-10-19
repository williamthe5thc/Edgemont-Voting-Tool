/**
 * uiUtils.js
 * 
 * This utility file should provide functions for common UI operations.
 * It's expected to include:
 * 
 * 1. showToast: Displays toast notifications to the user
 * 2. Other UI-related utility functions as needed
 * 
 * Note: The current content of this file appears to be incorrect.
 * It should be updated to include the appropriate UI utility functions.
 */

import { showToast } from './uiUtils.js';
// uiUtils.js

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
