// main.js

import { APP_CONFIG, UI_MESSAGES } from './utils/configUtils.js';
import { getSettings, submitVote } from './utils/apiUtils.js';
import { showToast } from './utils/uiUtils.js';
import { validateVotes } from './utils/validationUtils.js';

async function init() {
    try {
        // Get settings using new API utility
        const settings = await getSettings();
        
        if (!settings?.dishesPerCategory) {
            showToast(UI_MESSAGES.ERROR_LOADING_SETTINGS, 'error');
            return;
        }

        await loadCategoriesProgressively();
        setupVoting();
        loadVotesFromLocalStorage();
        
        const submitButton = document.getElementById('submitVotes');
        if (submitButton) {
            submitButton.addEventListener('click', handleVoteSubmission);
        }
    } catch (error) {
        showToast(UI_MESSAGES.ERROR_LOADING_SETTINGS, 'error');
    }
}

async function handleVoteSubmission(e) {
    e.preventDefault();
    
    const votes = getFromLocalStorage('currentVotes');
    const validation = validateVotes(votes);
    
    if (!validation.isValid) {
        showToast(validation.errors[0], 'error');
        return;
    }

    try {
        await submitVote(votes);
        showToast(UI_MESSAGES.VOTES_SUBMITTED, 'success');
        clearLocalStorage();
        disableVoting();
    } catch (error) {
        showToast(UI_MESSAGES.ERROR_SUBMITTING_VOTES, 'error');
    }
}
