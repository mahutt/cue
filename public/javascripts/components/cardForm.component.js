import { NotificationBanner } from './notificationBanner.component.js';

class CardForm extends HTMLElement {
    connectedCallback() {
        this.front = document.createElement('card-face');
        this.front.side = 'front';
        this.front.placeholder = 'front';
        this.appendChild(this.front);

        this.back = document.createElement('card-face');
        this.back.side = 'back';
        this.back.placeholder = 'back';
        this.appendChild(this.back);

        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.front.value.trim() === '') {
                    this.setCursor('front');
                } else if (this.back.value.trim() === '') {
                    this.setCursor('back');
                } else {
                    this.createCard();
                }
            }
        });
    }

    // Create this card.
    createCard() {
        fetch('/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: this.front.value,
                back: this.back.value,
                deck_id: this.getAttribute('deck_id'),
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.front.clear();
                    this.back.clear();
                    this.setCursor('front');

                    response.text().then((html) => {
                        const template = document.createElement('template');
                        template.innerHTML = html.trim();
                        const fragment = template.content;

                        const cards = document.querySelector('.cards');
                        cards.appendChild(fragment);
                        // 0 second timeout defers execution
                        setTimeout(() => {
                            cards.scrollTop = cards.scrollHeight;
                        }, 0);
                    });

                    NotificationBanner.instance.notify('Card created!');
                } else {
                    NotificationBanner.instance.notify('Could not create card.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    setCursor(side = 'front') {
        this[side].textarea.focus();
    }
}
customElements.define('card-form', CardForm);
