import { SceneManager } from '../scene/SceneManager';
export declare class UIManager {
    private scene;
    private isMinimized;
    private isDragging;
    private startX;
    private startY;
    private initialLeft;
    private initialTop;
    private bottomSheet;
    private settingsManager;
    constructor(scene: SceneManager);
    private applySettings;
    private updateUIValues;
    private setupDragLogic;
    private onPointerMove;
    private setupMobileDock;
    private setupShapeButtons;
    private updateActiveShapeButton;
    private setupActions;
    private setupMaterialOptions;
    private setupAdvancedOptions;
    private setupBottomControls;
}
