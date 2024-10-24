/**
 * uiUtils.js
 * 
 * This utility file provides functions for common UI operations,
 * particularly focused on displaying toast notifications.
 */

console.log("uiUtils.js loading");

/**
 * Displays a toast notification
 * @param {string} message - The message to display
 * @param {string} [type='info'] - The type of toast (e.g., 'info', 'error', 'success')
 * @param {string} [category='general'] - The category of the toast (e.g., 'general', 'Bread', 'Appetizers')
 */
export function showToast(message, type = 'info', category = 'general') {
    console.log(`Attempting to show toast: ${type} - ${message} for category: ${category}`);
    
    const toastContainerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let toastContainer = document.getElementById(toastContainerId);
    
    // Create a general toast container if it doesn't exist
    if (!toastContainer && category === 'general') {
        console.log('Creating new general toast container');
        toastContainer = createToastContainer(toastContainerId);
        document.body.appendChild(toastContainer);
        console.log('General toast container created and appended to body');
    }
    
    if (!toastContainer) {
        console.error(`Toast container not found. Category: ${category}`);
        return;
    }
    
    console.log(`Toast container found for ${category}`);
    
    const toast = createToastElement(message, type);
    
    // Insert the new toast at the beginning of the container
    toastContainer.insertBefore(toast, toastContainer.firstChild);
    console.log(`Toast prepended to container for ${category}`);
    
    // Force a reflow to ensure transition works
    toast.offsetHeight;
    
    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
        console.log(`Show class added to toast for ${category}`);
    });
    
    // Set up toast removal after a delay
    setupToastRemoval(toast, toastContainer, category);

    // Limit the number of visible toasts
    limitVisibleToasts(toastContainer, category);
}

/**
 * Creates a toast container element
 * @param {string} id - The ID for the container
 * @returns {HTMLElement} The created toast container
 */
function createToastContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column-reverse';
    return container;
}

/**
 * Creates a toast element
 * @param {string} message - The message for the toast
 * @param {string} type - The type of toast
 * @returns {HTMLElement} The created toast element
 */
function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    return toast;
}

/**
 * Sets up the removal of a toast after a delay
 * @param {HTMLElement} toast - The toast element
 * @param {HTMLElement} container - The toast container
 * @param {string} category - The category of the toast
 */
function setupToastRemoval(toast, container, category) {
    setTimeout(() => {
        console.log(`Preparing to remove toast for ${category}`);
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            container.removeChild(toast);
            console.log(`Toast removed for ${category}`);
        }, { once: true });
    }, 10000);
}

/**
 * Limits the number of visible toasts in a container
 * @param {HTMLElement} container - The toast container
 * @param {string} category - The category of the toasts
 */
function limitVisibleToasts(container, category) {
    const maxVisibleToasts = 3;
    const toasts = container.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        container.removeChild(toasts[toasts.length - 1]);
        console.log(`Excess toast removed for ${category}`);
    }
}

console.log("uiUtils.js loaded");
