import { useDeck } from '../hooks/deck-hook';
import CardFace from './card-face';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';
import { Card } from '../types';

export default function CardForm({ deckId, addCard }: { deckId: number; addCard: (card: Card) => void }) {
    const { setNotification } = useNotification();
    const { formFrontValue, setFormFrontValue, formBackValue, setFormBackValue, formFrontFaceRef, formBackFaceRef } =
        useDeck();

    const createCard = async () => {
        try {
            const response = await api.post<{ card: Card }>('/api/cards', {
                front: formFrontValue.trim(),
                back: formBackValue.trim(),
                deck_id: deckId,
            });

            setFormFrontValue('');
            setFormBackValue('');
            formFrontFaceRef.current?.focus();
            const { card } = response.data;
            addCard(card);
            setNotification('Card created!');
        } catch {
            setNotification('Could not create card.');
        }
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
