import React from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/Preloader';
import { THEME } from './constants';
import './styles/index.css'; // Import Tailwind CSS

function init() {
    // Set the page title
    document.querySelector('h1').textContent = THEME;
    
    // Render the preloader
    const preloaderRoot = ReactDOM.createRoot(document.getElementById('root'));
    preloaderRoot.render(
        <React.StrictMode>
            <Preloader onLoadComplete={() => {
                // Once preloader is done, initialize the main application
                import('./main.js').then(mainModule => {
                    mainModule.init().catch(error => {
                        console.error("Error initializing main app:", error);
                    });
                });
            }} />
        </React.StrictMode>
    );
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
