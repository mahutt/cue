import { useLoaderData, LoaderFunctionArgs, Link } from 'react-router-dom';
import { getCourse } from '@/services/courses';
import { Course as CourseInterface } from '@/types';

interface LoaderData {
    course: CourseInterface;
}

export async function loader({ params }: LoaderFunctionArgs) {
    const courseId = params.courseId;
    if (!courseId) {
        throw new Error('Contact ID is required');
    }

    const course = await getCourse(Number(courseId));
    return { course };
}

export default function Course() {
    const { course } = useLoaderData() as LoaderData;
    console.log(course);
    function getPercentageColor(percentage: number | null): string {
        if (!percentage) {
            return '';
        }
        if (percentage >= 70) {
            return 'text-green-500';
        } else if (percentage >= 50) {
            return 'text-yellow-500';
        } else {
            return 'text-red-500';
        }
    }
    return (
        <div className="flex flex-col gap-5 px-10 my-10">
            <div>
                <h1 className="text-3xl font-bold">{course.name}</h1>
                <p className="text-lg text-muted-foreground">
                    {course.department.toUpperCase()} {course.number}
                </p>
            </div>
            <div>
                <p className="text-slate-500 mb-2">Decks</p>
                <div className="flex flex-col gap-2">
                    {course.decks &&
                        course.decks.map((deck) => (
                            <Link
                                to={`/decks/${deck.id}`}
                                key={deck.id}
                                className="border shadow rounded-lg p-3 flex justify-between hover:transform hover:scale-[101%] active:scale-[99%] transition-transform duration-200"
                            >
                                <div>{deck.name}</div>
                                <div className={getPercentageColor(deck.percentage)}>
                                    {deck.percentage ? `${deck.percentage}%` : ''}
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
