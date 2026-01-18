import * as THREE from 'three';

export class TextureManager {
  static createDefaultTexture(): THREE.CanvasTexture {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    ctx.canvas.width = 512;
    ctx.canvas.height = 512;

    const grd = ctx.createLinearGradient(0, 0, 512, 512);
    grd.addColorStop(0, "#4f46e5");
    grd.addColorStop(1, "#312e81");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText('DROP IMAGE', 256, 256);

    const tex = new THREE.CanvasTexture(ctx.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  static loadfromFile(file: File): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (!ev.target?.result) return reject('Failed to read file');
        new THREE.TextureLoader().load(ev.target.result as string, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          resolve(tex);
        }, undefined, reject);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
