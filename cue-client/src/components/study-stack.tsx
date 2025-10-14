import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../api';
import { Card } from '../types';
import CardFace from './card-face';
import { useTool } from '../hooks/tool-hook';
import StudySettings from './study-settings';
import { useNotification } from '../hooks/notification-hook';
import { Ban, Check, Frown, Meh, Smile } from 'lucide-react';
import { Button } from './ui/button';
import ScoreBoard from './study/score-board';

interface ScoredCard extends Card {
    score: number;
}

export default function StudyStack() {
    const { setTool } = useTool();
    const { username, courseCode, deckPosition } = useParams();
    const [scoredCards, setScoredCards] = useState<ScoredCard[]>([]);
    const [deckId, setDeckId] = useState<number | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);

    const fetchStudyCards = async () => {
        try {
            const response = await api.get(`/api/decks/${username}/${courseCode}/${deckPosition}/study`);
            const { cards, deckId }: { cards: ScoredCard[]; deckId: number } = response.data;

            setScoredCards(cards);
            setDeckId(deckId);
            setIndex(0);
        } catch {
            console.error('Failed to fetch study cards');
            return;
        }
    };

    const reset = async () => {
        await fetchStudyCards();
        setFinished(false);
        setEditing(false);
    };

    useEffect(() => {
        setTool(<StudySettings setEditing={setEditing} reset={reset} />);
    }, []);

    useEffect(() => {
        fetchStudyCards();
    }, [username, courseCode, deckPosition]);

    const nextCard = () => {
        if (index < scoredCards.length - 1) {
            setIndex(index + 1);
            return scoredCards[index + 1];
        } else {
            setFinished(true);
            return scoredCards[0];
        }
    };

    if (scoredCards.length === 0) {
        return null;
    }

    if (finished && deckId) {
        return <ScoreBoard deckId={deckId} reset={reset} />;
    }

    return (
        <div className="flippers">
            <CardFlipper card={scoredCards[index]} editing={editing} setEditing={setEditing} nextCard={nextCard} />
        </div>
    );
}

function CardFlipper({
    card,
    editing,
    setEditing,
    nextCard,
}: {
    card: ScoredCard;
    editing: boolean;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    nextCard: () => ScoredCard;
}) {
    const { notify } = useNotification();
    const [internalCard, setInternalCard] = useState<ScoredCard>(card);
    const [flipped, setFlipped] = useState(false);
    const [showScores, setShowScores] = useState(false);

    const updateScore = async (score: number) => {
        nextCard();
        try {
            await api.put(`/cards/${card.id}`, {
                score: score,
            });
        } catch {
            notify('Could not update score.');
            return;
        }

        setInternalCard((prevCard) => ({
            ...prevCard,
            score: score,
        }));
    };

    useEffect(() => {
        setInternalCard(card);
        setFlipped(false);
        setShowScores(false);
    }, [card]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setFlipped((prev) => !prev);
                setShowScores(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div
            className={`card-flipper score-${card.score}`}
            onClick={() => {
                setFlipped(!flipped);
                setShowScores(true);
            }}
        >
            {(editing || !flipped) && (
                <CardFace
                    side="front"
                    value={internalCard.front}
                    setValue={(value: string) => setInternalCard({ ...internalCard, front: value })}
                    readOnly={!editing}
                />
            )}
            <div
                className="divider"
                style={{ width: '100%', height: '2px', borderRadius: '1px', display: editing ? '' : 'none' }}
            />
            {(editing || flipped) && (
                <CardFace
                    side="back"
                    value={internalCard.back}
                    setValue={(value: string) => setInternalCard({ ...internalCard, back: value })}
                    readOnly={!editing}
                />
            )}
            <div className="scores" style={{ display: !editing && showScores ? 'flex' : 'none' }}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        updateScore(0);
                    }}
                >
                    <Frown size={16} />
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        updateScore(1);
                    }}
                >
                    <Meh size={16} />
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        updateScore(2);
                    }}
                >
                    <Smile size={16} />
                </div>
            </div>
            <div className="flex-row gap-2" style={{ display: editing ? 'flex' : 'none' }}>
                <Button
                    className="w-[50px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                        setShowScores(false);
                        setInternalCard(card);
                        setEditing(false);
                    }}
                    // size="icon"
                >
                    <Ban />
                </Button>
                <Button
                    className="w-[50px]"
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            await api.patch(`/cards/${card.id}`, internalCard);
                        } catch {
                            notify('Could not save card.');
                            return;
                        }

                        setEditing(false);
                        setFlipped(false);
                        setShowScores(false);
                    }}
                    size="icon"
                >
                    <Check />
                </Button>
            </div>
        </div>
    );
}
