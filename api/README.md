# API Documentation

[← Back to Main Documentation](../README.md)

## API Endpoints

### Vote Submission (`vote.js`)
- **Endpoint**: `/api/vote`
- **Method**: POST
- **Description**: Handles submission of votes
- **Request Body**:
```javascript
{
    "categoryName": [dishNumber1, dishNumber2]
}
```
- **Response**: Success/failure status with message

### Results Retrieval (`results.js`)
- **Endpoint**: `/api/results`
- **Method**: GET
- **Description**: Retrieves current voting results
- **Response**: Rankings and vote counts per category

### Settings Management (`get-settings.js`, `update-settings.js`)
- **Endpoints**: 
  - GET `/api/get-settings`
  - POST `/api/update-settings`
- **Description**: Manages competition settings
- **Request Body** (update):
```javascript
{
    "dishesPerCategory": {
        "categoryName": {
            "min": number,
            "max": number
        }
    }
}
```

### Vote Clearing (`clear-votes.js`)
- **Endpoint**: `/api/clear-votes`
- **Method**: POST
- **Description**: Clears all votes (admin only)
- **Response**: Confirmation of cleared votes

## Configuration (`config.js`)

```javascript
export const API_CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrée & Soups'
];

export const API_CONFIG = {
    MAX_VOTES_PER_CATEGORY: 2,
    MIN_DISHES_PER_CATEGORY: 1,
    MAX_DISHES_PER_CATEGORY: 50
};
```

## Error Handling

All endpoints implement consistent error handling:

```javascript
try {
    // Operation
} catch (error) {
    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Database connection error',
            message: 'Unable to connect to the database'
        });
    }
    return res.status(500).json({
        error: 'Internal server error',
        message: 'Operation failed'
    });
}
```

## Data Storage

The application uses Vercel KV (Redis-compatible) for data storage:

### Votes Structure
```javascript
{
    "categoryName": {
        "dishNumber": voteCount
    }
}
```

### Settings Structure
```javascript
{
    "dishesPerCategory": {
        "categoryName": {
            "min": number,
            "max": number
        }
    }
}
```

## Security Considerations

- Input validation on all endpoints
- Rate limiting implementation
- Error message sanitization
- No sensitive data exposure