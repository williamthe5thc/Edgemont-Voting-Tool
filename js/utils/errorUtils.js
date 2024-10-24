// errorUtils.js

export function createErrorObject(operation, error, context = {}) {
    return {
        operation,
        message: error.message,
        timestamp: new Date().toISOString(),
        context,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
}

export function handleAPIError(error, operation) {
    const errorObject = createErrorObject(operation, error);
    console.error('API Error:', JSON.stringify(errorObject, null, 2));
    
    // Return user-friendly error
    return {
        error: true,
        message: error.message,
        operation,
        userMessage: getErrorMessage(error)
    };
}

function getErrorMessage(error) {
    // Map error types to user-friendly messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.status === 404) {
        return 'The requested resource was not found.';
    }
    if (error.status === 403) {
        return 'You do not have permission to perform this action.';
    }
    return 'An unexpected error occurred. Please try again later.';
}
