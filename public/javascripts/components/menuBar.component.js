class MenuBar extends HTMLElement {
    connectedCallback() {
        this.dynamicDiv = this.querySelector('#dynamic');
    }

    setMenuOptions(nodeList) {
        const div = this.dynamicDiv;
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        for (const node of nodeList) {
            console.log(node);
            div.appendChild(node);
        }
    }
}

customElements.define('menu-bar', MenuBar);
