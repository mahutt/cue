import { Link } from 'react-router';
import { Course } from '../types';
import LightButton from './light-button';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <Link key={course.id} to={`/${username}/${course.code}`}>
            <LightButton style={{ width: '100%', textAlign: 'start' }}>
                <div className="truncate">{course.name}</div>
                <div className="text-gray-500 text-sm">
                    {course.department.toUpperCase()} {course.number}
                </div>
            </LightButton>
        </Link>
    );
}
