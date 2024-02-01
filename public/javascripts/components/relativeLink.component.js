class relativeLink extends HTMLElement {
    connectedCallback() {
        this.style.cursor = 'pointer';
        this.addEventListener('click', () => {
            const code = this.getAttribute('href');
            const currentUrl = this.removeTrailingSlash(window.location.href);
            const newUrl = `${currentUrl}/${code}`;
            window.location.href = newUrl;
        });
    }
    removeTrailingSlash(url) {
        return url.replace(/\/+$/, '');
    }
}

customElements.define('relative-link', relativeLink);
