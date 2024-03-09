class DeckForm extends HTMLElement {
    connectedCallback() {
        this.courseId = this.querySelector('#course-id');

        this.name = this.querySelector('#name');
        this.name.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.createDeck();
            }
        });

        this.button = this.querySelector('button');
        this.button.addEventListener('click', (e) => {
            this.createDeck();
        });
    }

    async createDeck() {
        const response = await fetch('/decks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_id: this.courseId.value,
                name: this.name.value,
            }),
        });
        if (response.ok) {
            this.name.value = '';
            this.name.blur();

            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            const deck = template.content;
            const decks = document.querySelector('.decks');
            decks.appendChild(deck);

            customElements.get('notification-banner').instance.notify('Deck created!');
        } else {
            customElements.get('notification-banner').instance.notify('Could not create deck.');
        }
    }
}

customElements.define('deck-form', DeckForm);
