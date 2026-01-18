import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GeometryFactory } from '../geometry/GeometryFactory';
import { TextureManager } from '../materials/TextureManager';
import { ExportManager } from '../utils/ExportManager';
import { ShapeType } from '../types/index';
import { StatsMonitor } from '../utils/StatsMonitor';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private mainMesh: THREE.Mesh | undefined;
  
  // State
  private isAutoRotating = true;
  private cameraMode: 'turntable' | 'static' = 'turntable';
  private rotationSpeed = 0.005;
  private currentGeoType: ShapeType = ShapeType.CUBE;
  private currentTexture: THREE.Texture | null = null;
  private camYaw = 45;
  private camPitch = 20;
  private isRecording = false;
  private transparentBackground = false;
  private stats: StatsMonitor;

  // Material State
  private matColor = '#ffffff';
  private matRoughness = 0.2;
  private matMetalness = 0.1;
  private matWireframe = false;

  constructor(private container: HTMLElement) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0f0f11, 0.03);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(4, 3, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Lights
    this.setupLights();
    
    // Grid
    const grid = new THREE.GridHelper(30, 30, 0x333333, 0x151515);
    grid.position.y = -2;
    this.scene.add(grid);

    // Stats
    this.stats = new StatsMonitor();

    // Default Texture
    this.currentTexture = TextureManager.createDefaultTexture();
    this.createMesh(ShapeType.CUBE);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Handle initial resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x6366f1, 0.8);
    fillLight.position.set(-5, 2, -5);
    this.scene.add(fillLight);
  }

  public createMesh(type: ShapeType) {
    if (this.mainMesh) {
      this.scene.remove(this.mainMesh);
      this.mainMesh.geometry.dispose();
      // Keep rotation if existing
      const rotY = this.mainMesh.rotation.y;
      
      const geometry = GeometryFactory.create(type);
      const material = this.createMaterial();

      this.mainMesh = new THREE.Mesh(geometry, material);
      this.mainMesh.rotation.y = rotY;
      this.scene.add(this.mainMesh);
    } else {
        // First init
        const geometry = GeometryFactory.create(type);
        const material = this.createMaterial();
        this.mainMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mainMesh);
    }

    this.currentGeoType = type;
    this.updatePolyCount();
  }

  private createMaterial() {
      return new THREE.MeshStandardMaterial({
        map: this.currentTexture,
        color: this.matColor,
        roughness: this.matRoughness,
        metalness: this.matMetalness,
        wireframe: this.matWireframe,
      });
  }


  private updatePolyCount() {
    if (!this.mainMesh) return;
    const count = this.mainMesh.geometry.attributes.position.count / 3;
    const el = document.getElementById('poly-count');
    if (el) el.innerText = `Triangles: ${Math.floor(count)}`;
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.stats.update();
    if (!this.isRecording) {
      this.controls.update();
      if (this.isAutoRotating && this.mainMesh) {
        if (this.cameraMode === 'turntable') {
          this.mainMesh.rotation.y += this.rotationSpeed;
        } else {
          this.camYaw += this.rotationSpeed * 50; 
          this.applyCameraAngle();
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  private applyCameraAngle() {
      const radius = this.camera.position.length();
      const phi = THREE.MathUtils.degToRad(90 - this.camPitch);
      const theta = THREE.MathUtils.degToRad(this.camYaw);
      
      this.camera.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
      );
      
      this.camera.lookAt(0, 0, 0);
  }

  private handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- Public API for UIManager ---
  
  public updateTexture(tex: THREE.Texture) {
    this.currentTexture = tex;
    if (this.mainMesh) {
       // @ts-ignore - map exists on StandardMaterial
       this.mainMesh.material.map = tex;
       // @ts-ignore
       this.mainMesh.material.needsUpdate = true;
    }
  }

  public setAutoRotate(enabled: boolean) {
    this.isAutoRotating = enabled;
  }

  public toggleCameraLock(locked: boolean) {
     this.controls.enabled = !locked;
  }

  public setCameraMode(mode: 'turntable' | 'static') {
    this.cameraMode = mode;
  }

  public setTransparentBg(enabled: boolean) {
      this.transparentBackground = enabled;
  }

  public setCameraAngle(yaw: number, pitch: number) {
      this.camYaw = yaw;
      this.camPitch = pitch;
      this.applyCameraAngle();
  }

  public setRotationSpeed(speed: number) {
      this.rotationSpeed = speed;
  }

  public resetCamera() {
      this.controls.reset();
  }

  public zoom(factor: number) {
      this.camera.position.multiplyScalar(factor);
  }

  public async exportGIF(delay: number) {
      if (!this.mainMesh) return;
      this.isRecording = true;
      try {
        await ExportManager.exportGIF(
            this.renderer, 
            this.scene, 
            this.camera, 
            this.mainMesh, 
            this.currentGeoType, 
            delay, 
            this.transparentBackground
        );
      } finally {
          this.isRecording = false;
      }
  }

  public takeSnapshot() {
      ExportManager.takeSnapshot(this.renderer, this.scene, this.camera, this.transparentBackground);
  }

  // --- Material API ---
  public setMaterialColor(color: string) {
      this.matColor = color;
      if (this.mainMesh) {
          (this.mainMesh.material as THREE.MeshStandardMaterial).color.set(color);
      }
  }

  public setMaterialRoughness(val: number) {
      this.matRoughness = val;
      if (this.mainMesh) {
          (this.mainMesh.material as THREE.MeshStandardMaterial).roughness = val;
      }
  }

  public setMaterialMetalness(val: number) {
      this.matMetalness = val;
      if (this.mainMesh) {
          (this.mainMesh.material as THREE.MeshStandardMaterial).metalness = val;
      }
  }

  public toggleWireframe() {
      this.matWireframe = !this.matWireframe;
      if (this.mainMesh) {
          (this.mainMesh.material as THREE.MeshStandardMaterial).wireframe = this.matWireframe;
      }
      return this.matWireframe;
  }
}
