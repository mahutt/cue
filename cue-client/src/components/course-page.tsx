import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { api } from '../api';
import { useAuth } from '../hooks/auth-hook';
import { useTool } from '../hooks/tool-hook';
import { Course, Deck } from '../types';
import CourseSettings from './course-settings';
import CourseTitle from './course-title';
import DeckForm from './deck-form';
import { Button } from './ui/button';

export default function CoursePage() {
    const navigate = useNavigate();
    let { username, courseCode } = useParams();
    const { user } = useAuth();
    const { setTool } = useTool();

    if (username === undefined) {
        username = '';
        navigate(-1);
    }

    if (courseCode === undefined) {
        courseCode = '';
        navigate(-1);
    }

    const [course, setCourse] = useState<Course | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);
    const belongs = user && user.name === username;

    useEffect(() => {
        const courseId =
            user && user.name === username
                ? user.courses.find((course) => course.code === courseCode)?.id ?? null
                : null;
        setTool(courseId ? <CourseSettings courseId={courseId} /> : null);
    }, [user, username, courseCode]);

    useEffect(() => {
        api(`/api/courses/${username}/${courseCode}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data: { course: Course; decks: Deck[] }) => {
                setCourse(data.course);
                setDecks(data.decks);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [username, courseCode]);

    if (!course) return null;

    return (
        <>
            <style>{'#content { padding: 0 1rem 1rem 1rem; }'}</style>
            <div className="container flex flex-col gap-2">
                <CourseTitle course={course} />
                <div className="text-gray-500 ms-1">Decks:</div>
                <div className="decks flex flex-col gap-1">
                    {decks.map((deck) => (
                        <DeckPreview key={deck.id} deck={deck} />
                    ))}
                </div>
                {belongs && <DeckForm courseId={course.id} addDeck={(deck) => setDecks((prev) => [...prev, deck])} />}
            </div>
        </>
    );
}

function DeckPreview({ deck }: { deck: Deck }) {
    return (
        <Link to={`${deck.position}`} className="deck">
            <Button variant="secondary" style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
                <div className="flex-grow-1 text-left text-truncate">{deck.name}</div>
                {deck.percentage !== undefined && deck.percentage !== null && <DeckRating value={deck.percentage} />}
            </Button>
        </Link>
    );
}

function DeckRating({ value }: { value: number }) {
    let color: string;
    if (value > 90) {
        color = 'var(--green)';
    } else if (value > 50) {
        color = 'var(--yellow)';
    } else {
        color = 'var(--red)';
    }
    return (
        <div
            style={{
                color,
            }}
        >
            {value}
        </div>
    );
}
