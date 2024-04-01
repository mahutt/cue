class DeckSettings extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        document.querySelector('#deckSettingsButton').addEventListener('click', () => {
            this.modal.show();
        });
        this.initializeResetProgressButton();
    }

    initializeResetProgressButton() {
        this.resetProgressButton = this.querySelector('#resetProgressButton');
        this.resetProgressButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const response = await fetch(`/decks/${this.deckId}/progress`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            this.modal.hide();
            if (response.ok) {
                customElements.get('notification-banner').instance.notify('Progress reset.');
            } else {
                customElements.get('notification-banner').instance.notify('Could not reset progress.');
            }
        });
    }

    get deckId() {
        return this.getAttribute('deck-id');
    }
}
customElements.define('deck-settings', DeckSettings);
