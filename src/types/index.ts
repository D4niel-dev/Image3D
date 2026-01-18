export enum ShapeType {
  CUBE = 'cube',
  SPHERE = 'sphere',
  CAPSULE = 'capsule',
  TORUS = 'torus'
}

export interface AppState {
  version: string;
  isRecording: boolean;
  currentGeoType: ShapeType;
}
