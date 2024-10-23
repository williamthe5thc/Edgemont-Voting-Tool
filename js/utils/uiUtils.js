
// uiUtils.js
console.log("uiUtils.js loading");

export function showToast(message, type = 'info', category = 'general') {
    console.log(`Showing toast: ${message}, type: ${type}`);
    
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;

    // Get or create toast container
    const containerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let container = document.getElementById(containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.width = '100%';
        container.style.maxWidth = '400px';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.backgroundColor = type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 
                                 type === 'success' ? 'rgba(40, 167, 69, 0.9)' :
                                 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.marginTop = '10px';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease-in-out';
    toast.style.width = '90%';
    toast.style.textAlign = 'center';
    toast.textContent = message;

    // Add to container
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
            // Remove container if empty
            if (container.children.length === 0 && container.parentElement) {
                container.parentElement.removeChild(container);
            }
        }, { once: true });
    }, 5000);
}

console.log("uiUtils.js loaded");
