import { useEffect, useState } from 'react';
import { Course } from '../types';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';

export default function CourseTitle({ course }: { course: Course }) {
    const { setNotification } = useNotification();
    const [name, setName] = useState<string>(course.name);
    const [code, setCode] = useState<string>(`${course.department.toUpperCase()} ${course.number}`);

    useEffect(() => {
        setName(course.name);
        setCode(`${course.department.toUpperCase()} ${course.number}`);
    }, [course]);

    const updateCourse = () => {
        api.patch(`/courses/${course.id}`, {
            name: name,
            code: code,
        })
            .then((response) => {
                return response.data;
            })
            .then((code) => {
                if (code) {
                    window.location.href = window.location.href.replace(/[^/]*$/, code);
                }
            })
            .catch((error) => {
                console.error('Error updating course:', error);
                setNotification('Could not update course.');
            });
    };
    return (
        <>
            <style>
                {`.course-name, .course-code { border: none; outline: none; margin: 0; padding: 0; font: inherit; color: inherit; background-color: transparent; }`}
            </style>
            <div
                className="course-title"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        updateCourse();
                    }
                }}
            >
                <input type="text" className="course-name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" className="course-code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
        </>
    );
}
