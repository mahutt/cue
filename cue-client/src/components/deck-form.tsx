import { useRef, useState } from 'react';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';
import { Deck } from '../types';

export default function DeckForm({ courseId, addDeck }: { courseId: number; addDeck: (deck: Deck) => void }) {
    const { setNotification } = useNotification();
    const [deckName, setDeckName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const createDeck = async () => {
        const response = await api('/api/decks', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_id: courseId,
                name: deckName,
            }),
        });
        if (response.ok) {
            setDeckName('');
            inputRef.current?.blur();
            const { deck } = await response.json();
            addDeck(deck);
            setNotification('Deck created!');
        } else {
            setNotification('Could not create deck.');
        }
    };

    return (
        <div className="ms-1">
            <div className="text-secondary">Create a new deck:</div>
            <label htmlFor="name">Deck Name:</label>
            <input
                ref={inputRef}
                type="text"
                id="name"
                required
                maxLength={100}
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        createDeck();
                    }
                }}
            />
            <br />
            <button type="submit" onClick={createDeck}>
                Create Deck
            </button>
        </div>
    );
}
