import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { api } from '../api';
import { Card } from '../types';
import CardFace from './card-face';
import { useTool } from '../hooks/tool-hook';
import StudySettings from './study-settings';
import { useNotification } from '../hooks/notification-hook';

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
        const response = await api(`/api/decks/${username}/${courseCode}/${deckPosition}/study`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch study cards:', response.statusText);
            return;
        }

        const { cards, deckId }: { cards: ScoredCard[]; deckId: number } = await response.json();

        setScoredCards(cards);
        setDeckId(deckId);
        setIndex(0);
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
    const { setNotification } = useNotification();
    const [internalCard, setInternalCard] = useState<ScoredCard>(card);
    const [flipped, setFlipped] = useState(false);
    const [showScores, setShowScores] = useState(false);

    const updateScore = async (score: number) => {
        nextCard();
        const response = await api(`/cards/${card.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                score: score,
            }),
        });

        if (!response.ok) {
            setNotification('Could not update score.');
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
                <div onClick={() => updateScore(0)}>
                    <i className="bi bi-emoji-tear-fill"></i>
                </div>
                <div onClick={() => updateScore(1)}>
                    <i className="bi bi-emoji-neutral-fill"></i>
                </div>
                <div onClick={() => updateScore(2)}>
                    <i className="bi bi-emoji-sunglasses-fill"></i>
                </div>
            </div>
            <div className="editButtonsDiv" style={{ display: editing ? 'flex' : 'none' }}>
                <a
                    id="cancelEdit"
                    role="button"
                    className="btn btn-dark p-2"
                    style={{ width: '50px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                        setShowScores(false);
                        setInternalCard(card);
                        setEditing(false);
                    }}
                >
                    <i className="bi bi-slash-circle"></i>
                </a>
                <a
                    id="saveEdit"
                    role="button"
                    className="btn btn-dark p-2"
                    style={{ width: '50px' }}
                    onClick={async (e) => {
                        e.stopPropagation();
                        const response = await api(`/cards/${card.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify(internalCard),
                        });

                        if (!response.ok) {
                            setNotification('Could not save card.');
                            return;
                        }

                        setEditing(false);
                        setFlipped(false);
                        setShowScores(false);
                    }}
                >
                    <i className="bi bi-check"></i>
                </a>
            </div>
        </div>
    );
}

function ScoreBoard({ deckId, reset }: { deckId: number; reset: () => void }) {
    const { pathname } = useLocation();
    const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';

    const { setNotification } = useNotification();
    const [percentage, setPercentage] = useState<number>(0);

    const fetchScore = async () => {
        const response = await api(`/decks/${deckId}/score`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            setNotification('Could not fetch score.');
            return;
        }
        const data = await response.json();
        console.log(data);
        const percentage = Math.round(data.percentage);
        setPercentage(percentage);
    };

    useEffect(() => {
        fetchScore();
    }, [deckId]);

    return (
        <div className="scoreboard">
            <div className="percentage">{percentage}%</div>
            <div className="black button" onClick={reset}>
                again
            </div>
            <Link to={parentPath} className="black button return">
                return to deck
            </Link>
        </div>
    );
}
