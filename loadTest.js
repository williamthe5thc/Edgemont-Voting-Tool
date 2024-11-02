// loadTest.js
const { chromium } = require('playwright');
const assert = require('assert');

const URL = 'https://edgemont-voting-tool.vercel.app';
const NUM_USERS = 30; // Simulate 30 concurrent users
const CATEGORIES = ['Bread', 'Appetizers', 'Dessert', 'Entrée & Soups'];

async function simulateVoting(page, userId) {
    try {
        console.log(`User ${userId}: Starting vote submission`);
        
        // Wait for page load and categories
        await page.waitForSelector('.category');
        
        // Submit votes for each category
        for (const category of CATEGORIES) {
            const inputs = await page.$$(`input[data-category="${category}"]`);
            
            // Generate random dish numbers (1-20)
            const dish1 = Math.floor(Math.random() * 20) + 1;
            const dish2 = Math.floor(Math.random() * 20) + 1;
            
            await inputs[0].fill(dish1.toString());
            await inputs[1].fill(dish2.toString());
            
            // Small delay to simulate human interaction
            await page.waitForTimeout(Math.random() * 1000 + 500);
        }
        
        // Submit votes
        await page.click('#submitVotes');
        
        // Wait for success message
        const success = await page.waitForSelector('.toast.success', { timeout: 10000 })
            .then(() => true)
            .catch(() => false);
            
        console.log(`User ${userId}: Vote submission ${success ? 'successful' : 'failed'}`);
        
        return success;
    } catch (error) {
        console.error(`User ${userId} encountered error:`, error);
        return false;
    }
}

async function runLoadTest() {
    console.log(`Starting load test with ${NUM_USERS} concurrent users`);
    const browser = await chromium.launch();
    const results = { success: 0, failed: 0 };
    const startTime = Date.now();
    
    try {
        // Create array of promises for each simulated user
        const userPromises = Array(NUM_USERS).fill(0).map(async (_, index) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            
            // Navigate to voting page
            await page.goto(URL);
            
            // Simulate voting
            const success = await simulateVoting(page, index + 1);
            
            if (success) results.success++;
            else results.failed++;
            
            await context.close();
        });
        
        // Run all simulations concurrently
        await Promise.all(userPromises);
        
    } catch (error) {
        console.error('Load test error:', error);
    } finally {
        const duration = (Date.now() - startTime) / 1000;
        
        console.log('\nLoad Test Results:');
        console.log('==================');
        console.log(`Duration: ${duration.toFixed(2)} seconds`);
        console.log(`Successful votes: ${results.success}`);
        console.log(`Failed votes: ${results.failed}`);
        console.log(`Success rate: ${((results.success / NUM_USERS) * 100).toFixed(2)}%`);
        console.log(`Average time per vote: ${(duration / NUM_USERS).toFixed(2)} seconds`);
        
        await browser.close();
    }
}

// Run the load test
runLoadTest().catch(console.error);