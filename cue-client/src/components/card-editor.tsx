import { useState } from 'react';
import { Card } from '../types';
import CardFace from './card-face';
import { api } from '../api';
import { useNotification } from '../hooks/notification-hook';
import { useDeck } from '../hooks/deck-hook';

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
    const { setFormFrontValue, setFormBackValue, formFrontFaceRef, formBackFaceRef, focusForm } = useDeck();
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

        const response = await api(`/cards/${card.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                front: sanitizedFrontValue,
                back: sanitizedBackValue,
            }),
        });

        if (response.ok) {
            const updatedCard = ((await response.json()) as { card: Card }).card;
            setCard(updatedCard);
            focusForm();
            setNotification('Card updated!');
        } else {
            setNotification('Could not update card.');
        }
    };

    const deleteCard = async () => {
        const response = await api(`/cards/${card.id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            removeCard();
            focusForm();
            setNotification('Card deleted!');
        } else {
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
                <button className="delete" onClick={deleteCard}>
                    <i className="bi bi-trash3"></i>
                </button>
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
