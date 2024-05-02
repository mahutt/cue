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
                <card-face>
                    <a role="button" class="undo-button">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </a>
                </card-face>
                <card-face>
                    <a role="button" class="undo-button">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </a>
                </card-face>
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

        for (const face of [this.front, this.back]) {
            face.addEventListener('input', () => {
                this.setEditState([face]);
            });
        }

        for (const button of this.querySelectorAll('.undo-button')) {
            button.addEventListener('click', (e) => {
                const face = e.target.closest('card-face');
                this.resetFace([face]);
                face.textarea.focus();
            });
        }
    }

    // Updating this card.
    async updateCard() {
        if (this.card.front === this.front.value && this.card.back === this.back.value) {
            document.querySelector('card-form').setCursor();
            return;
        }
        this.front.trim();
        this.back.trim();
        this.card.front = this.front.value;
        this.card.back = this.back.value;
        const response = await this.card.update();

        if (response.ok) {
            this.setEditState([this.front, this.back]);
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

    resetFace(faces = []) {
        for (const face of faces) {
            face.value = this.card[face.side];
        }
        this.setEditState(faces);
    }

    setEditState(faces = []) {
        for (const face of faces) {
            if (face.value === this.card[face.side]) {
                face.classList.remove('edited');
            } else {
                face.classList.add('edited');
            }
        }
    }
}
customElements.define('card-editor', CardEditor);
