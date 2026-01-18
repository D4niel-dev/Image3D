export type NotificationType = 'info' | 'success' | 'error' | 'warning';
export declare class NotificationSystem {
    private static container;
    static init(): void;
    static show(message: string, type?: NotificationType, duration?: number): void;
}
