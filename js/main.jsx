// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/Preloader';
import { THEME } from './constants';
import '../styles/index.css';

function init() {
    document.querySelector('h1').textContent = THEME;
    
    const preloaderRoot = ReactDOM.createRoot(document.getElementById('root'));
    preloaderRoot.render(
        <React.StrictMode>
            <Preloader onLoadComplete={() => {
                // Updated to use the correct function name
                import('./main.js').then(mainModule => {
                    mainModule.initApp().catch(error => {
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
