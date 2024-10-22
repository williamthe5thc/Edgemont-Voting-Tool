import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Preloader from './components/Preloader';
import { THEME } from './constants';
import '../styles/index.css';

function init() {
    // Wait for DOM to be ready
    useEffect(() => {
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = THEME;
        }
    }, []);
    
    return (
        <div className="app-container">
            <div className="container">
                <h1>{THEME}</h1>
                
                <div className="instructions">
                    <h2>Voting Instructions</h2>
                    <ul>
                        <li>For each category, select up to 2 of your favorite dishes.</li>
                        <li>Enter the number associated with the dish in each category you want to vote for.</li>
                        <li>You can select either one, two or no dishes per category.</li>
                    </ul>
                </div>

                <div id="loading-spinner" className="loading-spinner" style={{ display: 'none' }}>
                    <div className="spinner"></div>
                </div>

                <div id="categories"></div>

                <button id="submitVotes" className="btn-primary">
                    Submit Your Votes
                </button>
            </div>
            
            <div id="toastContainer"></div>
        </div>
    );
}

// Create and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Preloader onLoadComplete={() => {
            import('./main.js').then(({ init }) => {
                init().catch(error => {
                    console.error("Error initializing main app:", error);
                });
            });
        }} />
    </React.StrictMode>
);
