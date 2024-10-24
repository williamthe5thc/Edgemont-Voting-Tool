// apiUtils.js

import { handleAPIError } from './errorUtils.js';
import { APP_CONFIG } from './configUtils.js';

export const API_ENDPOINTS = {
    VOTE: '/api/vote',
    SETTINGS: '/api/get-settings',
    RESULTS: '/api/results',
    CLEAR_VOTES: '/api/clear-votes',
    UPDATE_SETTINGS: '/api/update-settings'
};

export async function makeAPIRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: APP_CONFIG.API_TIMEOUT
    };

    try {
        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        const errorData = handleAPIError(error, `API Request to ${endpoint}`);
        throw errorData;
    }
}

// Example usage functions
export async function getSettings() {
    return makeAPIRequest(API_ENDPOINTS.SETTINGS);
}

export async function submitVote(voteData) {
    return makeAPIRequest(API_ENDPOINTS.VOTE, {
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export async function getResults() {
    return makeAPIRequest(API_ENDPOINTS.RESULTS);
}

export async function clearVotes() {
    return makeAPIRequest(API_ENDPOINTS.CLEAR_VOTES, {
        method: 'POST'
    });
}

export async function updateSettings(settings) {
    return makeAPIRequest(API_ENDPOINTS.UPDATE_SETTINGS, {
        method: 'POST',
        body: JSON.stringify(settings)
    });
}
