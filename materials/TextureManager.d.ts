import * as THREE from 'three';
export declare class TextureManager {
    static createDefaultTexture(): THREE.CanvasTexture;
    static loadfromFile(file: File): Promise<THREE.Texture>;
}
