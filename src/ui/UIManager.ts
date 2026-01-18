import { SceneManager } from '../scene/SceneManager';
import { TextureManager } from '../materials/TextureManager';
import { ShapeType } from '../types/index';
import { SettingsManager, AppSettings } from '../utils/SettingsManager';
// @ts-ignore - lucide doesn't have types in this setup effectively
declare const lucide: any;

import { BottomSheet } from './BottomSheet';

export class UIManager {
  private isMinimized = false;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  
  private bottomSheet: BottomSheet | undefined;
  private settingsManager: SettingsManager;

  constructor(private scene: SceneManager) {
    this.settingsManager = new SettingsManager();
    
    this.setupDragLogic();
    this.setupShapeButtons();
    this.setupActions();
    this.setupMaterialOptions();
    this.setupAdvancedOptions();
    this.setupBottomControls();
    
    // Mobile
    try {
        this.bottomSheet = new BottomSheet();
        this.setupMobileDock();
    } catch(e) { console.log('Mobile UI init skipped (elements missing?)'); }

    // Re-run icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Apply Saved Settings immediately
    this.applySettings();
  }

  private applySettings() {
      const s = this.settingsManager.get();

      // Camera
      this.scene.setAutoRotate(s.camera.autoRotate);
      this.scene.setRotationSpeed(s.camera.rotateSpeed);
      this.scene.setCameraMode(s.camera.mode);
      this.scene.setTransparentBg(s.camera.transparentBg);

      // Material
      this.scene.setMaterialColor(s.material.color);
      this.scene.setMaterialRoughness(s.material.roughness);
      this.scene.setMaterialMetalness(s.material.metalness);
      if (s.material.wireframe) this.scene.toggleWireframe(); // toggles, assuming default starts false

      // Update UI to match
      this.updateUIValues(s);
  }

  private updateUIValues(s: AppSettings) {
      // Toggles/Inputs
      const rotBtn = document.getElementById('toggle-rotate');
      if (rotBtn) {
          rotBtn.querySelector('span')!.innerText = s.camera.autoRotate ? "Pause" : "Rotate";
          rotBtn.classList.toggle('text-yellow-300', !s.camera.autoRotate);
      }

      const rotSpeed = document.getElementById('rot-speed') as HTMLInputElement;
      if (rotSpeed) rotSpeed.value = (s.camera.rotateSpeed * 10000).toString();

      const matColor = document.getElementById('mat-color') as HTMLInputElement;
      if (matColor) matColor.value = s.material.color;

      const matRough = document.getElementById('mat-roughness') as HTMLInputElement;
      if (matRough) matRough.value = s.material.roughness.toString();
      const lblRough = document.getElementById('val-rough');
      if (lblRough) lblRough.innerText = s.material.roughness.toFixed(2);

      const matMetal = document.getElementById('mat-metalness') as HTMLInputElement;
      if (matMetal) matMetal.value = s.material.metalness.toString();
      const lblMetal = document.getElementById('val-metal');
      if (lblMetal) lblMetal.innerText = s.material.metalness.toFixed(2);

      const wfBtn = document.getElementById('mat-wireframe');
      if (wfBtn) wfBtn.classList.toggle('glass-btn-active', s.material.wireframe);

      const tBtn = document.getElementById('mode-turntable');
      const sBtn = document.getElementById('mode-static');
      if (s.camera.mode === 'turntable') {
        tBtn?.classList.add('glass-btn-active');
        sBtn?.classList.remove('glass-btn-active');
      } else {
        sBtn?.classList.add('glass-btn-active');
        tBtn?.classList.remove('glass-btn-active');
      }
      
      const bgBtn = document.getElementById('transparent-bg');
      if (bgBtn && s.camera.transparentBg) {
          bgBtn.classList.add('glass-btn-active');
          bgBtn.innerText = 'Transparent BG';
      }
  }

