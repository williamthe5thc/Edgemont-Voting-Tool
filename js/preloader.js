// preloader.js
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
        
        skullContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459.99 512">
                <defs>
                    <!-- Create mask for filling animation -->
                    <mask id="filling-mask">
                        <rect x="0" y="0" width="460" height="512" fill="white"/>
                        <rect class="mask-rect" x="0" y="512" width="460" height="512" fill="black"/>
                    </mask>
                </defs>
                
                <!-- Dark background skull -->
                <path class="skull-base" fill="#2C0735" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
                
                <!-- White filled skull that will be revealed -->
                <g mask="url(#filling-mask)">
                    <path class="skull-fill" fill="white" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
                </g>
            </svg>
        `;

        this.progressText = document.createElement('p');
        this.progressText.className = 'progress-text';
        
        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = `
            <h2>Voting Instructions</h2>
            <ul>
                <li>For each category, select up to 2 of your favorite dishes.</li>
                <li>Enter the number associated with each dish you want to vote for.</li>
                <li>You can select either one, two, or no dishes per category.</li>
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
            
            // Update mask position based on progress
            const maskRect = this.container.querySelector('.mask-rect');
            if (maskRect) {
                const totalHeight = 512;
                const newY = totalHeight - (totalHeight * (this.progress / 100));
                maskRect.setAttribute('y', newY);
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
