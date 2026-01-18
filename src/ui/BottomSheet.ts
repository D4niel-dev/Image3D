export class BottomSheet {
    private sheet: HTMLElement;
    private target: HTMLElement;
    private isOpen = false;
    private startY = 0;
    private currentY = 0;
    private contentMap: Map<string, HTMLElement> = new Map();
  
    constructor() {
      const sheet = document.getElementById('bottom-sheet');
      const target = document.getElementById('sheet-target');
      if (!sheet || !target) throw new Error('BottomSheet elements not found');
      
      this.sheet = sheet;
      this.target = target;
  
      this.setupGestures();
      this.setupOutsideClick();
    }
  
    public open(mode: 'shapes' | 'actions' | 'settings') {
        this.isOpen = true;
        this.sheet.classList.add('open');
        this.renderContent(mode);
    }
  
    public close() {
        this.isOpen = false;
        this.sheet.classList.remove('open');
        // Reset transform
        this.sheet.style.transform = '';
    }
  
    public toggle(mode: 'shapes' | 'actions' | 'settings') {
        if (this.isOpen) {
             // If already open, check if we are switching modes or closing
             // For now, let's just re-open/update content. 
             // If user clicks same button, maybe close? 
             // Let's keep it simple: always open/update.
             this.renderContent(mode);
        } else {
            this.open(mode);
        }
    }
  
    private renderContent(mode: string) {
        // Clear current (We do NOT destroy the elements, we append them back to desktop? 
        // No, for this simple implementation we just clear the container. 
        // The elements are 'stolen'. We need to be careful not to lose them if we switch tabs.
        // Actually, if we clear innerHTML, we destroy the event listeners if we cloned.
        // If we moved them, we need to append them back or just hide them?
        // Let's assume we pull them fresh each time. 
        // BUT if we appended them to 'target', and now we set innerHTML='', they are gone.
        // FIX: We must APPEND them. If they are already there, just show?
        // Simpler: We just move them. If we switch tabs, we move the current content back to a "storage" fragment or just don't worry about desktop restoration for this session.
        
        // 1. Recover existing content to a safe place? (Skip for now, assuming Mobile Only session)
        this.target.innerHTML = '';
        
        let contents: HTMLElement[] = [];
        
        if (mode === 'shapes') {
            const el = document.querySelector('.control-group:has(#btn-cube)');
            if(el) contents.push(el as HTMLElement);
        } 
        else if (mode === 'actions') {
             // Actions Toggle Content
             const el = document.getElementById('actions-content');
             if(el) {
                 el.classList.remove('hidden');
                 contents.push(el);
             }
             // Also include Upload/Snapshot which might be outside? 
             // In index.html, they are inside actions-content. Correct.
        } 
        else if (mode === 'settings') {
             // 1. Material (Important!)
             const matHeader = document.getElementById('material-toggle');
             const matContent = document.getElementById('material-content');
             if (matHeader) contents.push(matHeader); // Keep header style? Or just content?
             if (matContent) {
                 matContent.classList.remove('hidden');
                 contents.push(matContent);
             }

             // 2. Advanced
             const advContent = document.getElementById('advanced-content');
             if(advContent) {
                 advContent.classList.remove('hidden');
                 contents.push(advContent);
             }
        }
  
        contents.forEach(c => {
            // Apply a mobile-specific class for styling if needed
            c.classList.add('mobile-content-wrapper');
            this.target.appendChild(c);
        });
    }
  
    private setupGestures() {
        const handle = this.sheet.querySelector('.sheet-handle-area') as HTMLElement;
        
        handle.addEventListener('pointerdown', (e) => {
            this.startY = e.clientY;
            this.currentY = 0;
            this.sheet.setPointerCapture(e.pointerId);
            this.sheet.style.transition = 'none'; // Disable transition for drag
            
            const onMove = (ev: PointerEvent) => {
                const delta = ev.clientY - this.startY;
                if (delta > 0) { // Only drag down
                    this.currentY = delta;
                    this.sheet.style.transform = `translateY(${delta}px)`;
                }
            };
            
            const onUp = (ev: PointerEvent) => {
                this.sheet.releasePointerCapture(ev.pointerId);
                this.sheet.style.transition = ''; // Re-enable
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                
                if (this.currentY > 100) { // Threshold to close
                    this.close();
                } else {
                    this.sheet.style.transform = ''; // Bounce back
                }
            };
            
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    }
  
    private setupOutsideClick() {
        // Close if clicking input canvas (immersive mode) is handled in UIManager mostly
        // But we can verify here too? 
        // Let's leave it to the explicit close interaction or swipe.
    }
  }
