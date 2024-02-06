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
                    this.front.textarea.focus();
                } else if (this.back.value.trim() === '') {
                    this.back.textarea.focus();
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
                    this.front.value = '';
                    this.back.value = '';
                    this.front.textarea.focus();

                    response.text().then((html) => {
                        const template = document.createElement('template');
                        template.innerHTML = html.trim();
                        const fragment = template.content;
                        document.querySelector('.cards').appendChild(fragment);
                    });

                    customElements.get('notification-banner').instance.notify('Card created!');
                } else {
                    customElements.get('notification-banner').instance.notify('Could not create card.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
customElements.define('card-form', CardForm);
