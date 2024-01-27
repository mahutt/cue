class NotificationBanner extends HTMLElement {
    static get instance() {
        let notificationBanner = document.querySelector('notification-banner');
        if (notificationBanner === null) {
            notificationBanner = document.createElement('notification-banner');
            document.body.appendChild(notificationBanner);
        }
        return notificationBanner;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.style = `
            position: fixed;
            color: white;
            background-color: black;
            text-align: center;
            white-space: nowrap;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            pointer-events: none;
            left: 50%;
            transform: translateX(-50%);
            top: 1rem;

            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
    }

    notify(message) {
        this.innerHTML = message;
        this.style.opacity = '1';
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.timeoutId = setTimeout(() => {
            this.style.opacity = '0';
        }, 3000);
    }
}
customElements.define('notification-banner', NotificationBanner);
