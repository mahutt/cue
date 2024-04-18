class CueApp extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {}

    async navigateBack() {
        const url = new URL(document.location.href);
        const segments = url.pathname.split('/');
        if (segments[segments.length - 1] === '') {
            segments.pop();
        }
        segments.pop();
        url.pathname = segments.join('/');

        const html = await this.fetchContent(url.toString());
        document.querySelector('#content').innerHTML = html;
    }

    async fetchContent(route) {
        const response = await fetch(route, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        history.pushState({ internal: true }, 'New Page Title', `${route}`);
        const html = await response.text();
        return html;
    }
}

customElements.define('cue-app', CueApp);
