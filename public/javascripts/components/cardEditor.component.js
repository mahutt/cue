class CardEditor extends HTMLElement {
    connectedCallback() {
        this.question = document.createElement('card-face');
        this.question.side = 'question';
        this.question.content = this.getAttribute('question');
        this.appendChild(this.question);

        this.answer = document.createElement('card-face');
        this.answer.side = 'answer';
        this.answer.content = this.getAttribute('answer');
        this.appendChild(this.answer);

        this.deleteButton = document.createElement('button');
        this.deleteButton.style = 'width: 16px; height: 16px';
        this.deleteButton.innerHTML = `
            <img
                src="/icons/trash.svg"
                alt="Trash"
                style="width: 100%; height: 100%"
            />
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
    updateCard() {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: this.question.value,
                answer: this.answer.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.question.textarea.blur();
                    this.answer.textarea.blur();
                    customElements.get('notification-banner').instance.notify('Card updated!');
                } else {
                    customElements.get('notification-banner').instance.notify('Could not update card.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Deleting this card.
    deleteCard() {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    this.remove();
                    customElements.get('notification-banner').instance.notify('Card deleted!');
                } else {
                    customElements.get('notification-banner').instance.notify('Could not delete card.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
customElements.define('card-editor', CardEditor);
