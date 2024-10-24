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
                    <style>
                        .cls-1 { fill: #f04f63; }
                        .cls-2 { fill: #fff; }
                        .cls-3 { fill: #423837; }
                        .cls-4 { fill: #faa631; }
                        .cls-5 { fill: #5ebec1; }
                    </style>
                   <mask id="filling-mask">
                        <rect x="0" y="0" width="460" height="512" fill="white"/>
                        <rect class="mask-rect" x="0" y="512" width="460" height="512" fill="black"/>
                      <path class="cls-2" d="M161.19,17.77c-2.54,6.75-2.95,12.71,1.48,18.84,8.94,12.39,25.39,2.91,36.94,2.95-5.75,7.28-17.37,7.98-22.9,15.51-12.23,16.65,6.83,35.58,24.01,24.75,6.3-3.97,9.61-14.56,14.77-19.95,2.28-.22-5.39,18.34-5.54,19.58-3.32,27.74,28.25,29.55,33.24,11.82,2.83-10.03-2.13-19.23-1.11-29.18,6.72,12.68,24.59,34.25,38.78,16.62,13.17-16.36-8.22-28.48-19.21-36.94.93-1.38,16.87,3.95,19.58,4.06,16.51.69,25.1-14.23,15.88-28.07,28.85,8.32,54.15,19.89,78.31,37.68-3.66,14.32,14.87,18.94,25.12,22.16.99,1.01,1.96,1.9,2.95,2.95-16.44-4.48-47.43-5.28-39.15,21.05,4.58,14.59,26,8.54,36.94,8.86-6.58,5.34-17,7.67-21.42,15.51-11.32,20.07,13.65,37.51,28.81,20.68,3.32-3.68,5.01-11.32,9.97-13.67.9.48-5.97,17.09-6.28,18.84-4.84,27.2,30.12,31.08,34.72,6.28,12.27,47.46,5.33,101.26-9.6,147.38-1.17,3.6-8.87,18.88-8.86,20.68,0,3.5,10.54,22.59,11.08,31.77,2.29,38.78-48.61,47.13-76.83,53.19-3.83,24.68-1.39,55.67-24.01,72.03-41.25,29.83-171.25,28.68-214.23,2.22-25.92-15.96-24.05-45.8-26.96-72.77-.33-.71-2.56-2.27-3.32-2.59-22.67-9.4-67.79-6.97-73.5-43.22-2.7-17.14,10.62-34.29,9.6-42.85-.36-3.05-7.45-16.14-8.86-20.68C7.42,257.99.83,208.5,11.96,161.82c8.9,20.06,37.83,16.65,34.72-8.5-.82-6.64-6.95-13.42-5.54-20.32,3.71,3.22,5.52,9.53,8.5,12.93,18.66,21.35,48.41-6.92,21.79-27.7-3.23-2.52-9.06-3.84-12.19-7.02,15.97,1.17,41.21,2.6,36.2-21.42-3.61-17.32-28.34-10.95-39.89-8.5,1.86-1.51,1.46-2.11,4.43-3.69,9.08-4.85,25.43-5.61,22.9-20.68,23.88-18.08,49.42-30.71,78.31-39.15Z"/>

                    </mask>
                </defs>
                
                 <g id="Generative_Object" data-name="Generative Object">
    <path class="cls-3" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
    <g>
      <g>
        <path class="cls-4" d="M403.49,80.56c.95,1.01,1.98,1.87,2.95,2.95-12.44,23.35,6.6,52.57,32.5,50.97,3.23,7.87,5.99,15.38,8.13,23.64-4.6,24.8-39.56,20.92-34.72-6.28.31-1.75,7.18-18.36,6.28-18.84-4.96,2.34-6.66,9.99-9.97,13.67-15.16,16.83-40.14-.61-28.81-20.68,4.42-7.84,14.84-10.17,21.42-15.51-10.94-.33-32.35,5.72-36.94-8.86-8.27-26.33,22.71-25.53,39.15-21.05Z"/>
        <path class="cls-2" d="M415.31,93.86c-6.7,11.31,3.97,30.74,17.73,28.07,2.12,4.19,4.12,8.2,5.91,12.56-25.91,1.6-44.95-27.62-32.5-50.97,3.12,3.48,5.99,6.62,8.86,10.34Z"/>
        <path class="cls-5" d="M433.04,121.93c-13.76,2.67-24.43-16.76-17.73-28.07,7.1,9.2,12.48,17.71,17.73,28.07Z"/>
        <path class="cls-4" d="M400.54,77.6c-10.24-3.23-28.78-7.84-25.12-22.16,9.4,6.92,16.95,13.9,25.12,22.16Z"/>
      </g>
      <g>
        <path class="cls-4" d="M11.96,161.82c2.33-9.77,5.06-18.07,8.86-27.33,26.84,3.09,45.73-27.27,31.77-50.23,1.06-1.03,1.73-1.96,2.95-2.95,11.56-2.45,36.28-8.82,39.89,8.5,5.01,24.03-20.23,22.59-36.2,21.42,3.13,3.18,8.95,4.49,12.19,7.02,26.62,20.78-3.13,49.05-21.79,27.7-2.97-3.4-4.79-9.71-8.5-12.93-1.41,6.89,4.72,13.68,5.54,20.32,3.11,25.15-25.82,28.56-34.72,8.5Z"/>
        <path class="cls-2" d="M20.83,134.49c1.77-4.32,3.81-8.4,5.91-12.56,13.37,2.77,24.18-17.35,18.47-28.81,2.43-3.05,4.57-6.12,7.39-8.86,13.97,22.96-4.92,53.33-31.77,50.23Z"/>
        <path class="cls-5" d="M26.74,121.93c5.5-10.87,10.9-19.31,18.47-28.81,5.71,11.46-5.1,31.58-18.47,28.81Z"/>
        <path class="cls-4" d="M82.88,56.92c2.53,15.08-13.82,15.84-22.9,20.68,5.76-8.65,14.77-14.53,22.9-20.68Z"/>
      </g>
      <path class="cls-3" d="M228.78,302.92c5.24-.96,26.95,32.97,29.18,38.78,12.58,32.85-4.62,53.91-27.7,19.58-2.48-.26-21.1,31.52-30.66,12.19-10.53-21.3,15.07-55.7,29.18-70.55Z"/>
      <path class="cls-3" d="M228.78,415.94c5.74-2.6,2.64,26.21,5.17,27.33h28.07c3.41-1.51-1.32-25.12.74-25.86,6.61-2.37,5.05,23.97,7.39,25.12l21.79-2.59c.51-3.4-2.35-21.07-.37-21.79,4.47-1.62,5.46,18.27,5.91,21.42,2.66-.12,15.09-.37,15.88-2.59.3-.84-4.18-23.54,2.22-11.08,3.12,6.08-1.46,13.75,9.97,10.71,2.84-1.61-1.77-10.43-2.59-12.93,4.16-6.31,6.92,9.62,8.13,11.08,1.41,1.7,3.74-.71,4.43,1.48.82,2.59-2.34,1.34-2.95,2.95-.93,2.46,2.68,15.27-.37,16.62-3.82,1.69-2.81-14.67-5.17-15.51-1.52,1.46-7.8,1.24-8.5,2.59-.9,1.74-.4,20.2-4.06,20.32s.1-15.24-1.11-18.1c-.67-1.66-15.33,1.34-16.25,2.95-1.34,2.35-.4,21.54-5.54,19.58-2.36-.9,1.06-16.36-.74-19.21-3.64.54-20.77.79-21.79,3.32-.02,3.41-1.29,22.81-4.8,22.53s.44-19.21-1.48-22.9l-28.81.74c-2.67,29.24-6.15,30.96-8.13,0l-28.07-1.48c-3.41,1.17,1.74,24.01-2.95,23.64-3.58-.28-3.3-23.55-5.17-24.38l-20.68-1.48c-2.16,2.79,3.05,22.24-2.95,19.21-2.98-3.92-1.76-16.67-3.32-19.58-1.09-2.03-12.51-2.96-15.14-4.06-3.52,1.4,1.94,19.14-2.22,19.21-3.92.07-3.35-18.95-4.06-20.32-.56-1.08-6.91-1.72-8.5-2.59-1.88.67-1.99,14.75-3.69,15.51-5.09,2.27-1.19-14.58-1.85-16.62-.24-.74-4.3-2.06-2.95-3.69.8-.97,3.3.21,4.43-.74.54-.45,2.95-11.61,5.54-12.93,5.92-1.81-2.95,11.33-.74,14.04,12.99,5.15,6.54-7.13,13.3-13.3,3.02-.04-.58,11.73-.37,14.41l15.14,2.59c3.41-24.66,8.75-31.08,6.28-.37,1.22,2.89,17.59,2.03,21.05,3.32,2.79-1,1.77-27.55,7.39-25.12,2.55,1.1-1.17,21.61.74,25.12l28.81.74c2.32-1.03.7-26.31,2.95-27.33Z"/>
      <path class="cls-1" d="M211.79,138.18c8.03-.74,15.09,10.27,16.99,16.99,1.48.65,11.07-24.17,24.38-14.77,17.16,12.11-12.62,45.96-22.9,54.67-9.88-10.23-34.87-33.58-28.44-49.13.71-1.71,7.82-7.56,9.97-7.76Z"/>
      <path class="cls-5" d="M146.78,98.29c18.07-2.49,28.5,18.08,33.61,32.13.74,2.04,4.99,12.95,3.32,13.67-15.47-2.74-48.15-6.64-50.6-26.23-1.07-8.58,4.73-18.35,13.67-19.58Z"/>
      <path class="cls-5" d="M306.35,98.29c17.05-1.99,25.64,14.5,16.62,28.44-7.3,11.28-34.24,15.13-46.91,17.36-1.55-.68.68-6.33,1.11-7.76,3.66-12.3,14.64-36.35,29.18-38.04Z"/>
      <path class="cls-1" d="M407.55,346.5c8.96-2.13,15.51,5.58,14.41,14.41-.46,3.65-10.76,20.33-13.67,21.05s-17.82-4.69-20.68-6.65c-17.83-12.21-.01-35.16,12.56-17.73.83-.12,1.79-9.75,7.39-11.08Z"/>
      <path class="cls-1" d="M46.31,346.5c7.83-1.29,11.42,3.23,12.56,10.34,14.43-15.76,30.37,6.72,13.3,18.47-1.98,1.36-15.76,6.63-17.73,6.65-9.53.08-26.82-32.38-8.13-35.46Z"/>
      <path class="cls-1" d="M122.4,367.19c7.39-1.12,9.97,3.06,11.08,9.6,16.1-13.36,25.05,12.91,5.17,19.21-9.88,3.13-13.79,2.49-19.58-5.54-5.11-7.09-8.98-21.41,3.32-23.27Z"/>
      <path class="cls-1" d="M332.2,367.93c9.19-1.89,13.83,6.88,11.45,15.14-.51,1.78-8.57,13.23-9.97,13.67-8.69,2.7-26.02-6.46-24.01-17.36.4-2.17,4.85-6.72,7.02-7.02,5.08-.7,8.36,4.54,8.86,4.43.94-.2,2.29-7.97,6.65-8.86Z"/>
      <g>
        <path class="cls-4" d="M192.21,10.38c11.53.87,6.62,19.02,8.86,28.44,7.58,31.86,54.68,31.88,59.84-2.95.53-3.58-.68-22.67,0-23.64.92-1.3,9.35.76,11.08-1.11,8.49,1.55,16.85,4.26,25.12,6.65,9.22,13.84.62,28.76-15.88,28.07-2.7-.11-18.65-5.44-19.58-4.06,10.99,8.46,32.38,20.58,19.21,36.94-14.19,17.63-32.06-3.94-38.78-16.62-1.02,9.95,3.93,19.15,1.11,29.18-4.99,17.73-36.57,15.92-33.24-11.82.15-1.24,7.82-19.8,5.54-19.58-5.16,5.39-8.47,15.97-14.77,19.95-17.18,10.84-36.24-8.1-24.01-24.75,5.54-7.54,17.15-8.23,22.9-15.51-11.55-.05-28,9.43-36.94-2.95-4.42-6.13-4.02-12.08-1.48-18.84,10.24-2.99,20.47-5.67,31.03-7.39Z"/>
        <g>
          <path class="cls-2" d="M272,11.12c-1.73,1.87-10.16-.2-11.08,1.11-.68.96.53,20.06,0,23.64-5.16,34.83-52.26,34.81-59.84,2.95-2.24-9.42,2.66-27.57-8.86-28.44,27.87-4.53,51.95-4.35,79.78.74Z"/>
          <path class="cls-5" d="M222.87,12.6c9.34-1.55,23.74-.53,27.7,9.97,7.22,19.13-11.39,34.7-29.92,27.7-16.09-6.07-14.85-34.84,2.22-37.68Z"/>
        </g>
      </g>
      <g>
        <path class="cls-4" d="M143.83,156.65c13.1-1.86,20.3,7.73,20.68,19.95,18.78-15.53,45.73,11.07,32.13,29.92,23.34-8.99,34.31,32.72,12.56,39.15,12.32,13.22-1.64,39.1-19.21,39.15,17.28,17.94-16.28,40.95-31.4,27.7.5,18-36.91,28.51-40.63,6.65-11.86,13.57-41.44,2.84-33.98-16.99-12.44,12.67-33.21-16.21-21.79-26.96-12.31.37-15.4-16.12-14.04-25.86.35-2.48,3.85-8.15,3.69-9.6-.05-.46-3.9-5.9-4.43-8.13-3.34-13.89,3.39-27.98,19.21-26.59-16.93-15.79,10.6-41.51,26.23-26.96-1.93-21.93,31.77-28.53,37.68-7.39,1.59-6.34,6.45-13.06,13.3-14.04Z"/>
        <path class="cls-3" d="M127.57,175.86c84.1-7.39,89.99,123.4,11.08,132.23-98.98,11.08-97.92-124.6-11.08-132.23Z"/>
      </g>
      <g>
        <path class="cls-4" d="M309.3,156.65c8.97-1.21,17.44,4.36,19.21,13.3,5.44-10.94,13.2-13.98,25.12-11.08,10.41,2.53,11.85,9.98,13.3,19.21,15.59-14.54,43.17,11.16,26.23,26.96,15.65-1.37,21.98,12.19,19.21,25.86-.68,3.33-5.15,9.06-5.17,9.6-.01.38,3.36,4.58,3.69,6.65,1.67,10.56.58,27.97-13.3,28.07,10.92,11.13-8.99,39.61-21.79,26.96,7.44,20.05-22.49,30.49-33.98,16.99-3.71,21.74-41.28,11.64-40.63-6.65-15.44,13.01-49.06-9.82-31.4-28.44-17.5,1.75-32.11-25.99-19.21-39.15-21.97-4.81-11.18-45.93,11.82-39.15-11.98-19.29,14.37-44.31,32.87-29.18-.25-8.62,4.8-18.7,14.04-19.95Z"/>
        <path class="cls-3" d="M319.64,175.86c85.06-8.35,108.38,122.48,22.9,132.23-94.34,10.76-103.61-124.31-22.9-132.23Z"/>
      </g>
    </g>
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
