class CardFlipper extends HTMLElement {
    connectedCallback() {
        this.isFlipped = false;
        this.front = document.createElement('div');
        this.front.innerHTML = this.getAttribute('front');
        this.appendChild(this.front);

        this.back = document.createElement('div');
        this.back.innerHTML = this.getAttribute('back');
        this.back.style.display = 'none';
        this.appendChild(this.back);

        this.scores = document.createElement('div');
        this.scores.classList.add('scores');
        this.scores.style.display = 'none';
        this.scores.innerHTML = `
            <div score="0"><i class="bi bi-emoji-tear-fill"></i></div>
            <div score="1"><i class="bi bi-emoji-neutral-fill"></i></div>
            <div score="2"><i class="bi bi-emoji-sunglasses-fill"></i></i></div>
        `;
        this.scores.querySelectorAll('div').forEach((div) => {
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateScore(parseInt(div.getAttribute('score'), 10));
            });
        });
        this.appendChild(this.scores);
        this.addEventListener('click', this.flip);
        this.classList.add('rounded');
    }
    flip() {
        this.isFlipped = true;
        this.front.style.display = this.back.style.display;
        this.back.style.display = this.back.style.display === 'none' ? 'block' : 'none';
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

    get score() {
        return this.getAttribute('score');
    }
}
customElements.define('card-flipper', CardFlipper);
