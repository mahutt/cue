class CardEditor extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="card">
                <clipboard-link class="question">
                    ${this.getAttribute('question')}
                </clipboard-link>
                <clipboard-link class="answer">
                    ${this.getAttribute('answer')}
                </clipboard-link>
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
