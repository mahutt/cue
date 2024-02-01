class CardEditor extends HTMLElement {
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
                    resize: none;
                }
            </style>
            <div class="card">
                <textarea type="text" name="question" class="question">${this.getAttribute('question')}</textarea>
                <textarea type="text" name="answer" class="answer">${this.getAttribute('answer')}</textarea>
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
        this.querySelectorAll('textarea').forEach((field) => {
            // 0 second timeout defers execution so that resize applies correctly
            setTimeout(() => {
                this.resize(field);
            }, 0);
            field.addEventListener(
                'input',
                (e) => {
                    this.resize(field);
                },
                false
            );
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

    resize(field) {
        field.style.height = 'fit-content';
        field.style.height = field.scrollHeight + 'px';
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
