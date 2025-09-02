import { useDeck } from '../hooks/deck-hook';
import CardFace from './card-face';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';
import { Card } from '../types';

export default function CardForm({ deckId, addCard }: { deckId: number; addCard: (card: Card) => void }) {
    const { setNotification } = useNotification();
    const { formFrontValue, setFormFrontValue, formBackValue, setFormBackValue, formFrontFaceRef, formBackFaceRef } =
        useDeck();

    const createCard = async () => {
        const response = await api('/api/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: formFrontValue.trim(),
                back: formBackValue.trim(),
                deck_id: deckId,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            setNotification('Could not create card.');
            return;
        }

        setFormFrontValue('');
        setFormBackValue('');
        formFrontFaceRef.current?.focus();
        const { card }: { card: Card } = await response.json();
        addCard(card);
        setNotification('Card created!');
    };

    return (
        <div
            className="card-form cue-card"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (formFrontValue.trim() === '') {
                        formFrontFaceRef.current?.focus();
                    } else if (formBackValue.trim() === '') {
                        formBackFaceRef.current?.focus();
                    } else {
                        createCard();
                    }
                }
            }}
        >
            <CardFace
                ref={formFrontFaceRef}
                side="front"
                value={formFrontValue}
                setValue={setFormFrontValue}
                placeholder="front"
                resettable={false}
            />
            <CardFace
                ref={formBackFaceRef}
                side="back"
                value={formBackValue}
                setValue={setFormBackValue}
                placeholder="back"
                resettable={false}
            />
        </div>
    );
}
