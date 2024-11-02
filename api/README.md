# API Documentation

## Endpoints

### POST /api/vote
Submit votes for dishes.

```javascript
// Request body
{
  "votes": {
    "Bread": [1, 2],
    "Appetizers": [3, 4],
    "Dessert": [5],
    "Entrée & Soups": [6, 7]
  },
  "metadata": {
    "timestamp": "2024-11-02T12:00:00Z",
    "deviceId": "abc123",
    "userAgent": "Browser/1.0"
  }
}
```

### GET /api/results
Retrieve current voting results.

### POST /api/clear-votes
Admin endpoint to clear all votes.

### GET /api/get-settings
Retrieve competition settings.

### POST /api/update-settings
Update competition settings.

## Error Handling
All endpoints return standardized error responses:
```javascript
{
  "error": true,
  "message": "Error description",
  "details": {} // Additional error details
}
```

## Rate Limiting
- 100 requests per IP per minute
- 5 votes per device per competition

## Security
- Device fingerprinting for vote tracking
- Input validation and sanitization
- Error logging and monitoring