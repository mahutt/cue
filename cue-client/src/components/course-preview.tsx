import { NavLink } from 'react-router';
import { Course } from '../types';

export default function CoursePreview({ username, course }: { username: string; course: Course }) {
    return (
        <NavLink
            className={({ isActive }) =>
                `cursor-pointer rounded-lg px-3 py-2 ${
                    isActive ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
                }`
            }
            to={`/${username}/${course.code}`}
        >
            <div className="truncate">{course.name}</div>
            <div className="text-gray-500 text-sm">
                {course.department.toUpperCase()} {course.number}
            </div>
        </NavLink>
    );
}
