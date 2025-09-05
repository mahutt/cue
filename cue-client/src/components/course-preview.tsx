import { Link } from 'react-router';
import { Course } from '../types';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <Link
            className="cursor-pointer bg-gray-100 rounded-lg px-3 py-2"
            key={course.id}
            to={`/${username}/${course.code}`}
        >
            <div className="truncate">{course.name}</div>
            <div className="text-gray-500 text-sm">
                {course.department.toUpperCase()} {course.number}
            </div>
        </Link>
    );
}
