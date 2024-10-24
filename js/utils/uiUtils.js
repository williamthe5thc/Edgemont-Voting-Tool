// uiUtils.js
export function showToast(message, type = 'info', category = 'general') {
    console.log(`Attempting to show toast: ${type} - ${message} for category: ${category}`);
    
    // Find the category container first
    const categoryContainer = category !== 'general' 
        ? document.querySelector(`[data-category="${category}"]`)?.closest('.category')
        : null;
        
    // Get or create toast container
    const toastContainerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let toastContainer = document.getElementById(toastContainerId);
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = toastContainerId;
        toastContainer.className = 'toast-container';
        
        if (category === 'general') {
            // General toasts go at the top of the page
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.left = '50%';
            toastContainer.style.transform = 'translateX(-50%)';
            toastContainer.style.zIndex = '1000';
            document.body.appendChild(toastContainer);
        } else if (categoryContainer) {
            // Category-specific toasts go under the inputs
            const inputs = categoryContainer.querySelectorAll('.vote-input');
            const lastInput = inputs[inputs.length - 1];
            if (lastInput) {
                lastInput.parentNode.insertBefore(toastContainer, lastInput.nextSibling);
            } else {
                categoryContainer.appendChild(toastContainer);
            }
        } else {
            console.error(`Category container not found for: ${category}`);
            return;
        }
    }
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Insert the new toast at the beginning
    toastContainer.insertBefore(toast, toastContainer.firstChild);
    
    // Force a reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
            // Remove container if empty and category-specific
            if (category !== 'general' && toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, { once: true });
    }, 5000);
    
    // Limit visible toasts
    const maxVisibleToasts = 3;
    const toasts = toastContainer.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        toastContainer.removeChild(toasts[toasts.length - 1]);
    }
}
