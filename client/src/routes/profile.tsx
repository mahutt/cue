import { useAuth } from '@/context/AuthContext';
import DeckCard from '@/components/deck-card';
import CourseLink from '@/components/course-link';

export default function Profile() {
    const { user } = useAuth();

    // temporarily hard coded
    const decks = [
        { id: 1, name: 'SQL', course_id: 1 },
        { id: 2, name: 'Regular Expressions Describe the Regular Languages', course_id: 2 },
        { id: 3, name: 'Class Diagram Notation', course_id: 3 },
    ];
    const courses = [
        { id: 1, name: 'Databases', department: 'COMP', number: 344, user_id: 1 },
        { id: 2, name: 'Theory of Computation', department: 'COMP', number: 360, user_id: 1 },
        { id: 3, name: 'Software Engineering', department: 'COMP', number: 335, user_id: 1 },
        { id: 4, name: 'Theory of Computation', department: 'COMP', number: 360, user_id: 1 },
        { id: 5, name: 'Software Engineering', department: 'COMP', number: 335, user_id: 1 },
    ];

    return (
        <div className="flex flex-col gap-5 px-5 my-10">
            <h1 className="text-4xl tracking-tight font-bold">{user?.name}</h1>
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
                    {courses.map((course) => (
                        <CourseLink key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
