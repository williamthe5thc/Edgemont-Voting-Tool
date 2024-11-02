// Add this to voteSubmitter.js or create a new utils file

/**
 * Generates a simple device fingerprint based on available browser data
 * @returns {Promise<string>} A pseudo-unique device identifier
 */
async function generateDeviceFingerprint() {
    const components = [];

    // Screen data
    const screen = window.screen || {};
    components.push(`${screen.width}x${screen.height}`);
    components.push(`${screen.colorDepth}`);

    // Browser data
    components.push(navigator.language || 'unknown');
    components.push(navigator.platform || 'unknown');

    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Canvas fingerprint (creates a unique hash based on how the browser renders graphics)
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 50;
        
        // Draw some text with a specific style
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#123456';
        ctx.fillText('Browser Fingerprint', 2, 2);
        
        // Get a hash of the canvas data
        const canvasData = canvas.toDataURL();
        components.push(await hashString(canvasData));
    } catch (e) {
        components.push('canvas-not-supported');
    }

    // Hash all components together
    const fingerprint = await hashString(components.join('|'));
    return fingerprint.slice(0, 12); // Take first 12 characters for readability
}

/**
 * Creates a hash of a string using SHA-256
 * @param {string} str - String to hash
 * @returns {Promise<string>} Hashed string
 */
async function hashString(str) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}