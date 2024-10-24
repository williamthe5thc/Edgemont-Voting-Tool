// uiUtils.js

export function showToast(message, type = 'info', category = 'general') {
    console.log(`Attempting to show toast: ${type} - ${message} for category: ${category}`);
    
    // Find or create the toast container for this category
    let toastContainer;
    
    if (category !== 'general') {
        // Find the category container first
        const categoryElement = Array.from(document.getElementsByClassName('category'))
            .find(el => el.querySelector(`input[data-category="${category}"]`));
            
        if (categoryElement) {
            // Look for existing toast container in this category
            toastContainer = categoryElement.querySelector('.toast-container');
            
            // Create new toast container if it doesn't exist
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                // Insert after the inputs
                const inputs = categoryElement.querySelector('.space-y-4');
                if (inputs) {
                    inputs.parentNode.insertBefore(toastContainer, inputs.nextSibling);
                } else {
                    categoryElement.appendChild(toastContainer);
                }
            }
        } else {
            console.error(`Category element not found for: ${category}`);
            return;
        }
    } else {
        // Handle general toasts (not category specific)
        toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }
    
    // Create the toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Add to container
    toastContainer.insertBefore(toast, toastContainer.firstChild);
    
    // Force a reflow
    toast.offsetHeight;
    
    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove the toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
            // Clean up empty category-specific containers
            if (category !== 'general' && toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, { once: true });
    }, 5000);
    
    // Limit number of visible toasts
    const maxVisibleToasts = 3;
    const toasts = toastContainer.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        toastContainer.removeChild(toasts[toasts.length - 1]);
    }
}
