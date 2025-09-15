import { useParams, useNavigate } from 'react-router';
import { Course } from '../types';
import { useEffect, useState, useMemo } from 'react';
import CoursePreview from './course-preview';
import api from '../api';
import { useAuth } from '../hooks/auth-hook';
import CourseForm from './course-form';
import { useTool } from '../hooks/tool-hook';
import LogoutButton from './logout-button';

export default function Profile() {
    const navigate = useNavigate();
    let { username } = useParams();
    const { user } = useAuth();
    const { setTool } = useTool();

    if (username === undefined) {
        username = '';
        navigate(-1);
    }

    let [courses, setCourses] = useState<Course[]>([]);
    const belongsTo = useMemo(() => user && user.name === username, [user, username]);

    useEffect(() => {
        setTool(belongsTo ? <LogoutButton /> : null);
        if (belongsTo) return;
        api.get(`/api/users/${username}/courses`, {})
            .then((response) => {
                return response.data;
            })
            .then((data) => {
                setCourses(data);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
            });
    }, [belongsTo, username, setTool]);

    return (
        <>
            <style>{`#content { padding: 0 1rem 1rem 1rem; }`}</style>
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="font-semibold text-3xl mb-2">{username}</div>
                <div>
                    <div className="mb-2 mx-1 flex flex-row justify-between items-center">
                        <div className="text-gray-500">Courses</div>
                        <div>{belongsTo && <CourseForm />}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {(belongsTo && user ? user.courses : courses).map((course) => (
                            <CoursePreview key={course.id} username={username} course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
