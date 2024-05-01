export class Card {
    constructor({front, back, deckId}) {
        this.front = front;
        this.back = back;
        this.deckId = deckId;
    }
    async save() {
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
}