class CardEditor extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="card">
                <card-face
                    id="${this.getAttribute('id')}"
                    type="question"
                    value="${this.getAttribute('question')}">
                </card-face>
                <card-face
                    id="${this.getAttribute('id')}"
                    type="answer"
                    value="${this.getAttribute('answer')}">
                </card-face>
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
        this.querySelector('button').addEventListener('click', (event) => {
            this.deleteCard();
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
