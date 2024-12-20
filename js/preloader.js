export class Preloader {
    constructor() {
        this.progress = 0;
        this.container = null;
        this.progressText = null;
        this.progressBar = null;
        this.progressFill = null;
        // Start immediately upon construction
        this.start();
    }

    async start() {
        this.container = this.createStructure();
        document.body.appendChild(this.container);
        this.updateProgress(0); // Start at 0%
        return new Promise(resolve => {
            this.resolvePreloader = resolve;
        });
    }

    updateProgress(percent) {
        this.progress = percent;
        if (this.progressText) {
            this.progressText.textContent = 
                `Loading ${Math.round(percent)}% of the Dia de Los Ancestros Voting Tool...`;
        }
        if (this.progressFill) {
            this.progressFill.style.width = `${percent}%`;
        }
        
        if (percent >= 100) {
            setTimeout(() => {
                this.complete();
            }, 500);
        }
    }

    complete() {
        if (!this.container) return;
        
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                document.body.removeChild(this.container);
            }
            if (this.resolvePreloader) {
                this.resolvePreloader();
            }
        }, 500);
    }

    createStructure() {
        const container = document.createElement('div');
        container.className = 'preloader-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #2C0735;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        `;

        // Instructions section
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            max-width: 600px;
            width: 90%;
            background-color: rgba(255, 255, 255, 0.1);
            border: 2px solid #FFD166;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 40px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Voting Instructions';
        title.style.cssText = `
            color: #FFD166;
            font-size: 24px;
            margin-bottom: 15px;
            text-align: center;
        `;

        const list = document.createElement('ul');
        list.style.cssText = `
            color: white;
            list-style-type: disc;
            padding-left: 20px;
        `;

        const instructions_text = [
            'For each category, select up to 2 of your favorite dishes.',
            'Enter the number associated with each dish you want to vote for.',
            'You can select either one, two, or no dishes per category.'
        ];

        instructions_text.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            li.style.marginBottom = '10px';
            list.appendChild(li);
        });

        instructions.appendChild(title);
        instructions.appendChild(list);

        // Progress bar container
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            width: 90%;
            max-width: 600px;
            height: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 20px;
            border: 2px solid #FFD166;
        `;

        // Progress bar fill
        this.progressFill = document.createElement('div');
        this.progressFill.style.cssText = `
            width: 0%;
            height: 100%;
            background-color: #E0144C;
            transition: width 0.3s ease-out;
        `;

        progressBarContainer.appendChild(this.progressFill);

        // Progress text
        this.progressText = document.createElement('p');
        this.progressText.style.cssText = `
            color: white;
            font-size: 18px;
            margin-top: 20px;
            text-align: center;
        `;

        container.appendChild(instructions);
        container.appendChild(progressBarContainer);
        container.appendChild(this.progressText);

        return container;
    }
}