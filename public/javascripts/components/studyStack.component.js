import { NotificationBanner } from './notificationBanner.component.js';

class StudyStack extends HTMLElement {
    connectedCallback() {
        this.fetchCards().then(() => {
            this.displayTopCard();
        });
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.removedNodes.length > 0) {
                    this.displayTopCard();
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
                if (flipper && flipper.hasBeenFlipped) {
                    flipper.updateScore(parseInt(e.key, 10) - 1);
                }
            }
        });
        this.initializeEditCardButton();
    }

    async fetchCards() {
        const response = await fetch(`/decks/${this.deckId}/study`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        });

        if (response.ok) {
            this.cards = (await response.json()).cards;
        } else {
            NotificationBanner.instance.notify('Failed to fetch cards to study.');
        }
    }

    displayTopCard() {
        const topCard = this.cards.shift();
        if (topCard) {
            const flipper = document.createElement('card-flipper');
            flipper.init(topCard);
            this.appendChild(flipper);
        } else {
            this.displayScore();
        }
    }

    displayScore() {
        fetch(`/decks/${this.deckId}/score`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    NotificationBanner.instance.notify('Could not fetch score.');
                }
            })
            .then((data) => {
                if (!data || data.percentage === undefined) {
                    NotificationBanner.instance.notify('Could not parse score.');
                    return;
                }
                const percentage = Math.round(data.percentage);
                const flippers = document.querySelector('.flippers');
                const scoreboard = document.createElement('div');
                scoreboard.classList.add('scoreboard');
                scoreboard.innerHTML = `
                    <div class="percentage">${percentage}%</div>
                    <get-link action="" target="#content" class="black button">again</get-link>
                    <get-link action="../" target="#content" class="black button return">return to deck</get-link>
                `;
                flippers.appendChild(scoreboard);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    initializeEditCardButton() {
        this.editCardButton = document.getElementById('editCardButton');
        this.editCardButton.addEventListener('click', () => {
            this.currentCard.edit();
        });
    }

    get deckId() {
        return this.getAttribute('deck-id');
    }

    get currentCard() {
        return this.querySelector('card-flipper');
    }
}

customElements.define('study-stack', StudyStack);
