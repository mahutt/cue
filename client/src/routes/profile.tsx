import { useAuth } from '@/context/AuthContext';
import DeckCard from '@/components/deck-card';
import CourseLink from '@/components/course-link';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
    const { user, loading } = useAuth();

    // temporarily hard coded
    const decks = [
        { id: 1, name: 'SQL', course_id: 1 },
        { id: 2, name: 'Regular Expressions Describe the Regular Languages', course_id: 2 },
        { id: 3, name: 'Class Diagram Notation', course_id: 3 },
    ];

    return (
        <div className="flex flex-col gap-5 px-5 my-10">
            <div>
                {loading && <Skeleton className="h-10 w-60" />}
                <h1 className="text-4xl tracking-tight font-bold">{user?.name}</h1>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-slate-500">Recent Decks</div>
                <div className="relative w-full">
                    <div className="overflow-x-auto pb-4">
                        <div className="flex flex-row gap-2 min-w-min">
                            {decks.map((deck) => (
                                <DeckCard key={deck.id} deck={deck} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-slate-500">All Courses</div>
                <div className="flex flex-col gap-2">
                    {loading && (
                        <>
                            <Skeleton className="h-20 rounded-xl" />
                            <Skeleton className="h-20 rounded-xl" />
                            <Skeleton className="h-20 rounded-xl" />
                        </>
                    )}
                    {user?.courses.map((course) => (
                        <CourseLink key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
