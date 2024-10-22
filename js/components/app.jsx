import React from 'react';
import { THEME } from '../constants.js';

const App = () => {
    return (
        <>
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
        </>
    );
};

export default App;
