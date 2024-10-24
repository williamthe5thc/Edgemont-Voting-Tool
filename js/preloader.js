// js/preloader.js

export class Preloader {
    constructor() {
        this.progress = 0;
        this.container = null;
        this.progressText = null;
        this.isLoading = true;
        this.loadingInterval = null;
    }

    createStructure() {
        this.container = document.createElement('div');
        this.container.className = 'preloader-container';

        const skullContainer = document.createElement('div');
        skullContainer.className = 'skull-container';
        
        // Create two SVG groups - base skull and the mask
        skullContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 0 524.22 524.22">
                <!-- White skull (will be masked) -->
                <path class="skull-fill" fill="white" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
                
                <!-- Purple mask that will cover the white -->
                <rect class="mask-rect" x="-20" y="0" width="524.22" height="524.22" fill="#2C0735"/>
                
                <!-- Decorative elements on top -->
                <g class="decorative-elements">
                    <!-- Your decorative paths here (orange flowers, hearts, etc.) -->
                    <path fill="#faa631" d="M..."/> <!-- Orange flower paths -->
                    <path fill="#f04f63" d="M..."/> <!-- Red heart paths -->
                    <!-- Add other decorative elements -->
                </g>
            </svg>
        `;

        this.progressText = document.createElement('p');
        this.progressText.className = 'progress-text';

        // Add instructions
        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = `
            <h2>Voting Instructions</h2>
            <ul>
                <li>For each category, select up to 2 of your favorite dishes.</li>
                <li>Enter the number associated with the dish in each category you want to vote for.</li>
                <li>You can select either one, two or no dishes per category.</li>
            </ul>
        `;

        this.container.appendChild(skullContainer);
        this.container.appendChild(this.progressText);
        this.container.appendChild(instructions);

        return this.container;
    }

    updateProgress() {
        if (this.progress < 100) {
            this.progress += 1;
            this.progressText.textContent = 
                `Loading ${this.progress}% of the categories for the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...`;
            
            // Update the mask height based on progress
            const maskRect = document.querySelector('.mask-rect');
            if (maskRect) {
                const totalHeight = 524.22; // SVG height
                const maskHeight = totalHeight * (1 - (this.progress / 100));
                maskRect.setAttribute('height', maskHeight);
                maskRect.setAttribute('y', '0'); // Always start from top
            }
        } else {
            clearInterval(this.loadingInterval);
            this.complete();
        }
    }

    start() {
        document.body.appendChild(this.createStructure());
        this.loadingInterval = setInterval(() => this.updateProgress(), 30);
    }

    complete() {
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            document.body.removeChild(this.container);
            this.showMainContent();
        }, 500);
    }

    showMainContent() {
        const event = new CustomEvent('preloaderComplete');
        document.dispatchEvent(event);
    }
}
