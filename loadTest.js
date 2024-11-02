const { chromium } = require('playwright');
const assert = require('assert');

const URL = 'https://edgemont-voting-tool.vercel.app';
const NUM_USERS = 30;
const CATEGORIES = ['Bread', 'Appetizers', 'Dessert', 'Entrée & Soups'];

async function simulateVoting(page, userId) {
    try {
        console.log(`User ${userId}: Starting vote submission`);
        
        await page.goto(URL, { 
            timeout: 60000,
            waitUntil: 'networkidle' 
        });
        
        console.log(`User ${userId}: Page loaded successfully`);

        // Wait for categories and log what we find
        const categories = await page.$$('.category');
        console.log(`User ${userId}: Found ${categories.length} categories`);

        // Add a small delay between users
        await page.waitForTimeout(userId * 100);

        let votesSubmitted = 0;
        
        // Submit votes for each category
        for (const category of CATEGORIES) {
            try {
                const inputs = await page.$$(`input[data-category="${category}"]`);
                console.log(`User ${userId}: Found ${inputs.length} inputs for ${category}`);
                
                if (inputs.length >= 2) {
                    const dish1 = Math.floor(Math.random() * 20) + 1;
                    const dish2 = Math.floor(Math.random() * 20) + 1;
                    
                    await inputs[0].fill(dish1.toString());
                    await inputs[1].fill(dish2.toString());
                    votesSubmitted++;
                    
                    console.log(`User ${userId}: Submitted votes ${dish1} and ${dish2} for ${category}`);
                }
                
                await page.waitForTimeout(Math.random() * 500 + 200);
            } catch (error) {
                console.error(`User ${userId}: Error submitting votes for ${category}:`, error.message);
            }
        }
        
        if (votesSubmitted > 0) {
            console.log(`User ${userId}: Attempting to click submit button`);
            
            // Try to find and click the submit button
            const submitButton = await page.$('#submitVotes');
            if (submitButton) {
                await submitButton.click();
                console.log(`User ${userId}: Submit button clicked`);
                
                // Wait for either success or error toast
                const success = await Promise.race([
                    page.waitForSelector('.toast', { 
                        timeout: 20000,
                        state: 'attached'
                    }).then(() => true),
                    page.waitForTimeout(20000).then(() => false)
                ]);
                
                console.log(`User ${userId}: Vote submission ${success ? 'successful' : 'timed out'}`);
                return success;
            } else {
                console.error(`User ${userId}: Submit button not found`);
                return false;
            }
        } else {
            console.error(`User ${userId}: No votes were submitted`);
            return false;
        }
    } catch (error) {
        console.error(`User ${userId} encountered error:`, error.message);
        return false;
    }
}

async function runLoadTest() {
    console.log(`Starting load test with ${NUM_USERS} concurrent users`);
    console.log(`Testing URL: ${URL}`);
    
    const browser = await chromium.launch({ headless: false }); // Make browser visible
    const results = { success: 0, failed: 0 };
    const startTime = Date.now();
    
    try {
        // Verify site accessibility
        const testContext = await browser.newContext();
        const testPage = await testContext.newPage();
        console.log('Verifying site accessibility...');
        
        await testPage.goto(URL, { 
            timeout: 60000,
            waitUntil: 'networkidle' 
        });
        
        console.log('Site is accessible, proceeding with load test');
        await testContext.close();

        // Run in batches of 5
        const BATCH_SIZE = 5;
        for (let i = 0; i < NUM_USERS; i += BATCH_SIZE) {
            const batch = Array(Math.min(BATCH_SIZE, NUM_USERS - i))
                .fill(0)
                .map(async (_, index) => {
                    const userId = i + index + 1;
                    const context = await browser.newContext();
                    const page = await context.newPage();
                    
                    const success = await simulateVoting(page, userId);
                    
                    if (success) results.success++;
                    else results.failed++;
                    
                    await context.close();
                });

            await Promise.all(batch);
            console.log(`Completed batch of ${batch.length} users`);
        }
        
    } catch (error) {
        console.error('Load test error:', error.message);
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

runLoadTest().catch(console.error);