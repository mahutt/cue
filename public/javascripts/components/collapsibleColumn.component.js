class CollapsibleColumn extends HTMLElement {
    connectedCallback() {
        this.isOpen = false;
        this.togglers = document.querySelectorAll(this.getAttribute('toggler'));
        this.width = this.getAttribute('width');

        this.style.overflow = 'hidden';
        this.style.transition = 'all 0.2s ease-out';

        this.togglers.forEach((toggler) => {
            toggler.addEventListener('click', () => {
                this.toggle();
            });
        });

        this.querySelectorAll('get-link').forEach((link) => {
            link.addEventListener('click', () => {
                const style = window.getComputedStyle(this);
                if (style.position === 'absolute') {
                    this.toggle();
                }
            });
        });
    }
    toggle() {
        this.style.width = this.isOpen ? '0' : '';
        this.isOpen = !this.isOpen;
    }
}

customElements.define('collapsible-column', CollapsibleColumn);
