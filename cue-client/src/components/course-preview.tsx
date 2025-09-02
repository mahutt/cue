import { Link } from 'react-router';
import { Course } from '../types';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <Link key={course.id} to={`/${username}/${course.code}`} className="course">
            <button className="btn btn-light text-start w-100">
                <div className="text-truncate">{course.name}</div>
                <div className="small text-secondary">
                    {course.department.toUpperCase()} {course.number}
                </div>
            </button>
        </Link>
    );
}
