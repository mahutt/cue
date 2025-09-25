import { useParams } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { useEffect, useState } from 'react';
import { useTool } from '../hooks/tool-hook';
import api from '../api';
import { Card, Deck, PendingCard } from '../types';
import DeckSettings from './deck-settings';
import DeckTitle from './deck-title';
import { CardEditor } from './card-editor';
import CardForm from './card-form';
import { DeckProvider } from '../providers/deck-provider';
import { useNotification } from '@/hooks/notification-hook';

export default function DeckPage() {
    const { notify } = useNotification();
    const { setTool } = useTool();
    const { username, courseCode, deckPosition } = useParams();
    const { user } = useAuth();

    const belongs = Boolean(user && username && user.name === username);
    const [deck, setDeck] = useState<Deck | null>(null);
    const [cards, setCards] = useState<(Card | PendingCard)[]>([]);

    const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);

    const setCard = (card: Card) => {
        setCards((prevCards) => {
            const index = prevCards.findIndex((c) => c.id === card.id);
            if (index !== -1) {
                const newCards = [...prevCards];
                newCards[index] = card;
                return newCards;
            }
            return [...prevCards, card];
        });
    };

    const addPendingCard = (card: PendingCard) => {
        setCards((prevCards) => [...prevCards, card]);
        setScrollToBottom(true);
        card.promise.then((resolvedCard) => {
            setCards((prevCards) => prevCards.map((c) => (c === card ? resolvedCard : c)));
            notify('Card created!');
        });
    };

    useEffect(() => {
        setTool(deck ? <DeckSettings deckId={deck.id} belongs={belongs} /> : null);
    }, [deck]);

    useEffect(() => {
        api.get(`/api/decks/${username}/${courseCode}/${deckPosition}`)
            .then((response) => {
                return response.data;
            })
            .then((data: { deck: Deck; cards: Card[]; belongs: boolean }) => {
                setDeck(data.deck);
                setCards(data.cards);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [username, courseCode, deckPosition]);

    useEffect(() => {
        if (scrollToBottom) {
            // archaic scroll to bottom @todo refactor
            const cardsElement = document.querySelector('.cards');
            if (!cardsElement) return;
            cardsElement.scrollTop = cardsElement.scrollHeight;
            setScrollToBottom(false);
        }
    }, [cards, scrollToBottom]);

    return (
        <DeckProvider belongs={belongs}>
            <style>
                {`.deck-body { height: 100%; display: grid; grid-template-columns: 1fr; }
                .cards { overflow-y: auto; padding: 1rem; }
                .card-form-wrapper { box-shadow: 0 2px 45px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .card-form-content { width: 100%; max-width: 750px; display: flex; flex-direction: column; align-items: flex-start; }
                ${belongs ? '.deck-body { grid-template-rows: 2fr 1fr; }' : ''}`}
            </style>
            <div className="deck-body">
                <div className="cards">
                    <div style={{ width: '100%' }}>{deck && <DeckTitle deck={deck} />}</div>
                    {cards.map((card, index) => (
                        <CardEditor
                            position={index + 1}
                            key={card.id}
                            card={card}
                            setCard={setCard}
                            removeCard={() => {
                                setCards((prevCards) => prevCards.filter((c) => c.id !== card.id));
                            }}
                        />
                    ))}
                </div>

                {deck && belongs && (
                    <div className="card-form-wrapper">
                        <div className="card-form-content">
                            <div className="mb-2 text-gray-500">New card</div>
                            <CardForm deckId={deck.id} addPendingCard={addPendingCard} />
                        </div>
                    </div>
                )}
            </div>
        </DeckProvider>
    );
}
