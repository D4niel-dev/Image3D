export class StatsMonitor {
    private fps = 0;
    private frames = 0;
    private lastTime = performance.now();
    private updateInterval = 1000; // Update every 1s

    public update() {
        this.frames++;
        const time = performance.now();
        if (time >= this.lastTime + this.updateInterval) {
            this.fps = Math.round((this.frames * 1000) / (time - this.lastTime));
            this.lastTime = time;
            this.frames = 0;
            this.updateDisplay();
        }
    }

    private updateDisplay() {
        const el = document.getElementById('fps-counter');
        if(el) el.innerText = `FPS: ${this.fps}`;
        
        // Optional: Change color if low FPS
        const pill = document.querySelector('.stat-pill');
        if (pill) {
             const dot = pill.querySelector('.bg-emerald-500');
             const ping = pill.querySelector('.animate-ping');
             if (this.fps < 30) {
                 dot?.classList.replace('bg-emerald-500', 'bg-red-500');
                 ping?.classList.replace('bg-emerald-400', 'bg-red-400');
             } else {
                 dot?.classList.replace('bg-red-500', 'bg-emerald-500');
                 ping?.classList.replace('bg-red-400', 'bg-emerald-400');
             }
        }
    }
}
