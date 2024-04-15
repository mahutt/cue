class getLink extends HTMLElement {
    connectedCallback() {
        if (this.getAttribute('bootstrap') !== null) {
            this.get();
        }
        this.style.cursor = 'pointer';
        this.addEventListener('click', this.get);
    }
    async get() {
        const route = this.getRoute();
        const html = await document.querySelector('cue-app').fetchContent(route);
        const query = this.getAttribute('target');
        const target = document.querySelector(query);
        target.innerHTML = html;
    }
    getRoute() {
        let route = this.getAttribute('action');
        if (route.startsWith('/')) {
            return route;
        } else if (route.startsWith('../')) {
            const segments = window.location.pathname.split('/');
            if (segments[segments.length - 1] === '') {
                segments.pop();
            }
            segments.pop();
            return segments.join('/');
        } else {
            const base = this.removeTrailingSlash(window.location.href);
            return `${base}/${route}`;
        }
    }
    removeTrailingSlash(href) {
        return href.replace(/\/+$/, '');
    }
}

customElements.define('get-link', getLink);
