class getLink extends HTMLElement {
    connectedCallback() {
        if (this.getAttribute('bootstrap') !== null) {
            this.get();
        }
        this.style.cursor = 'pointer';
        this.addEventListener('click', this.get);
    }
    get() {
        const route = this.getRoute();
        fetch(route, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((html) => {
                const query = this.getAttribute('target');
                const target = document.querySelector(query);
                target.innerHTML = html;
                history.pushState({ internal: true }, 'New Page Title', `${route}`);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
