import * as THREE from 'three';
import { ShapeType } from '../types/index';

export class GeometryFactory {
  static create(type: ShapeType): THREE.BufferGeometry {
    switch (type) {
      case ShapeType.CUBE:
        return new THREE.BoxGeometry(2, 2, 2);
      case ShapeType.SPHERE:
        return new THREE.SphereGeometry(1.3, 64, 64);
      case ShapeType.CAPSULE:
        return new THREE.CapsuleGeometry(0.8, 2, 8, 16);
      case ShapeType.TORUS:
        return new THREE.TorusGeometry(1, 0.4, 32, 100);
      default:
        console.warn(`Unknown shape type: ${type}, defaulting to Cube`);
        return new THREE.BoxGeometry(2, 2, 2);
    }
  }
}
