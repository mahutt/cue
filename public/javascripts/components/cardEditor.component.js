import { Card } from '../classes/card.js';
import { NotificationBanner } from './notificationBanner.component.js';
class CardEditor extends HTMLElement {
    constructor() {
        super();
        this.card = new Card({
            id: this.getAttribute('id'),
            front: this.getAttribute('front'),
            back: this.getAttribute('back'),
        });
    }

    connectedCallback() {
        this.front = document.createElement('card-face');
        this.front.side = 'front';
        this.front.value = this.card.front;
        this.appendChild(this.front);

        this.back = document.createElement('card-face');
        this.back.side = 'back';
        this.back.value = this.card.back;
        this.appendChild(this.back);

        this.deleteButton = document.createElement('button');
        this.deleteButton.classList.add('trash');
        this.deleteButton.style = 'width: 16px; height: 16px';
        this.deleteButton.innerHTML = `
            <i class="bi bi-trash3"></i>
        `;
        this.appendChild(this.deleteButton);

        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.updateCard();
            }
        });
        this.deleteButton.addEventListener('click', (event) => {
            this.deleteCard();
        });
    }

    // Updating this card.
    async updateCard() {
        this.card.front = this.front.value;
        this.card.back = this.back.value;
        const response = await this.card.update();

        if (response.ok) {
            this.front.textarea.blur();
            this.back.textarea.blur();
            document.querySelector('card-form').setCursor();
            NotificationBanner.instance.notify('Card updated!');
        } else {
            NotificationBanner.instance.notify('Could not update card.');
        }
    }

    // Deleting this card.
    async deleteCard() {
        const response = await this.card.delete();
        if (response.ok) {
            this.remove();
            NotificationBanner.instance.notify('Card deleted!');
        } else {
            NotificationBanner.instance.notify('Could not delete card.');
        }
    }
}
customElements.define('card-editor', CardEditor);
