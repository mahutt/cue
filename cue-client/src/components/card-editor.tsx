import { useState } from 'react';
import { Card } from '../types';
import CardFace from './card-face';
import api from '../api';
import { useNotification } from '../hooks/notification-hook';
import { useDeck } from '../hooks/deck-hook';
import { Trash2 } from 'lucide-react';

export function CardEditor({
    position,
    card,
    setCard,
    removeCard,
}: {
    position: number;
    card: Card;
    setCard: (card: Card) => void;
    removeCard: () => void;
}) {
    const { setFormFrontValue, setFormBackValue, formFrontFaceRef, formBackFaceRef, focusForm, belongs } = useDeck();
    const { setNotification } = useNotification();

    const [frontValue, setFrontValue] = useState(card.front);
    const [backValue, setBackValue] = useState(card.back);

    const updateCard = async () => {
        if (card.front === frontValue && card.back === backValue) {
            focusForm();
            return;
        }

        // @improve: check if sanitized string is different from original
        const sanitizedFrontValue = frontValue.trim();
        const sanitizedBackValue = backValue.trim();

        try {
            const response = await api.patch<{ card: Card }>(`/cards/${card.id}`, {
                front: sanitizedFrontValue,
                back: sanitizedBackValue,
            });
            const updatedCard = response.data.card;
            setCard(updatedCard);
            focusForm();
            setNotification('Card updated!');
        } catch (error) {
            setNotification('Could not update card.');
        }
    };

    const deleteCard = async () => {
        try {
            await api.delete(`/cards/${card.id}`);
            removeCard();
            focusForm();
            setNotification('Card deleted!');
        } catch {
            setNotification('Could not delete card.');
        }
    };

    return (
        <div
            className="card-editor"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    updateCard();
                }
            }}
        >
            <div className="header">
                <div>
                    <span className="card-position">{position}</span>.
                </div>
                {belongs && (
                    <button className="delete" onClick={deleteCard}>
                        <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                )}
            </div>
            <div className="body">
                <CardFace
                    side="front"
                    value={frontValue}
                    setValue={setFrontValue}
                    edited={frontValue !== card.front}
                    reset={() => {
                        setFrontValue(card.front);
                    }}
                    onCommandClick={() => {
                        setFormFrontValue(frontValue);
                        formFrontFaceRef.current?.focus();
                    }}
                />
                <CardFace
                    side="back"
                    value={backValue}
                    setValue={setBackValue}
                    edited={backValue !== card.back}
                    reset={() => {
                        setBackValue(card.back);
                    }}
                    onCommandClick={() => {
                        setFormBackValue(backValue);
                        formBackFaceRef.current?.focus();
                    }}
                />
            </div>
        </div>
    );
}
