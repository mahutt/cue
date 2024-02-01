class deckTitle extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .deck-name {
                    border: none;
                    outline: none;
                    margin: 0;
                    padding: 0;
                    font: inherit;
                    color: inherit;
                    background-color: transparent;
                }
            </style>
            <form
                hx-patch="/decks/${this.getAttribute('id')}"
                hx-swap="none"
            >
                <input type="text" name="name" class="deck-name" value="${this.getAttribute('name')}" />
            </form>
        `;
    }
}
customElements.define('deck-title', deckTitle);
