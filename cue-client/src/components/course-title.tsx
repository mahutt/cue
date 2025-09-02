import { useEffect, useState } from 'react';
import { Course } from '../types';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';

export default function CourseTitle({ course }: { course: Course }) {
    const { setNotification } = useNotification();
    const [name, setName] = useState<string>(course.name);
    const [code, setCode] = useState<string>(`${course.department.toUpperCase()} ${course.number}`);

    useEffect(() => {
        setName(course.name);
        setCode(`${course.department.toUpperCase()} ${course.number}`);
    }, [course]);

    const updateCourse = () => {
        api(`/courses/${course.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                code: code,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    setNotification('Could not update course.');
                }
            })
            .then((code) => {
                if (code) {
                    window.location.href = window.location.href.replace(/[^/]*$/, code);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
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
