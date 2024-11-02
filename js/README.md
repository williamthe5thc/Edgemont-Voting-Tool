# JavaScript Architecture Documentation

[← Back to Main Documentation](../README.md)

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

See [Utils Documentation](utils/README.md) for detailed information about utility modules.

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

## Performance Optimization
1. Lazy loading of components
2. Debounced input handling
3. Optimized DOM updates
4. Efficient error handling
5. Minified production builds