class DeckSettings extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        document.querySelector('#deckSettingsButton').addEventListener('click', () => {
            this.modal.show();
        });
        this.initializeResetProgressButton();
        this.initializeDeleteDeckButton();
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

    initializeDeleteDeckButton() {
        this.deleteDeckButton = this.querySelector('#deleteDeckButton');
        this.deleteDeckButton.addEventListener('click', this.deleteDeck.bind(this));
    }

    async deleteDeck() {
        this.modal.hide();
        const confirmPopup = document.querySelector('confirm-popup');
        const confirmDeletion = await confirmPopup.ask({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this deck? This action cannot be undone.',
            confirmButtonText: 'Delete',
        });

        if (!confirmDeletion) {
            return;
        }

        const response = await fetch(`/decks/${this.deckId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            customElements.get('notification-banner').instance.notify('Deck deleted.');
            document.querySelector('cue-app').navigateBack();
        } else {
            customElements.get('notification-banner').instance.notify('Could not delete deck.');
        }

        this.modal.show();
    }

    get deckId() {
        return this.getAttribute('deck-id');
    }
}
customElements.define('deck-settings', DeckSettings);
