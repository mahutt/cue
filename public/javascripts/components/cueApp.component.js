class CueApp extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {}

    navigateBack() {
        const url = new URL(document.location.href);
        const segments = url.pathname.split('/');
        segments.pop();
        url.pathname = segments.join('/');
        document.location.href = url.toString();
    }
}

customElements.define('cue-app', CueApp);
