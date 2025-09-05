import { Link } from 'react-router';
import { Course } from '../types';
import { Button } from './ui/button';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <Link key={course.id} to={`/${username}/${course.code}`}>
            <Button variant="secondary" style={{ width: '100%', textAlign: 'start' }}>
                <div className="truncate">{course.name}</div>
                <div className="text-gray-500 text-sm">
                    {course.department.toUpperCase()} {course.number}
                </div>
            </Button>
        </Link>
    );
}
