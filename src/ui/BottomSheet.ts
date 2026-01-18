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
        // Clear current
        this.target.innerHTML = '';
        
        let content: HTMLElement | null = null;
        
        // In a real app we might move DOM elements. 
        // For this hybrid approach, we will Clone the desktop elements 
        // so we don't break the desktop view references if verified on resize.
        // ACTUALLY: Since we hide desktop panel, we can just move them? 
        // Moving is risky if we resize back. Cloning with events is hard.
        // Let's specifically grab the content from the hidden desktop panel
        // and append it here. We'll need to move it back if desktop mode triggers (resize).
        // A simpler way for this restricted scope: 
        // We will simple "Teleport" the specific inner containers.
        
        if (mode === 'shapes') {
            const el = document.querySelector('.control-group:has(#btn-cube)'); // Select shape group
            if(el) content = el as HTMLElement;
        } else if (mode === 'actions') {
             // The actions toggle content is hidden by default in desktop. 
             // We want the inner list.
             const el = document.getElementById('actions-content');
             if(el) {
                 el.classList.remove('hidden'); // Ensure visible in sheet
                 content = el;
             }
        } else if (mode === 'settings') {
             const el = document.getElementById('advanced-content');
             if(el) {
                 el.classList.remove('hidden');
                 content = el;
             }
        }
  
        if (content) {
            // We are moving the DOM node. 
            // NOTE: This means it disappears from Desktop panel. 
            // We need to handle this in a "Responsiveness" manager if strict switching is needed.
            // For now, we assume mobile-first usage or reload on resize.
            this.target.appendChild(content);
        }
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
