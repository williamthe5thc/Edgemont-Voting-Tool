// uiUtils.js
console.log("uiUtils.js loading");

export function showToast(message, type = 'info', category = 'general') {
    console.log(`Showing toast: ${message}, type: ${type}, category: ${category}`);
    
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;

    // Get the appropriate container based on category
    let container;
    if (category === 'general') {
        container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    } else {
        // Find the category section and its toast container
        const categorySection = Array.from(document.getElementsByClassName('category'))
            .find(section => section.querySelector(`[data-category="${category}"]`));
            
        if (categorySection) {
            container = categorySection.querySelector('.toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                // Insert after the last input in the category
                const lastInput = categorySection.querySelector('.vote-input:last-of-type');
                if (lastInput) {
                    lastInput.parentNode.insertBefore(container, lastInput.nextSibling);
                } else {
                    categorySection.appendChild(container);
                }
            }
        } else {
            console.warn(`Category section not found for: ${category}`);
            return;
        }
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
            // Only remove container if it's empty and not a category-specific container
            if (container.children.length === 0 && category === 'general' && container.parentElement) {
                container.parentElement.removeChild(container);
            }
        }, { once: true });
    }, 5000);
}

console.log("uiUtils.js loaded");
