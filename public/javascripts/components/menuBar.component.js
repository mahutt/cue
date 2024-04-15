class MenuBar extends HTMLElement {
    connectedCallback() {
        this.navigateBackButton = this.querySelector('#navigateBack');
        this.navigateBackButton.addEventListener('click', () => {
            document.querySelector('cue-app').navigateBack();
        });
        this.dynamicDiv = this.querySelector('#dynamic');
    }

    setMenuOptions(nodeList) {
        const div = this.dynamicDiv;
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        for (const node of nodeList) {
            div.appendChild(node);
        }
    }
}

customElements.define('menu-bar', MenuBar);
