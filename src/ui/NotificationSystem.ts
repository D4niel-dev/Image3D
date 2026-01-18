export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export class NotificationSystem {
    private static container: HTMLElement | null = null;

    static init() {
        this.container = document.getElementById('notification-container');
    }

    static show(message: string, type: NotificationType = 'info', duration = 3000) {
        if (!this.container) return;

        // Limit visible toasts to 3
        if (this.container.children.length > 2) {
            this.container.removeChild(this.container.children[0]);
        }

        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        
        // Simple icon selection based on color/type logic
        let color = '#00f0ff';
        if (type === 'error') color = '#ff2e63';
        if (type === 'success') color = '#00e676';
        if (type === 'warning') color = '#ffea00';

        toast.innerHTML = `
            <div style="background:${color}; width:8px; height:8px; border-radius:50%; box-shadow:0 0 8px ${color};"></div>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s forwards ease';
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, duration);
    }
}
