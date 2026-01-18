import * as THREE from 'three';
import { ShapeType } from '../types/index';

export class ExportManager {
  static async exportGIF(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    mesh: THREE.Mesh,
    geoType: ShapeType,
    gifDelay: number,
    isTransparent: boolean
  ): Promise<void> {
    const overlay = document.getElementById('recording-overlay');
    const pBar = document.getElementById('rec-progress');
    if (overlay) overlay.classList.remove('hidden');

    // Init GIF
    // Using CDN for worker to avoid local bundle issues for now, matching original implementation
    const workerScript = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';
    
    // Attempt to fetch blob if possible (CORS might block in some envs, but originally it was doing this)
    let workerUrl = workerScript;
    try {
        const workerBlob = await fetch(workerScript).then(r => r.blob());
        workerUrl = URL.createObjectURL(workerBlob);
    } catch (e) {
        console.warn('Could not load local worker blob, using CDN url', e);
    }

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: 400,
      height: 400,
      workerScript: workerUrl
    });

    // Isolate render state
    const originalPos = camera.position.clone();
    const originalRot = mesh.rotation.y;
    const originalRatio = renderer.getPixelRatio();
    const originalClearColor = renderer.getClearColor(new THREE.Color()).clone();
    const originalClearAlpha = renderer.getClearAlpha();

    if (isTransparent) {
        renderer.setClearColor(0x000000, 0);
    } else {
        renderer.setClearColor(0x000000, 1);
    }

    renderer.setPixelRatio(1);
    renderer.setSize(400, 400);
    camera.aspect = 1;

    // Adjust camera dist based on shape size
    // Note: This logic was in the original file, reusing it
    // const dist = geoType === ShapeType.SPHERE ? 3.5 : 5; 
    // The original code calculated dist but called applyCameraAngle() which uses global camPitch/Yaw
    // We need to ensure camera angle is applied correctly for the frame loop.
    // For now, we basically just need to update projection matrix after aspect change.
    camera.updateProjectionMatrix();

    const frames = 60; 
    const step = (Math.PI * 2) / frames;

    // We need a short delay to allow UI to update (show overlay)
    await new Promise(r => setTimeout(r, 50));

    for (let i = 0; i < frames; i++) {
        mesh.rotation.y = i * step;
        renderer.render(scene, camera);
        gif.addFrame(renderer.domElement, { delay: gifDelay, copy: true });
        if (pBar) pBar.style.width = `${(i / frames) * 50}%`;
    }

    gif.on('progress', (p: number) => {
        if (pBar) pBar.style.width = `${50 + (p * 50)}%`
    });

    gif.on('finished', (blob: Blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `3d-${geoType}.gif`;
        a.click();

        // Reset
        renderer.setPixelRatio(originalRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.position.copy(originalPos);
        camera.updateProjectionMatrix();
        mesh.rotation.y = originalRot;
        renderer.setClearColor(originalClearColor, originalClearAlpha);
        
        if (overlay) overlay.classList.add('hidden');
    });

    gif.render();
  }
  static takeSnapshot(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, isTransparent: boolean) {
      // Config for higher quality
      const originalRatio = renderer.getPixelRatio();
      const originalClearColor = renderer.getClearColor(new THREE.Color()).clone();
      const originalClearAlpha = renderer.getClearAlpha();

      // Set High Quality
      renderer.setPixelRatio(2); // Force 2x pixel ratio for HD
      
      if (isTransparent) {
          renderer.setClearColor(0x000000, 0);
      } else {
          renderer.setClearColor(0x000000, 1); // Black default for slate theme
      }

      renderer.render(scene, camera);
      
      const dataURL = renderer.domElement.toDataURL('image/png');
      
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();

      // Reset
      renderer.setPixelRatio(originalRatio);
      renderer.setClearColor(originalClearColor, originalClearAlpha);
      renderer.render(scene, camera);
  }
}
