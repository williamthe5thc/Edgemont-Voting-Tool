import React from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/Preloader';
import { THEME } from './constants';

// Initialize the app with the preloader
function init() {
    // Set the page title
    document.querySelector('h1').textContent = THEME;
    
    // Render the preloader
    const preloaderRoot = ReactDOM.createRoot(document.getElementById('root'));
    preloaderRoot.render(
        <React.StrictMode>
            <Preloader />
        </React.StrictMode>
    );
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
