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
             const dot = pill.querySelector('.bg-emerald-500, .bg-red-500');
             // We don't have ping anymore, removed it in previous steps or never added it? 
             // The HTML has `span.bg-emerald-500`.
             
             if (this.fps < 15) { // Relaxed threshold
                 dot?.classList.replace('bg-emerald-500', 'bg-red-500');
             } else {
                 dot?.classList.replace('bg-red-500', 'bg-emerald-500');
             }
        }
    }
}
