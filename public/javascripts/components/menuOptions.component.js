class MenuOptions extends HTMLElement {
    connectedCallback() {
        const menuBar = document.querySelector('menu-bar');
        menuBar.setMenuOptions(this.children);
    }
}

customElements.define('menu-options', MenuOptions);
