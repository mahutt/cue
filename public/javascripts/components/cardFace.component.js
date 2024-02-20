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
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.stopPropagation();
                var cursorPos = this.textarea.selectionStart;
                var textBeforeCursor = this.textarea.value.substring(0, cursorPos);
                var textAfterCursor = this.textarea.value.substring(cursorPos);
                this.textarea.value = textBeforeCursor + '\n' + textAfterCursor;
                this.textarea.selectionStart = cursorPos + 1;
                this.textarea.selectionEnd = cursorPos + 1;
                this.resize();
            }
        });
    }

    resize() {
        this.textarea.style.height = 'fit-content';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
}
customElements.define('card-face', CardFace);
