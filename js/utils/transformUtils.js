// transformUtils.js

/**
 * Formats vote data for submission
 * @param {Object} rawVotes - Raw vote data
 * @returns {Object} Formatted vote data
 */
export function formatVoteData(rawVotes) {
    return Object.entries(rawVotes).reduce((acc, [category, votes]) => {
        acc[category] = votes.map(vote => ({
            dish: parseInt(vote),
            timestamp: new Date().toISOString()
        }));
        return acc;
    }, {});
}

/**
 * Aggregates votes for results display
 * @param {Object} votes - Vote data to aggregate
 * @returns {Object} Aggregated vote data
 */
export function aggregateVotes(votes) {
    return Object.entries(votes).reduce((acc, [category, categoryVotes]) => {
        acc[category] = {};
        
        categoryVotes.forEach((vote, index) => {
            if (!acc[category][vote.dish]) {
                acc[category][vote.dish] = {
                    count: 0,
                    firstChoice: 0,
                    secondChoice: 0
                };
            }
            
            const dishStats = acc[category][vote.dish];
            dishStats.count++;
            dishStats[index === 0 ? 'firstChoice' : 'secondChoice']++;
        });
        
        return acc;
    }, {});
}

/**
 * Calculates voting statistics
 * @param {Object} votes - Vote data
 * @returns {Object} Voting statistics
 */
export function calculateStatistics(votes) {
    const stats = {
        totalVotes: 0,
        categoryStats: {}
    };
    
    Object.entries(votes).forEach(([category, categoryVotes]) => {
        stats.categoryStats[category] = {
            total: categoryVotes.length,
            uniqueVoters: new Set(categoryVotes.map(v => v.dish)).size
        };
        stats.totalVotes += categoryVotes.length;
    });
    
    return stats;
}
