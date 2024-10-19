// Import utility functions for KV operations and error handling
import { setKVData, handleApiError, methodNotAllowed } from './utils';

/**
 * API handler for clearing all votes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export default async function handler(req, res) {
  // Only allow POST requests for clearing votes
  if (req.method === 'POST') {
    try {
      // Clear votes by setting an empty object in the KV store
      await setKVData('votes', {});
      res.status(200).json({ message: 'Votes cleared successfully' });
    } catch (error) {
      // Handle any errors that occur during the process
      handleApiError(res, error, 'Failed to clear votes');
    }
  } else {
    // If the request method is not POST, return a method not allowed error
    methodNotAllowed(res, ['POST']);
  }
}
