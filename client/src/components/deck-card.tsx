import { Link } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Deck {
    id: number;
    name: string;
    course_id: number;
}

export default function DeckCard({ deck }: { deck: Deck }) {
    return (
        <Card className="w-[250px] flex-shrink-0 flex flex-col justify-between" key={deck.id}>
            <CardHeader>
                <CardTitle>{deck.name}</CardTitle>
                <CardDescription>COMP 344</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <Link to={`/study/${deck.id}`}>
                    <Button>Study</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
