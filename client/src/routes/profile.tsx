import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Profile() {
    const { user } = useAuth();

    // temporarily hard coded
    const decks = [
        { id: 1, name: 'SQL', course_id: 1 },
        { id: 2, name: 'Regular Expressions Describe the Regular Languages', course_id: 2 },
        { id: 3, name: 'Class Diagram Notation', course_id: 3 },
    ];

    return (
        <div className="flex flex-col gap-5 px-5">
            <h1 className="text-4xl tracking-tight font-bold mt-10">{user?.name}</h1>
            <div className="flex flex-col gap-2">
                <div className="text-slate-500">Recent Decks</div>
                <div className="relative w-full">
                    <div className="overflow-x-auto pb-4">
                        <div className="flex flex-row gap-2 min-w-min">
                            {decks.map((deck) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
