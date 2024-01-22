class ClipboardLink extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', () => {
            navigator.clipboard
                .writeText(this.innerText)
                .then(() => console.log('Text copied to clipboard'))
                .catch((err) => console.error('Error copying text: ', err));
        });
    }
}

customElements.define('clipboard-link', ClipboardLink);
