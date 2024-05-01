export class Card {
    constructor({ id, front, back, score, deckId }) {
        this.setAttributes({ id, front, back, score, deckId });
    }

    setAttributes({ id, front, back, score, deckId }) {
        this.id = id;
        this.front = front;
        this.back = back;
        this.score = score;
        this.deckId = deckId;
    }

    async create() {
        const response = await fetch('/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: this.front,
                back: this.back,
                deck_id: this.deckId,
            }),
        });
        return response;
    }

    async update() {
        const response = await fetch(`/cards/${this.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: this.front,
                back: this.back,
            }),
        });
        return response;
    }

    async updateScore() {
        const response = await fetch(`/cards/${this.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: this.score,
            }),
        });
        return response;
    }

    async delete() {
        const response = await fetch(`/cards/${this.id}`, {
            method: 'DELETE',
        });
        return response;
    }
}
