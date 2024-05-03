class DeckRating extends HTMLElement {
    connectedCallback() {
        this.value = parseInt(this.getAttribute('value'));
        this.innerHTML = `${this.value}%`;

        if (this.value > 90) {
            this.style.color = 'var(--green)';
        } else if (this.value > 50) {
            this.style.color = 'var(--yellow)';
        } else {
            this.style.color = 'var(--red)';
        }
    }
}
customElements.define('deck-rating', DeckRating);
