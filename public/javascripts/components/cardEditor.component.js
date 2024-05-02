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
        this.innerHTML = ` 
            <div class="header">
                <div>
                    <span class="card-position">${this.card.position}</span>.
                </div>
                <button class="delete">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
            <div class="body">
                <card-face></card-face>
                <card-face></card-face>
            </div>
        `;
        this.front = this.querySelector('card-face:first-child');
        this.front.side = 'front';
        this.front.value = this.card.front;

        this.back = this.querySelector('card-face:last-child');
        this.back.side = 'back';
        this.back.value = this.card.back;

        this.querySelector('.delete').addEventListener('click', () => {
            this.deleteCard();
        });

        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.updateCard();
            }
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
        const editors = document.querySelectorAll('card-editor');
        editors.forEach((editor, index) => {
            editor.card.position = index + 1;
            editor.querySelector('.card-position').textContent = editor.card.position;
        });
    }
}
customElements.define('card-editor', CardEditor);
