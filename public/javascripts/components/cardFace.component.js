class CardFace extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <textarea type="text" class="${this.getAttribute('type')}">${this.getAttribute('value')}</textarea>
        `;
        this.field = this.querySelector('textarea');
        this.field.style = `
            border: none;
            outline: none;
            margin: 0;
            padding: 0;
            font: inherit;
            color: inherit;
            background-color: transparent;
            resize: none;
        `;
        // 0 second timeout defers execution so that resize applies correctly
        setTimeout(() => {
            this.resize();
        }, 0);
        this.field.addEventListener(
            'input',
            (e) => {
                this.resize();
            },
            false
        );
        this.field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.updateFace();
            }
        });
    }

    resize() {
        this.field.style.height = 'fit-content';
        this.field.style.height = this.field.scrollHeight + 'px';
    }

    updateFace() {
        fetch(`/cards/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                column: this.getAttribute('type'),
                value: this.field.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.field.blur();
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
