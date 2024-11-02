const Preloader = {
    progress: 0,
    container: null,
    progressText: null,
    progressFill: null,
    isCompleting: false,

    start() {
        this.container = this.createStructure();
        document.body.appendChild(this.container);
        this.updateProgress(0);
    },

    updateProgress(percent) {
        if (this.isCompleting) return;
        this.progress = Math.min(percent, 100);
        if (this.progressText) {
            this.progressText.textContent = `Loading ${Math.round(this.progress)}%...`;
        }
        if (this.progressFill) {
            this.progressFill.style.width = `${this.progress}%`;
        }
    },

    complete() {
        if (this.isCompleting) return;
        this.isCompleting = true;
        if (!this.container) return;
        
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                document.body.removeChild(this.container);
            }
        }, 500);
    },

    createStructure() {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#2C0735;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:20px';

        const instructions = document.createElement('div');
        instructions.style.cssText = 'max-width:600px;width:90%;background:rgba(255,255,255,0.1);border:2px solid #FFD166;border-radius:10px;padding:20px;margin-bottom:40px';
        
        instructions.innerHTML = `
            <h2 style="color:#FFD166;font-size:24px;margin-bottom:15px;text-align:center">Voting Instructions</h2>
            <ul style="color:white;list-style-type:disc;padding-left:20px">
                <li style="margin-bottom:10px">For each category, select up to 2 of your favorite dishes.</li>
                <li style="margin-bottom:10px">Enter the number associated with each dish you want to vote for.</li>
                <li style="margin-bottom:10px">You can select either one, two, or no dishes per category.</li>
            </ul>
        `;

        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = 'width:90%;max-width:600px;height:20px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;margin-bottom:20px;border:2px solid #FFD166';

        this.progressFill = document.createElement('div');
        this.progressFill.style.cssText = 'width:0%;height:100%;background:#E0144C;transition:width 0.3s ease-out';

        progressBarContainer.appendChild(this.progressFill);

        this.progressText = document.createElement('p');
        this.progressText.style.cssText = 'color:white;font-size:18px;margin-top:20px;text-align:center';

        container.appendChild(instructions);
        container.appendChild(progressBarContainer);
        container.appendChild(this.progressText);

        return container;
    }
};

export { Preloader };