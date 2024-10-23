// uiUtils.js
export function showToast(message, type = 'info', category = 'general') {
    // Ensure we're operating in the browser environment
    if (typeof document === 'undefined') return;

    const toastContainerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let toastContainer = document.getElementById(toastContainerId);
    
    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = toastContainerId;
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Force a reflow
    toast.offsetHeight;
    
    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
        }, { once: true });
    }, 5000);
}
