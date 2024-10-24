// configUtils.js

export const APP_CONFIG = {
    // API Configuration
    API_TIMEOUT: 5000,
    MAX_RETRIES: 3,
    
    // Voting Configuration
    MAX_VOTES_PER_CATEGORY: 2,
    DEFAULT_MIN_DISHES: 1,
    DEFAULT_MAX_DISHES: 50,
    
    // UI Configuration
    TOAST_DURATION: 10000,
    MAX_VISIBLE_TOASTS: 3,
    LOADING_SPINNER_DELAY: 300,
    
    // Storage Configuration
    LOCAL_STORAGE_PREFIX: 'diaVoting_',
    STORAGE_VERSION: '1.0'
};

export const UI_MESSAGES = {
    // Success Messages
    VOTES_SUBMITTED: 'Thank you for voting!',
    SETTINGS_UPDATED: 'Settings updated successfully',
    VOTES_CLEARED: 'All votes have been cleared',
    
    // Error Messages
    ERROR_LOADING_SETTINGS: 'Failed to load settings. Using default values.',
    ERROR_SUBMITTING_VOTES: 'Failed to submit votes. Please try again.',
    ERROR_UPDATING_SETTINGS: 'Failed to update settings. Please try again.',
    ERROR_CLEARING_VOTES: 'Failed to clear votes. Please try again.',
    ERROR_INVALID_INPUT: 'Please enter valid numbers only',
    
    // Confirmation Messages
    CONFIRM_SUBMIT_VOTES: 'Are you sure you want to submit your votes?',
    CONFIRM_CLEAR_VOTES: 'Are you sure you want to clear all votes? This cannot be undone.',
    
    // Loading Messages
    LOADING_CATEGORIES: 'Loading categories...',
    LOADING_RESULTS: 'Loading results...',
    SUBMITTING_VOTES: 'Submitting your votes...'
};
