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
        this.renderHeader();

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
    }

    renderHeader() {
        const header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = `
            <div class="card-position">
                ${this.card.position}
            </div>
            <button class="delete">
                <i class="bi bi-trash3"></i>
            </button>
        
        `;
        header.querySelector('.delete').addEventListener('click', () => {
            this.deleteCard();
        });
        this.appendChild(header);
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
        const editors = document.querySelectorAll('card-editor');
        editors.forEach((editor, index) => {
            editor.card.position = index + 1;
            editor.querySelector('.card-position').textContent = editor.card.position;
        });
    }
}
customElements.define('card-editor', CardEditor);