  private setupDragLogic() {
    const draggable = document.getElementById('draggable-panel');
    const header = document.getElementById('panel-header');
    const minBtn = document.getElementById('minimize-btn');
    const advContent = document.getElementById('advanced-content');
    const advChevron = document.getElementById('advanced-chevron');

    if (!draggable || !header || !minBtn) return;

    // Minimize
    minBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        this.isMinimized = !this.isMinimized;
        draggable.classList.toggle('minimized', this.isMinimized);
        
        // Close all accordions when minimizing (using new state logic)
        if (this.isMinimized) {
            draggable.style.height = '';
            document.querySelectorAll('.accordion-content.is-open').forEach(el => {
                el.classList.remove('is-open');
            });
        }
    });

    // POINTER EVENTS for dragging
    header.addEventListener('pointerdown', (e) => {
        // @ts-ignore
        if (e.target.closest('#minimize-btn')) return;
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        const rect = draggable.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;

        header.setPointerCapture(e.pointerId);
        header.style.cursor = 'grabbing';
        
        const onMove = (ev: PointerEvent) => this.onPointerMove(ev, draggable);
        const onUp = (ev: PointerEvent) => {
            this.isDragging = false;
            header.style.cursor = 'grab';
            header.releasePointerCapture(ev.pointerId);
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    });
  }

  private onPointerMove(e: PointerEvent, el: HTMLElement) {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;
      
      let newX = Math.max(0, Math.min(window.innerWidth - 100, this.initialLeft + deltaX));
      let newY = Math.max(0, Math.min(window.innerHeight - 50, this.initialTop + deltaY));
      
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
      el.style.bottom = 'auto';
      el.style.right = 'auto';
  }

  private setupMobileDock() {
      const btns = {
          shapes: document.getElementById('dock-shapes'),
          actions: document.getElementById('dock-actions'),
          settings: document.getElementById('dock-settings')
      };

      Object.entries(btns).forEach(([mode, btn]) => {
          if(!btn) return;
          btn.addEventListener('click', () => {
              // Toggle active state visual
              Object.values(btns).forEach(b => b?.classList.remove('active'));
              btn.classList.add('active');
              
              // Open Sheet
              if (this.bottomSheet) this.bottomSheet.toggle(mode as any);
          });
      });
  }

  private setupShapeButtons() {
    const shapes = [ShapeType.CUBE, ShapeType.SPHERE, ShapeType.CAPSULE, ShapeType.TORUS];
    shapes.forEach(type => {
        const btn = document.getElementById(`btn-${type}`);
        btn?.addEventListener('click', () => {
            this.scene.createMesh(type);
            this.updateActiveShapeButton(type);
        });
    });

    // Global hook for html onclick (legacy support if needed, but we are attaching events directly now)
    // window.changeShape = (type: string) => this.scene.createMesh(type as ShapeType);
  }

  private updateActiveShapeButton(activeType: ShapeType) {
    [ShapeType.CUBE, ShapeType.SPHERE, ShapeType.CAPSULE, ShapeType.TORUS].forEach(t => {
        const btn = document.getElementById(`btn-${t}`);
        if (t === activeType) btn?.classList.add('glass-btn-active');
        else btn?.classList.remove('glass-btn-active');
    });
  }

  private setupActions() {
    // Helper for Accordion Logic
    const toggleAccordion = (btnId: string, contentId: string, chevronId: string) => {
        const btn = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        const chevron = document.getElementById(chevronId);
        
        if (!btn || !content) return;

        // Init State
        content.classList.add('accordion-content');
        if (!content.classList.contains('hidden')) { // If it was visible by default (legacy check), open it
            // Actually legacy was .hidden means hidden. So if it DOES NOT have hidden, it is open.
            // But usually we start hidden.
        }
        // Remove legacy hidden class if present and switch to accordion state logic
        // We assume default start is CLOSED.
        content.classList.remove('hidden'); 
        
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', contentId);

        btn.addEventListener('click', () => {
            const isOpen = content.classList.contains('is-open');
            content.classList.toggle('is-open', !isOpen);
            btn.setAttribute('aria-expanded', (!isOpen).toString());
            
            if (chevron) {
                chevron.style.transform = !isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    };

    // Initialize Accordions
    toggleAccordion('actions-toggle', 'actions-content', 'actions-chevron');
    toggleAccordion('material-toggle', 'material-content', 'material-chevron');
    toggleAccordion('advanced-toggle', 'advanced-content', 'advanced-chevron');


    // Upload
    document.getElementById('upload')?.addEventListener('change', async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            try {
                const tex = await TextureManager.loadfromFile(input.files[0]);
                this.scene.updateTexture(tex);
            } catch (err) {
                console.error(err);
            }
        }
    });

    // GIF Export
    const gifSpeedInput = document.getElementById('gif-speed') as HTMLInputElement;
    document.getElementById('record-gif')?.addEventListener('click', () => {
        const delay = gifSpeedInput ? parseInt(gifSpeedInput.value) : 50;
        this.scene.exportGIF(delay);
    });

    document.getElementById('take-snapshot')?.addEventListener('click', () => {
        this.scene.takeSnapshot();
    });

    // Toggle Rotate
    const rotBtn = document.getElementById('toggle-rotate');
    // Initialize from settings instead of hardcoded
    rotBtn?.addEventListener('click', () => {
        const current = this.settingsManager.get().camera.autoRotate;
        const newState = !current;
        
        this.scene.setAutoRotate(newState);
        this.settingsManager.update({ camera: { autoRotate: newState }});
        
        const span = rotBtn.querySelector('span');
        if (span) span.innerText = newState ? "Pause" : "Rotate";
        rotBtn.classList.toggle('text-yellow-300', !newState);
    });

    // Reset Cam
    document.getElementById('reset-cam')?.addEventListener('click', () => this.scene.resetCamera());

    // Camera Angles (Persist if needed, but usually ephemeral. Let's persist basic params)
    document.getElementById('cam-yaw')?.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        const pitch = parseFloat((document.getElementById('cam-pitch') as HTMLInputElement).value);
        this.scene.setCameraAngle(val, pitch);
    });
    document.getElementById('cam-pitch')?.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        const yaw = parseFloat((document.getElementById('cam-yaw') as HTMLInputElement).value);
        this.scene.setCameraAngle(yaw, val);
    });

    // Animation Speed
    document.getElementById('rot-speed')?.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        const speed = val / 10000;
        this.scene.setRotationSpeed(speed);
        this.settingsManager.update({ camera: { rotateSpeed: speed }});
    });
  }

  private setupMaterialOptions() {
      // Accordion handled in setupActions()

      // Color
      document.getElementById('mat-color')?.addEventListener('input', (e) => {
          const val = (e.target as HTMLInputElement).value;
          this.scene.setMaterialColor(val);
          this.settingsManager.update({ material: { color: val }});
      });

      // Roughness
      document.getElementById('mat-roughness')?.addEventListener('input', (e) => {
          const val = parseFloat((e.target as HTMLInputElement).value);
          this.scene.setMaterialRoughness(val);
          const lbl = document.getElementById('val-rough');
          if (lbl) lbl.innerText = val.toFixed(2);
          this.settingsManager.update({ material: { roughness: val }});
      });

      // Metalness
      document.getElementById('mat-metalness')?.addEventListener('input', (e) => {
          const val = parseFloat((e.target as HTMLInputElement).value);
          this.scene.setMaterialMetalness(val);
          const lbl = document.getElementById('val-metal');
          if (lbl) lbl.innerText = val.toFixed(2);
          this.settingsManager.update({ material: { metalness: val }});
      });

      // Wireframe
      const wfBtn = document.getElementById('mat-wireframe');
      wfBtn?.addEventListener('click', () => {
         const isWire = this.scene.toggleWireframe();
         wfBtn.classList.toggle('glass-btn-active', isWire);
         this.settingsManager.update({ material: { wireframe: isWire }});
      });
  }

  private setupAdvancedOptions() {
     // Accordion handled in setupActions()

     // Camera Mode
     const tBtn = document.getElementById('mode-turntable');
     const sBtn = document.getElementById('mode-static');
     tBtn?.addEventListener('click', () => {
         this.scene.setCameraMode('turntable');
         tBtn.classList.add('glass-btn-active');
         sBtn?.classList.remove('glass-btn-active');
         this.settingsManager.update({ camera: { mode: 'turntable' }});
     });
     sBtn?.addEventListener('click', () => {
        this.scene.setCameraMode('static');
        sBtn.classList.add('glass-btn-active');
        tBtn?.classList.remove('glass-btn-active');
        this.settingsManager.update({ camera: { mode: 'static' }});
    });

    // Lock Camera
    const lockBtn = document.getElementById('lock-camera');
    let locked = false;
    lockBtn?.addEventListener('click', () => {
        locked = !locked;
        this.scene.toggleCameraLock(locked);
        lockBtn.classList.toggle('glass-btn-active', locked);
        lockBtn.innerText = locked ? 'Camera Locked' : 'Lock Camera';
    });

    // Transparent BG
    const bgBtn = document.getElementById('transparent-bg');
    bgBtn?.addEventListener('click', () => {
        const current = this.settingsManager.get().camera.transparentBg;
        const newState = !current;
        
        this.scene.setTransparentBg(newState);
        bgBtn.classList.toggle('glass-btn-active', newState);
        bgBtn.innerText = newState ? 'Transparent BG' : 'Transparent Background';
        
        this.settingsManager.update({ camera: { transparentBg: newState }});
    });

    // Presets
    document.querySelectorAll('.preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const yaw = parseFloat((btn as HTMLElement).dataset.yaw || '0');
            const pitch = parseFloat((btn as HTMLElement).dataset.pitch || '0');
            
            const yawInput = document.getElementById('cam-yaw') as HTMLInputElement;
            const pitchInput = document.getElementById('cam-pitch') as HTMLInputElement;
            if(yawInput) yawInput.value = yaw.toString();
            if(pitchInput) pitchInput.value = pitch.toString();
            
            this.scene.setCameraAngle(yaw, pitch);
        });
    });
  }

  private setupBottomControls() {
      // Visibility
      // Visibility
      const visBtn = document.getElementById('visibility-toggle');
      visBtn?.addEventListener('click', () => {
          const ui = document.getElementById('draggable-panel');
          const bottom = document.getElementById('bottom-controls');
          // const dock = document.getElementById('mobile-dock'); 
          
          if (ui && bottom) {
            const isHidden = ui.classList.contains('hidden-ui');
            ui.classList.toggle('hidden-ui', !isHidden);
            bottom.classList.toggle('hidden-ui', !isHidden);
            document.getElementById('mobile-dock')?.classList.toggle('hidden-ui', !isHidden);
            
            // Re-render icon
            if (visBtn) {
                 visBtn.innerHTML = `<i data-lucide="${!isHidden ? 'eye-off' : 'eye'}" class="w-6 h-6"></i>`;
                 if (typeof lucide !== 'undefined') lucide.createIcons();
            }
          }
      });

      // Zoom
      document.getElementById('zoom-in')?.addEventListener('click', () => this.scene.zoom(0.9));
      document.getElementById('zoom-out')?.addEventListener('click', () => this.scene.zoom(1.1));
  }
}
