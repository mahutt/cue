import { useLoaderData, LoaderFunctionArgs } from 'react-router-dom';
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
    return (
        <div>
            <h1>{course.name}</h1>
        </div>
    );
}
