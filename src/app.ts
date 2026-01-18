import { SceneManager } from './scene/SceneManager';
import { UIManager } from './ui/UIManager';

export class App {
  private sceneManager: SceneManager;
  private uiManager: UIManager;

  constructor() {
    const container = document.getElementById('canvas-container');
    if (!container) throw new Error('Canvas container not found');

    this.sceneManager = new SceneManager(container);
    this.uiManager = new UIManager(this.sceneManager);
  }
}
