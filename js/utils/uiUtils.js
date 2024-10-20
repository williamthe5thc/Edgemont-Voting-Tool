export function showToast(message, type = 'info', category = 'general') {
    console.log(`Attempting to show toast: ${type} - ${message} for category: ${category}`);
    
    const toastContainerId = category === 'general' ? 'toastContainer' : `toastContainer-${category}`;
    let toastContainer = document.getElementById(toastContainerId);
    
    if (!toastContainer && category === 'general') {
        console.log('Creating new general toast container');
        toastContainer = document.createElement('div');
        toastContainer.id = toastContainerId;
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.zIndex = '1000';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column-reverse';
        document.body.appendChild(toastContainer);
        console.log('General toast container created and appended to body');
    }
    
    if (!toastContainer) {
        console.error(`Toast container not found. Category: ${category}`);
        return;
    }
    
    console.log(`Toast container found for ${category}`);
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Insert the new toast at the beginning of the container
    toastContainer.insertBefore(toast, toastContainer.firstChild);
    console.log(`Toast prepended to container for ${category}`);
    
    // Force a reflow
    toast.offsetHeight;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
        console.log(`Show class added to toast for ${category}`);
    });
    
    setTimeout(() => {
        console.log(`Preparing to remove toast for ${category}`);
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toastContainer.removeChild(toast);
            console.log(`Toast removed for ${category}`);
        }, { once: true });
    }, 10000);

    // Limit the number of visible toasts
    const maxVisibleToasts = 3;
    const toasts = toastContainer.getElementsByClassName('toast');
    if (toasts.length > maxVisibleToasts) {
        toastContainer.removeChild(toasts[toasts.length - 1]);
        console.log(`Excess toast removed for ${category}`);
    }
}
console.log("uiUtils finished loading");
