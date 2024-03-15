class CardEditor extends HTMLElement {
    connectedCallback() {
        this.front = document.createElement('card-face');
        this.front.side = 'front';
        this.front.content = this.getAttribute('front');
        this.appendChild(this.front);

        this.back = document.createElement('card-face');
        this.back.side = 'back';
        this.back.content = this.getAttribute('back');
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
    updateCard() {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: this.front.value,
                back: this.back.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.front.textarea.blur();
                    this.back.textarea.blur();
                    document.querySelector('card-form').setCursor();
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
