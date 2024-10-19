// Import utility functions for KV operations and error handling
import { getKVData, handleApiError, methodNotAllowed } from './utils';

/**
 * API handler for retrieving voting results
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export default async function handler(req, res) {
  // Only allow GET requests for fetching results
  if (req.method === 'GET') {
    try {
      // Retrieve votes from KV store
      const votes = await getKVData('votes');
      console.log('Retrieved votes:', JSON.stringify(votes));
      
      // If no votes are found, return a message
      if (!votes) {
        console.log('No votes found in KV store');
        res.status(200).json({ message: 'No votes recorded yet' });
        return;
      }
      
      // Calculate and return results
      const results = calculateResults(votes);
      console.log('Calculated results:', JSON.stringify(results));
      res.status(200).json(results);
    } catch (error) {
      // Handle any errors that occur during the process
      handleApiError(res, error, 'Failed to fetch results');
    }
  } else {
    // If the request method is not GET, return a method not allowed error
    methodNotAllowed(res, ['GET']);
  }
}

/**
 * Calculates the results based on the votes
 * @param {Object} votes - The votes object
 * @returns {Object} The calculated results
 */
function calculateResults(votes) {
  const results = {};
  Object.entries(votes).forEach(([category, dishes]) => {
    const categoryResults = Object.entries(dishes).map(([dish, ranks]) => ({
      dish,
      score: (ranks[1] || 0) * 2 + (ranks[2] || 0)
    }));
    
    // Only sort if there are more than 3 dishes
    if (categoryResults.length > 3) {
      categoryResults.sort((a, b) => b.score - a.score);
      results[category] = categoryResults.slice(0, 3);
    } else {
      results[category] = categoryResults;
    }
  });
  return results;
}
