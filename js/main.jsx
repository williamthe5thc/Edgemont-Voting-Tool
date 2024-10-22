import React from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/Preloader';
import App from './App';
import '../styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function initializeApp() {
    root.render(
        <React.StrictMode>
            <Preloader onLoadComplete={() => {
                root.render(
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                );
            }} />
        </React.StrictMode>
    );
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
