// domUtils.js

/**
 * Creates an HTML element with given attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array} children - Child elements or text
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Safely removes an element from the DOM
 * @param {HTMLElement} element - Element to remove
 */
export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

/**
 * Shows or hides an element
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} visible - Whether to show or hide
 */
export function toggleVisibility(element, visible) {
    if (element) {
        element.style.display = visible ? 'block' : 'none';
    }
}

/**
 * Updates text content safely
 * @param {HTMLElement} element - Element to update
 * @param {string} text - New text content
 */
export function setTextContent(element, text) {
    if (element) {
        element.textContent = text;
    }
}
