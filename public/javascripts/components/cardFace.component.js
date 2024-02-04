class CardFace extends HTMLElement {
    get value() {
        return this.textarea.value;
    }
    set value(value) {
        this.textarea.value = value;
    }
    connectedCallback() {
        this.textarea = document.createElement('textarea');
        this.textarea.classList.add(this.getAttribute('side'));
        this.textarea.textContent = this.getAttribute('value') || '';

        this.textarea.style = `
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
        // If id is not set, this face component is being used in a form.
        if (this.getAttribute('id') !== null) {
            this.textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.updateFace();
                }
            });
        }
    }

    resize() {
        this.textarea.style.height = 'fit-content';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }

    updateFace() {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                column: this.getAttribute('type'),
                value: this.textarea.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.textarea.blur();
                    customElements.get('notification-banner').instance.notify('Card updated!');
                } else {
                    customElements.get('notification-banner').instance.notify('Could not update card.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
customElements.define('card-face', CardFace);
