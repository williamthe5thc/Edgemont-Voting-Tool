# JavaScript Architecture Documentation

## Core Components

### 1. Main Application (`main.js`)
```javascript
// Initializes and coordinates the application
- Loads settings
- Sets up categories
- Handles voting lifecycle
- Manages state
```

### 2. Vote Submission (`voteSubmitter.js`)
```javascript
// Handles vote collection and submission
- Real-time validation
- Local storage backup
- Dual submission (Vercel KV + Google Sheets)
- Device fingerprinting
```

### 3. Category Management (`categoryLoader.js`)
```javascript
// Manages competition categories
- Progressive category loading
- Dynamic UI updates
- Settings management
- Input validation
```

## Utility Modules

### API Utilities (`apiUtils.js`)
```javascript
// Handles all API interactions
fetchData(endpoint, options)     // Generic fetch wrapper
submitData(endpoint, data)       // POST wrapper
handleAPIError(error)           // Standardized error handling
```

### UI Utilities (`uiUtils.js`)
```javascript
// Manages UI updates and notifications
showToast(message, type)        // Display notifications
toggleSpinner(show)             // Loading indicators
updateUIState(state)            // Manage UI states
```

### Storage Utilities (`storageUtils.js`)
```javascript
// Handles local storage operations
saveToLocalStorage(key, value)  // Save data
getFromLocalStorage(key)        // Retrieve data
clearLocalStorage()            // Clear saved data
```

### Validation Utilities (`validationUtils.js`)
```javascript
// Input validation and sanitization
validateVotes(votes)           // Validate vote structure
validateInput(input)           // Single input validation
checkDuplicates(votes)        // Check for duplicate votes
```

### Device Fingerprinting (`deviceUtils.js`)
```javascript
// Handles device identification
generateDeviceFingerprint()    // Create unique device ID
hashString(str)               // Hash sensitive data
calculateConfidence()         // Calculate fingerprint reliability
```

## Event Handling

### Vote Events
```javascript
setupVoting()                 // Initialize vote listeners
handleVoteSubmission()        // Process vote submission
validateAndSave()            // Validate and store votes
```

### UI Events
```javascript
setupEventListeners()         // Set up UI event handlers
handleInputChange()          // Process input changes
handleFormSubmission()       // Handle form submissions
```

## Constants and Configuration (`constants.js`)
```javascript
// Application constants
CATEGORIES                    // Competition categories
THEME                        // Competition theme
API_CONFIG                   // API configuration
UI_MESSAGES                  // UI message strings
```

## State Management
- Uses local storage for persistence
- Maintains vote state during session
- Handles page refreshes
- Manages loading states

## Error Handling
```javascript
try {
    // Operation
} catch (error) {
    handleAPIError(error)    // API errors
    showToast(error)         // User notifications
    logError(error)          // Error logging
}
```

## Code Examples

### Vote Submission
```javascript
async function submitVotes(votes) {
    try {
        // Validate votes
        const validation = validateVotes(votes);
        if (!validation.isValid) {
            throw new Error(validation.errors);
        }

        // Get device fingerprint
        const deviceId = await generateDeviceFingerprint();

        // Submit to both backends
        await Promise.all([
            submitToVercelKV(votes),
            submitToGoogleSheets({
                votes,
                metadata: {
                    deviceId,
                    timestamp: new Date().toISOString()
                }
            })
        ]);

        // Clear local storage
        clearLocalStorage();

        // Show success message
        showToast('Votes submitted successfully', 'success');

    } catch (error) {
        handleSubmissionError(error);
    }
}
```

### Real-time Validation
```javascript
function validateInput(input) {
    const value = parseInt(input.value);
    const category = input.dataset.category;
    
    if (isNaN(value) || value < 1 || value > maxDishes[category]) {
        showError(input, 'Invalid dish number');
        return false;
    }
    
    return true;
}
```


## Best Practices
1. Use async/await for asynchronous operations
2. Implement proper error handling
3. Validate all inputs
4. Use TypeScript-style JSDoc comments
5. Follow consistent naming conventions
6. Log important operations
7. Handle edge cases

## Troubleshooting
Common issues and solutions:
1. Vote not submitting
   - Check validation errors
   - Verify network connection
   - Check console for errors

2. Results not updating
   - Clear cache
   - Verify API endpoints
   - Check permissions

3. Device fingerprint issues
   - Check browser compatibility
   - Verify required APIs
   - Check privacy settings

## Performance Optimization
1. Lazy loading of components
2. Debounced input handling
3. Optimized DOM updates
4. Efficient error handling
5. Minified production builds

Would you like me to create additional documentation for any specific component or add more implementation details to any section?