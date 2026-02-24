export class Toast {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'ri-information-line';
        if (type === 'success') icon = 'ri-check-line';
        if (type === 'error') icon = 'ri-error-warning-line';

        toast.innerHTML = `
            <i class="${icon} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }
}

// Global instance
const toast = new Toast();
window.showToast = (msg, type) => toast.show(msg, type); // Global access for simplicity
