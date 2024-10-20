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
    
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.backgroundColor = type === 'error' ? '#ff6b6b' : '#4caf50';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.marginBottom = '10px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    
    toastContainer.appendChild(toast);
    
    // Force a reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
        }, { once: true });
    }, 3000);
}
console.log("uiutils loaded");

