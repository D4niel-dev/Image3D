import * as THREE from 'three';
import { ShapeType } from '../types/index';
export declare class ExportManager {
    static exportGIF(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, mesh: THREE.Mesh, geoType: ShapeType, gifDelay: number, isTransparent: boolean): Promise<void>;
    static takeSnapshot(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, isTransparent: boolean): void;
}
