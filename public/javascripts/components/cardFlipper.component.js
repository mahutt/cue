class CardFlipper extends HTMLElement {
    connectedCallback() {
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
            <div>1</div>
            <div>2</div>
            <div>3</div>
        `;
        this.scores.querySelectorAll('div').forEach((div) => {
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.updateScore(parseInt(e.target.innerHTML, 10));
            });
        });
        this.appendChild(this.scores);

        this.addEventListener('click', () => {
            this.front.style.display = this.back.style.display;
            this.back.style.display = this.back.style.display === 'none' ? 'block' : 'none';
            this.scores.style.display = 'flex';
        });
    }
    updateScore(score) {
        fetch(`/cards/${this.getAttribute('id')}`, {
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
}
customElements.define('card-flipper', CardFlipper);
