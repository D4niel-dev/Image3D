export declare class BottomSheet {
    private sheet;
    private target;
    private isOpen;
    private startY;
    private currentY;
    private contentMap;
    constructor();
    open(mode: 'shapes' | 'actions' | 'settings'): void;
    close(): void;
    toggle(mode: 'shapes' | 'actions' | 'settings'): void;
    private renderContent;
    private setupGestures;
    private setupOutsideClick;
}
