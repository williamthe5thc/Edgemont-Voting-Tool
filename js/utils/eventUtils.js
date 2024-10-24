
// eventUtils.js

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Adds event listener with cleanup
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}

/**
 * Creates a custom event emitter
 * @returns {Object} Event emitter methods
 */
export function createEventEmitter() {
    const events = {};
    
    return {
        on(event, callback) {
            if (!events[event]) events[event] = [];
            events[event].push(callback);
            return () => this.off(event, callback);
        },
        
        off(event, callback) {
            if (!events[event]) return;
            events[event] = events[event].filter(cb => cb !== callback);
        },
        
        emit(event, data) {
            if (!events[event]) return;
            events[event].forEach(callback => callback(data));
        }
    };
}
