# Utility Modules Documentation

[← Back to JavaScript Documentation](../README.md)

## API Utilities (`apiUtils.js`)
```javascript
// Handles all API interactions
fetchData(endpoint, options)     // Generic fetch wrapper
submitData(endpoint, data)       // POST wrapper
handleAPIError(error)           // Standardized error handling
```

## UI Utilities (`uiUtils.js`)
```javascript
// Manages UI updates and notifications
showToast(message, type)        // Display notifications
toggleSpinner(show)             // Loading indicators
updateUIState(state)            // Manage UI states
```

## Storage Utilities (`storageUtils.js`)
```javascript
// Handles local storage operations
saveToLocalStorage(key, value)  // Save data
getFromLocalStorage(key)        // Retrieve data
clearLocalStorage()            // Clear saved data
```

## Validation Utilities (`validationUtils.js`)
```javascript
// Input validation and sanitization
validateVotes(votes)           // Validate vote structure
validateInput(input)           // Single input validation
checkDuplicates(votes)        // Check for duplicate votes
```

## Device Fingerprinting (`deviceUtils.js`)
```javascript
// Handles device identification
generateDeviceFingerprint()    // Create unique device ID
hashString(str)               // Hash sensitive data
calculateConfidence()         // Calculate fingerprint reliability
```

## DOM Utilities (`domUtils.js`)
```javascript
// DOM manipulation helpers
createElement(tag, attrs, children)  // Create DOM elements
removeElement(element)              // Safe element removal
toggleVisibility(element, visible)  // Show/hide elements
```

## Form Utilities (`formUtils.js`)
```javascript
// Form handling utilities
serializeForm(form)           // Form data serialization
resetForm(form)               // Form reset with defaults
validateFormField(field)      // Field validation
```

## Error Utilities (`errorUtils.js`)
```javascript
// Error handling utilities
createErrorObject(op, error)  // Error object creation
handleAPIError(error)         // API error handling
getErrorMessage(error)        // User-friendly messages
```

## Configuration Utilities (`configUtils.js`)
```javascript
// Configuration management
APP_CONFIG                    // Application settings
UI_MESSAGES                   // UI text constants
```

## Transform Utilities (`transformUtils.js`)
```javascript
// Data transformation
formatVoteData(rawVotes)      // Format vote data
aggregateVotes(votes)         // Aggregate vote data
calculateStatistics(votes)    // Calculate vote stats
```

## Event Utilities (`eventUtils.js`)
```javascript
// Event handling
debounce(func, wait)          // Debounce function calls
throttle(func, limit)         // Throttle function calls
createEventEmitter()          // Custom event handling
```