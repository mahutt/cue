import { NotificationBanner } from '../notificationBanner.component.js';

class deckTitle extends HTMLElement {
    connectedCallback() {
        this.input = document.createElement('input');
        this.input.classList.add('deck-name');
        this.input.type = 'text';
        this.input.name = 'name';
        this.input.value = this.getAttribute('name');
        this.input.style = `
            border: none;
            outline: none;
            margin: 0;
            padding: 0;
            color: inherit;
            background-color: transparent;
        `;

        this.appendChild(this.input);
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.patch();
            }
        });
    }

    async patch() {
        const response = await fetch(`/decks/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.input.value,
            }),
        });
        if (response.ok) {
            this.input.blur();
            NotificationBanner.instance.notify('Deck renamed!');
        } else {
            NotificationBanner.instance.notify('Could not rename deck.');
        }
    }
}
customElements.define('deck-title', deckTitle);
