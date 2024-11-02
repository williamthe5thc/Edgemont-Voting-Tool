// deviceUtils.js

/**
 * Generates a simple device fingerprint based on available browser data
 * @returns {Promise<string>} A pseudo-unique device identifier
 */
export async function generateDeviceFingerprint() {
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
    
    // Canvas fingerprint
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 50;
        
        // Draw text with specific style
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#123456';
        ctx.fillText('Browser Fingerprint', 2, 2);
        
        // Get canvas data and hash it
        const canvasData = canvas.toDataURL();
        components.push(await hashString(canvasData));
    } catch (e) {
        components.push('canvas-not-supported');
    }

    // Get final fingerprint
    return (await hashString(components.join('|'))).slice(0, 12);
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
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}