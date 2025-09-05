import { Link } from 'react-router';
import { Course } from '../types';
import LightButton from './light-button';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <Link key={course.id} to={`/${username}/${course.code}`} className="course">
            <LightButton style={{ width: '100%', textAlign: 'start' }}>
                <div className="text-truncate">{course.name}</div>
                <div className="small text-secondary">
                    {course.department.toUpperCase()} {course.number}
                </div>
            </LightButton>
        </Link>
    );
}
