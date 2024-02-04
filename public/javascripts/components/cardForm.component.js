class CardForm extends HTMLElement {
    connectedCallback() {
        this.question = document.createElement('card-face');
        this.question.side = 'question';
        this.appendChild(this.question);

        this.answer = document.createElement('card-face');
        this.answer.side = 'answer';
        this.appendChild(this.answer);

        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.createCard();
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
                question: this.question.value,
                answer: this.answer.value,
                deck_id: this.getAttribute('deck_id'),
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.question.value = '';
                    this.answer.value = '';
                    this.question.textarea.focus();

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
