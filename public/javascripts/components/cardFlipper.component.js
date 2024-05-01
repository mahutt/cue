class CardFlipper extends HTMLElement {
    connectedCallback() {
        this.isFlipped = false;
        this.hasBeenFlipped = false;

        this.front = document.createElement('card-face');
        this.front.setReadOnly(true);
        this.front.side = 'front';

        this.back = document.createElement('card-face');
        this.back.setReadOnly(true);
        this.back.side = 'back';
        this.back.hide();

        this.divider = document.createElement('div');
        this.divider.classList.add('divider');
        this.divider.style = `
            width: 100%;
            height: 2px;
            border-radius: 1px;
        `;
        this.divider.style.display = 'none';

        this.setFaceContent();
        this.appendChild(this.front);
        this.appendChild(this.divider);
        this.appendChild(this.back);

        this.scores = document.createElement('div');
        this.scores.classList.add('scores');
        this.scores.style.display = 'none';
        this.scores.innerHTML = `
            <div score="0"><i class="bi bi-emoji-tear-fill"></i></div>
            <div score="1"><i class="bi bi-emoji-neutral-fill"></i></div>
            <div score="2"><i class="bi bi-emoji-sunglasses-fill"></i></div>
        `;
        this.scores.querySelectorAll('div').forEach((div) => {
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateScore(parseInt(div.getAttribute('score'), 10));
            });
        });
        this.appendChild(this.scores);

        this.editButtonsDiv = document.createElement('div');
        this.editButtonsDiv.classList.add('editButtonsDiv');
        this.editButtonsDiv.style.display = 'none';
        this.editButtonsDiv.innerHTML = `
            <a id="cancelEdit" role="button" class="btn btn-dark p-2" style="width: 50px;"><i class="bi bi-slash-circle"></i></a>
            <a id="saveEdit" role="button" class="btn btn-dark p-2" style="width: 50px;"><i class="bi bi-check"></i></a>
        `;
        this.editButtonsDiv.querySelector('#cancelEdit').addEventListener('click', (e) => {
            e.stopPropagation();
            this.setFaceContent();
            this.stopEditing();
        });
        this.editButtonsDiv.querySelector('#saveEdit').addEventListener('click', async (e) => {
            e.stopPropagation();
            const updateSuccessful = await this.updateCard();
            if (updateSuccessful) {
                this.setAttribute('front', this.front.value);
                this.setAttribute('back', this.back.value);
            }
            this.setFaceContent();
            this.stopEditing();
        });
        this.appendChild(this.editButtonsDiv);

        this.addEventListener('click', this.flip);
        this.classList.add('rounded');
    }
    flip() {
        if (this.editing) {
            return;
        }
        this.isFlipped = !this.isFlipped;
        if (this.isFlipped) {
            this.front.hide();
            this.back.show();
            this.back.resize();
        } else {
            this.front.show();
            this.back.hide();
            this.front.resize();
        }

        this.hasBeenFlipped = true;
        this.scores.style.display = 'flex';
    }
    updateScore(score) {
        fetch(`/cards/${this.getAttribute('card-id')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: score,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    this.remove();
                } else {
                    customElements.get('notification-banner').instance.notify('Could not update score.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    init({ id, front, back, score }) {
        this.setAttribute('card-id', id);
        this.setAttribute('front', front);
        this.setAttribute('back', back);
        this.setAttribute('score', score);
    }

    async updateCard() {
        const response = await fetch(`/cards/${this.getAttribute('card-id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: this.front.value,
                back: this.back.value,
            }),
        });
        if (response.ok) {
            customElements.get('notification-banner').instance.notify('Card updated!');
            return true;
        } else {
            customElements.get('notification-banner').instance.notify('Could not update card.');
            return false;
        }
    }

    edit() {
        this.editing = true;
        this.front.setReadOnly(false);
        this.back.setReadOnly(false);

        this.front.show();
        this.back.show();

        this.scores.style.display = 'none';
        this.editButtonsDiv.style.display = 'flex';
        this.divider.style.display = '';

        this.front.resize();
        this.back.resize();

        this.front.textarea.focus();
    }

    stopEditing() {
        this.editing = false;
        this.front.setReadOnly(true);
        this.back.setReadOnly(true);

        this.back.hide();
        this.isFlipped = false;

        this.editButtonsDiv.style.display = 'none';
        this.divider.style.display = 'none';
    }

    setFaceContent() {
        this.front.value = this.getAttribute('front');
        this.back.value = this.getAttribute('back');
    }

    get score() {
        return this.getAttribute('score');
    }
}
customElements.define('card-flipper', CardFlipper);
