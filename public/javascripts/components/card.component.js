class CardEditor extends HTMLElement {
    // @here tryna make update work! (patch request)
    connectedCallback() {
        this.innerHTML = `
            <style>
                .question, .answer {
                    border: none;
                    outline: none;
                    margin: 0;
                    padding: 0;
                    font: inherit;
                    color: inherit;
                    background-color: transparent;
                }
            </style>
            <div class="card">
                <input type="text" name="question" class="question" value="${this.getAttribute('question')}" />
                <input type="text" name="answer" class="answer" value="${this.getAttribute('answer')}" />
                <a
                    href="/cards/${this.getAttribute('id')}"
                    style="width: 16px; height: 16px"
                >
                    <img
                        src="/icons/edit.svg"
                        alt="Edit"
                        style="width: 100%; height: 100%"
                    />
                </a>
                <button
                    style="width: 16px; height: 16px"
                >
                    <img
                        src="/icons/trash.svg"
                        alt="Trash"
                        style="width: 100%; height: 100%"
                    />
                </button>
            </div>
        `;
        this.querySelectorAll('input').forEach((field) => {
            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.updateCard(field);
                }
            });
        });
        this.querySelector('button').addEventListener('click', (event) => {
            this.deleteCard();
        });
    }

    updateCard(field) {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                column: field.name,
                value: field.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    field.blur();
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
