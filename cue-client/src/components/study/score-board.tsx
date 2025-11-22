import api from '@/api';
import { useNotification } from '@/hooks/notification-hook';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '../ui/button';

export default function ScoreBoard({ deckId, reset }: { deckId: number; reset: () => void }) {
    const { pathname } = useLocation();
    const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';

    const { notify } = useNotification();
    const [percentage, setPercentage] = useState<number>(0);

    const fetchScore = async () => {
        try {
            const response = await api.get(`/decks/${deckId}/score`);
            const targetPercentage = Math.round(response.data.percentage);
            animateScore(0, targetPercentage);
        } catch {
            notify('Could not fetch score.');
            return;
        }
    };

    const animateScore = (start: number, end: number) => {
        const duration = 500;
        const steps = end - start;
        const stepDuration = duration / steps;

        let current = start;
        const timer = setInterval(() => {
            current += 1;
            setPercentage(current);

            if (current >= end) {
                clearInterval(timer);
                setPercentage(end);
            }
        }, stepDuration);
    };

    useEffect(() => {
        fetchScore();
    }, [deckId]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <div className="text-4xl">{percentage}%</div>
            <Button variant="default" onClick={reset}>
                again
            </Button>
            <Link to={parentPath}>
                <Button variant="ghost" className="cursor-pointer">
                    return to deck
                </Button>
            </Link>
        </div>
    );
}
