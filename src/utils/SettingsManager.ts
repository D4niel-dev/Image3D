
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

export const DEFAULT_SETTINGS: AppSettings = {
    visuals: {
        theme: 'soft-orbital'
    },
    camera: {
        mode: 'turntable',
        autoRotate: true,
        rotateSpeed: 0.005,
        fov: 45,
        transparentBg: false
    },
    material: {
        color: '#ffffff',
        roughness: 0.2,
        metalness: 0.1,
        wireframe: false
    }
};

export class SettingsManager {
    private static STORAGE_KEY = 'image3d_settings_v1';
    private settings: AppSettings;

    constructor() {
        this.settings = this.load();
    }

    public get(): AppSettings {
        return this.settings;
    }

    public update(partial: Partial<AppSettings> | any) {
        // Deep merge logic simplified for this specific depth
        if (partial.camera) this.settings.camera = { ...this.settings.camera, ...partial.camera };
        if (partial.material) this.settings.material = { ...this.settings.material, ...partial.material };
        if (partial.visuals) this.settings.visuals = { ...this.settings.visuals, ...partial.visuals };
        
        this.save();
    }

    private save() {
        try {
            localStorage.setItem(SettingsManager.STORAGE_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }

    private load(): AppSettings {
        try {
            const stored = localStorage.getItem(SettingsManager.STORAGE_KEY);
            if (!stored) return { ...DEFAULT_SETTINGS };
            
            const parsed = JSON.parse(stored);
            // Quick deep merge with defaults to ensure new keys exist
            return {
                visuals: { ...DEFAULT_SETTINGS.visuals, ...parsed.visuals },
                camera: { ...DEFAULT_SETTINGS.camera, ...parsed.camera },
                material: { ...DEFAULT_SETTINGS.material, ...parsed.material }
            };
        } catch (e) {
            console.warn('Failed to load settings, using defaults', e);
            return { ...DEFAULT_SETTINGS };
        }
    }
}
