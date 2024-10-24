// preloader.js
export class Preloader {
    constructor() {
        this.progress = 0;
        this.container = null;
        this.progressText = null;
        this.svgContent = null;
        this.maskRect = null;
    }

    async start() {
        this.container = this.createStructure();
        document.body.appendChild(this.container);
        this.maskRect = this.container.querySelector('#maskRect');
        return new Promise((resolve) => {
            this.resolvePreloader = resolve;
        });
    }

    updateProgress(percent) {
        this.progress = percent;
        if (this.maskRect) {
            // Calculate the transform based on actual progress
            const translateY = 512 - (512 * (percent / 100));
            this.maskRect.style.transform = `translateY(${translateY}px)`;
        }
        if (this.progressText) {
            this.progressText.textContent = 
                `Loading ${Math.round(percent)}% of the categories for the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...`;
        }
        
        if (percent >= 100) {
            setTimeout(() => {
                this.complete();
            }, 500); // Give a small delay to ensure the animation completes
        }
    }

    complete() {
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(this.container);
            const event = new CustomEvent('preloaderComplete');
            document.dispatchEvent(event);
            if (this.resolvePreloader) {
                this.resolvePreloader();
            }
        }, 500);
    }

    createStructure() {
        this.container = document.createElement('div');
        this.container.className = 'preloader-container';
        const skullContainer = document.createElement('div');
        skullContainer.className = 'skull-container';
        
        // Define SVG content
        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459.99 512">
            <defs>
                <style>
                    .cls-1 { fill: #f04f63; }
                    .cls-2 { fill: #fff; }
                    .cls-3 { fill: #423837; }
                    .cls-4 { fill: #faa631; }
                    .cls-5 { fill: #5ebec1; }
                    #maskRect {
                        transition: transform 0.3s ease-out;
                        transform-origin: bottom;
                    }
                </style>
                <mask id="fillMask">
                    <rect width="460" height="512" fill="white"/>
                    <rect id="maskRect" width="460" height="512" fill="black"/>
                </mask>
            </defs>
            <g mask="url(#fillMask)">
                <path class="cls-2" d="M161.19,17.77c-2.54,6.75-2.95,12.71,1.48,18.84,8.94,12.39,25.39,2.91,36.94,2.95-5.75,7.28-17.37,7.98-22.9,15.51-12.23,16.65,6.83,35.58,24.01,24.75,6.3-3.97,9.61-14.56,14.77-19.95,2.28-.22-5.39,18.34-5.54,19.58-3.32,27.74,28.25,29.55,33.24,11.82,2.83-10.03-2.13-19.23-1.11-29.18,6.72,12.68,24.59,34.25,38.78,16.62,13.17-16.36-8.22-28.48-19.21-36.94.93-1.38,16.87,3.95,19.58,4.06,16.51.69,25.1-14.23,15.88-28.07,28.85,8.32,54.15,19.89,78.31,37.68-3.66,14.32,14.87,18.94,25.12,22.16.99,1.01,1.96,1.9,2.95,2.95-16.44-4.48-47.43-5.28-39.15,21.05,4.58,14.59,26,8.54,36.94,8.86-6.58,5.34-17,7.67-21.42,15.51-11.32,20.07,13.65,37.51,28.81,20.68,3.32-3.68,5.01-11.32,9.97-13.67.9.48-5.97,17.09-6.28,18.84-4.84,27.2,30.12,31.08,34.72,6.28,12.27,47.46,5.33,101.26-9.6,147.38-1.17,3.6-8.87,18.88-8.86,20.68,0,3.5,10.54,22.59,11.08,31.77,2.29,38.78-48.61,47.13-76.83,53.19-3.83,24.68-1.39,55.67-24.01,72.03-41.25,29.83-171.25,28.68-214.23,2.22-25.92-15.96-24.05-45.8-26.96-72.77-.33-.71-2.56-2.27-3.32-2.59-22.67-9.4-67.79-6.97-73.5-43.22-2.7-17.14,10.62-34.29,9.6-42.85-.36-3.05-7.45-16.14-8.86-20.68C7.42,257.99.83,208.5,11.96,161.82c8.9,20.06,37.83,16.65,34.72-8.5-.82-6.64-6.95-13.42-5.54-20.32,3.71,3.22,5.52,9.53,8.5,12.93,18.66,21.35,48.41-6.92,21.79-27.7-3.23-2.52-9.06-3.84-12.19-7.02,15.97,1.17,41.21,2.6,36.2-21.42-3.61-17.32-28.34-10.95-39.89-8.5,1.86-1.51,1.46-2.11,4.43-3.69,9.08-4.85,25.43-5.61,22.9-20.68,23.88-18.08,49.42-30.71,78.31-39.15Z"/>
                <path class="cls-3" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
                <!-- Include all your other paths here -->
            </g>
        </svg>`;

        skullContainer.innerHTML = svgContent;

        this.progressText = document.createElement('p');
        this.progressText.className = 'progress-text';
        
        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = 
            '<h2>Voting Instructions</h2>' +
            '<ul>' +
                '<li>For each category, select up to 2 of your favorite dishes.</li>' +
                '<li>Enter the number associated with each dish you want to vote for.</li>' +
                '<li>You can select either one, two, or no dishes per category.</li>' +
            '</ul>';

        this.container.appendChild(skullContainer);
        this.container.appendChild(this.progressText);
        this.container.appendChild(instructions);
        return this.container;
    }
}
