class StudyStack extends HTMLElement {
    connectedCallback() {
        this.deck_id = this.getAttribute('deck_id');
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.removedNodes.length > 0) {
                    this.checkIfFlippersIsEmpty();
                }
            }
        });
        observer.observe(this, { childList: true });
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                const flipper = this.querySelector('card-flipper:last-child');
                if (flipper) {
                    flipper.flip();
                }
            } else if (e.key === '1' || e.key === '2' || e.key === '3') {
                const flipper = this.querySelector('card-flipper:last-child');
                if (flipper && flipper.isFlipped) {
                    flipper.updateScore(parseInt(e.key, 10));
                }
            }
        });
    }
    checkIfFlippersIsEmpty() {
        if (this.childElementCount === 0) {
            this.displayScore();
        }
    }
    displayScore() {
        fetch(`/decks/${this.deck_id}/score`, {
            method: 'GET',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    customElements.get('notification-banner').instance.notify('Could not fetch score.');
                }
            })
            .then((data) => {
                if (!data || data.percentage === undefined) {
                    customElements.get('notification-banner').instance.notify('Could not parse score.');
                    return;
                }
                const percentage = Math.round(data.percentage);
                const flippers = document.querySelector('.flippers');
                const scoreboard = document.createElement('div');
                scoreboard.classList.add('scoreboard');
                scoreboard.innerHTML = `
                    <div class="percentage">${percentage}%</div>
                    <a class="black button" href="">again</a>
                    <a class="black button return" href="">return to deck</a>
                `;
                scoreboard.querySelector('.return').addEventListener('click', (e) => {
                    e.preventDefault();
                    const segments = window.location.pathname.split('/');
                    if (segments[segments.length - 1] !== '') {
                        segments.pop();
                    }
                    window.location.pathname = segments.join('/');
                });
                flippers.appendChild(scoreboard);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

customElements.define('study-stack', StudyStack);
