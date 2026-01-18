import * as THREE from 'three';
import { ShapeType } from '../types/index';
export declare class GeometryFactory {
    static create(type: ShapeType): THREE.BufferGeometry;
}
