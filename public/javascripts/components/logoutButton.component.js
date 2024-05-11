import { NotificationBanner } from './notificationBanner.component.js';

class LogoutButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.logout);
    }

    async logout() {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            NotificationBanner.instance.notify('Could not log out.');
        }
    }
}
customElements.define('logout-button', LogoutButton);
