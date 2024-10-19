// Import utility functions for KV operations and error handling
import { getKVData, setKVData, handleApiError, methodNotAllowed } from './utils';

/**
 * API handler for recording votes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export default async function handler(req, res) {
  console.log('Received request method:', req.method);
  console.log('Received request body:', JSON.stringify(req.body));
  // Only allow POST requests for submitting votes
  if (req.method === 'POST') {
    try {
      console.log('Received vote:', JSON.stringify(req.body));
      // Retrieve current votes from KV store or initialize if not exists
      let votes = await getKVData('votes') || {};
      console.log('Current votes:', JSON.stringify(votes));
      const newVote = req.body;
      // Process each category in the new vote
      Object.entries(newVote).forEach(([category, selectedDishes]) => {
        if (!votes[category]) {
          votes[category] = {};
        }
        // Update vote counts for each selected dish
        selectedDishes.forEach((dish, index) => {
          if (!votes[category][dish]) {
            votes[category][dish] = { 1: 0, 2: 0 };
          }
          votes[category][dish][index + 1]++;
        });
      });
      console.log('Updated votes:', JSON.stringify(votes));
      // Save updated votes to KV store
      await setKVData('votes', votes);
      console.log('Votes saved to KV store');
      res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
      // Handle any errors that occur during the process
      handleApiError(res, error, 'Failed to save vote');
    }
  } else {
    console.log('Method not allowed:', req.method);
    // If the request method is not POST, return a method not allowed error
    methodNotAllowed(res, ['POST']);
  }
}
