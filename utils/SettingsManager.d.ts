export interface AppSettings {
    visuals: {
        theme: string;
    };
    camera: {
        mode: 'turntable' | 'static';
        autoRotate: boolean;
        rotateSpeed: number;
        fov: number;
        transparentBg: boolean;
    };
    material: {
        color: string;
        roughness: number;
        metalness: number;
        wireframe: boolean;
    };
}
export declare const DEFAULT_SETTINGS: AppSettings;
export declare class SettingsManager {
    private static STORAGE_KEY;
    private settings;
    constructor();
    get(): AppSettings;
    update(partial: Partial<AppSettings> | any): void;
    private save;
    private load;
}
