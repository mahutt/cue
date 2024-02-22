class CardFace extends HTMLElement {
    get value() {
        return this.textarea.value;
    }
    set value(value) {
        this.textarea.value = value;
    }
    connectedCallback() {
        this.textarea = document.createElement('textarea');
        this.textarea.classList.add(this.side);
        this.textarea.textContent = this.content || '';
        this.textarea.placeholder = this.placeholder || '';

        this.textarea.style = `
            width: 100%;
            border: none;
            outline: none;
            margin: 0;
            padding: 0;
            font: inherit;
            color: inherit;
            background-color: transparent;
            resize: none;
        `;
        this.appendChild(this.textarea);

        // 0 second timeout defers execution so that resize applies correctly
        setTimeout(() => {
            this.resize();
        }, 0);
        this.textarea.addEventListener(
            'input',
            (e) => {
                this.resize();
            },
            false
        );
        this.textarea.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key === 'Enter') {
                e.stopPropagation();
            }
        });
        this.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey) {
                this.fillFormField();
            }
        });
    }

    fillFormField() {
        const cardForm = document.querySelector('card-form');
        if (cardForm) {
            cardForm[this.side].value = this.value;
            cardForm[this.side].resize();
            cardForm[this.side].textarea.focus();
        }
    }

    resize() {
        this.textarea.style.height = 'fit-content';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
}
customElements.define('card-face', CardFace);
