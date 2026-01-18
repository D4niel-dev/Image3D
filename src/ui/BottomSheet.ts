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
  
    // Track currently borrowed elements to restore them later
    private currentBorrowed: { element: HTMLElement, parent: HTMLElement | null, nextSibling: Node | null }[] = [];

    private renderContent(mode: string) {
        // 1. RESTORE previously borrowed elements to their original homes
        this.restoreContent();
        
        // 2. Clear container (now safe)
        this.target.innerHTML = '';
        
        let contents: HTMLElement[] = [];
        
        if (mode === 'shapes') {
            const el = document.querySelector('.control-group:has(#btn-cube)');
            if(el) contents.push(el as HTMLElement);
        } else if (mode === 'actions') {
             const el = document.getElementById('actions-content');
             if(el) {
                 el.classList.remove('hidden');
                 contents.push(el);
             }
        } else if (mode === 'settings') {
             const matHeader = document.getElementById('material-toggle');
             const matContent = document.getElementById('material-content');
             if (matHeader) contents.push(matHeader);
             if (matContent) {
                 matContent.classList.remove('hidden');
                 contents.push(matContent);
             }
             const advContent = document.getElementById('advanced-content');
             if(advContent) {
                 advContent.classList.remove('hidden');
                 contents.push(advContent);
             }
        }
  
        // 3. BORROW new elements
        contents.forEach(c => {
            // Save state for restoration
            this.currentBorrowed.push({
                element: c,
                parent: c.parentElement,
                nextSibling: c.nextSibling
            });

            c.classList.add('mobile-content-wrapper');
            this.target.appendChild(c);
        });
    }

    private restoreContent() {
        this.currentBorrowed.forEach(item => {
            if (item.element) {
                item.element.classList.remove('mobile-content-wrapper');
                // Attempt to put back in original place
                if (item.parent) {
                    item.parent.insertBefore(item.element, item.nextSibling);
                } else {
                    // Fallback if parent lost (rare in this app structure)
                    // Just append to body hidden or similar? 
                    // For now, if no parent, we probably don't need to restore strictly.
                }
            }
        });
        this.currentBorrowed = [];
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
