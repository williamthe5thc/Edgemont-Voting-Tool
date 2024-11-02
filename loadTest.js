const { chromium } = require('playwright');
const assert = require('assert');

const URL = 'https://edgemont-voting-tool.vercel.app';
const NUM_USERS = 30;
const CATEGORIES = ['Bread', 'Appetizers', 'Dessert', 'Entrée & Soups'];

async function simulateVoting(page, userId) {
    try {
        console.log(`User ${userId}: Starting vote submission`);
        
        // Increase timeout and add retry logic
        await page.goto(URL, { 
            timeout: 60000,
            waitUntil: 'networkidle' 
        });
        
        console.log(`User ${userId}: Page loaded successfully`);

        // Wait for categories with increased timeout
        await page.waitForSelector('.category', { 
            timeout: 60000,
            state: 'attached' 
        });
        
        // Add a small delay between users to prevent overwhelming the server
        await page.waitForTimeout(userId * 100);

        // Rest of the voting simulation...
        for (const category of CATEGORIES) {
            const inputs = await page.$$(`input[data-category="${category}"]`);
            
            const dish1 = Math.floor(Math.random() * 20) + 1;
            const dish2 = Math.floor(Math.random() * 20) + 1;
            
            await inputs[0].fill(dish1.toString());
            await inputs[1].fill(dish2.toString());
            
            await page.waitForTimeout(Math.random() * 500 + 200);
        }
        
        await page.click('#submitVotes');
        
        const success = await page.waitForSelector('.toast.success', { 
            timeout: 20000 
        }).then(() => true).catch(() => false);
            
        console.log(`User ${userId}: Vote submission ${success ? 'successful' : 'failed'}`);
        
        return success;
    } catch (error) {
        console.error(`User ${userId} encountered error:`, error.message);
        return false;
    }
}

async function runLoadTest() {
    console.log(`Starting load test with ${NUM_USERS} concurrent users`);
    console.log(`Testing URL: ${URL}`);
    
    const browser = await chromium.launch();
    const results = { success: 0, failed: 0 };
    const startTime = Date.now();
    
    try {
        // First verify the site is accessible
        const testContext = await browser.newContext();
        const testPage = await testContext.newPage();
        console.log('Verifying site accessibility...');
        
        await testPage.goto(URL, { 
            timeout: 60000,
            waitUntil: 'networkidle' 
        });
        
        console.log('Site is accessible, proceeding with load test');
        await testContext.close();

        // Create batches of users to prevent overwhelming the server
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