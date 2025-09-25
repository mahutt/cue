import { useRef, useState, useEffect } from 'react';
import { Deck } from '../types';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';

export default function DeckTitle({ deck }: { deck: Deck }) {
    const { notify } = useNotification();
    const inputRef = useRef<HTMLInputElement>(null);
    const [deckName, setDeckName] = useState(deck.name);

    useEffect(() => {
        setDeckName(deck.name);
    }, [deck]);

    const renameDeck = async () => {
        try {
            await api.patch(`/decks/${deck.id}`, {
                name: deckName,
            });
            inputRef.current?.blur();
            notify('Deck renamed!');
        } catch {
            notify('Could not rename deck.');
        }
    };

    return (
        <div className="deck-title">
            <input
                ref={inputRef}
                className="deck-name"
                type="text"
                name="name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                style={{
                    border: 'none',
                    outline: 'none',
                    margin: 0,
                    padding: 0,
                    color: 'inherit',
                    backgroundColor: 'transparent',
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        renameDeck();
                    }
                }}
            />
        </div>
    );
}
