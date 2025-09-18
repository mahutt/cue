import { useDeck } from '../hooks/deck-hook';
import CardFace from './card-face';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';
import { Card, PendingCard } from '../types';

export default function CardForm({
    deckId,
    addPendingCard,
}: {
    deckId: number;
    addPendingCard: (card: PendingCard) => void;
}) {
    const { setNotification } = useNotification();
    const { formFrontValue, setFormFrontValue, formBackValue, setFormBackValue, formFrontFaceRef, formBackFaceRef } =
        useDeck();

    const createCard = async () => {
        try {
            const promise = api
                .post<{ card: Card }>('/api/cards', {
                    front: formFrontValue.trim(),
                    back: formBackValue.trim(),
                    deck_id: deckId,
                })
                .then(({ data }) => data.card);

            addPendingCard({ id: Date.now(), front: formFrontValue.trim(), back: formBackValue.trim(), promise });

            setFormFrontValue('');
            setFormBackValue('');
            formFrontFaceRef.current?.focus();
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
