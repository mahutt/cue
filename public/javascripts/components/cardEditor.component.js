import { Card } from '../classes/card.js';
import { NotificationBanner } from './notificationBanner.component.js';
class CardEditor extends HTMLElement {
    constructor() {
        super();
        this.card = new Card({
            id: this.getAttribute('id'),
            front: this.getAttribute('front'),
            back: this.getAttribute('back'),
            position: this.getAttribute('position'),
        });
    }

    connectedCallback() {
        this.deleteButton = document.createElement('button');
        this.deleteButton.classList.add('trash');
        this.deleteButton.innerHTML = `
            <i class="bi-trash3"></i>
        `;

        this.header = document.createElement('div');
        this.header.classList.add('header');
        this.header.innerHTML = `<div class="card-position">${this.card.position}</div>`;
        this.header.appendChild(this.deleteButton);
        this.appendChild(this.header);

        this.body = document.createElement('div');
        this.body.classList.add('body');

        this.front = document.createElement('card-face');
        this.front.side = 'front';
        this.front.value = this.card.front;
        this.body.appendChild(this.front);

        this.back = document.createElement('card-face');
        this.back.side = 'back';
        this.back.value = this.card.back;
        this.body.appendChild(this.back);

        this.appendChild(this.body);

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
            this.setCardPositions();
        } else {
            NotificationBanner.instance.notify('Could not delete card.');
        }
    }

    setCardPositions() {
        const cards = document.querySelectorAll('card-editor');
        cards.forEach((card, index) => {
            card.card.position = index + 1;
            card.header.querySelector('.card-position').textContent = card.card.position;
        });
    }
}
customElements.define('card-editor', CardEditor);
