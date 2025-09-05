import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api';
import { useAuth } from '../hooks/auth-hook';
import { useNotification } from '../hooks/notification-hook';

export default function CourseSettings({ courseId }: { courseId: number }) {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const { setNotification } = useNotification();
    const modalDivRef = useRef<HTMLDivElement>(null);
    const [modal, setModal] = useState<any>(null);

    useEffect(() => {
        if (modalDivRef.current) {
            const modal = new window.bootstrap!.Modal(modalDivRef.current);
            setModal(modal);
        }
    }, [modalDivRef]);

    const deleteCourse = async () => {
        try {
            const response = await api(`/courses/${courseId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setNotification('Course deleted.');
                setUser((prevUser) => {
                    if (!prevUser) return prevUser;
                    return {
                        ...prevUser,
                        courses: prevUser.courses.filter((course) => course.id !== courseId),
                    };
                });
                navigate(-1);
            } else {
                setNotification('Could not delete course.');
            }

            modal.hide();
        } catch {
            setNotification('Could not delete course.');
            modal.hide();
        }
    };

    return (
        <>
            <button
                id="courseSettingsButton"
                className="btn btn-light"
                type="button"
                onClick={() => {
                    if (modal) {
                        modal.show();
                    }
                }}
            >
                <i className="bi bi-gear-fill"></i>
            </button>
            <div ref={modalDivRef} className="modal fade" tabIndex={-1} aria-hidden="true" course-id="<%= course.id %>">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Course Settings</h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form>
                            <div className="modal-body d-flex flex-column gap-2">
                                <a id="deleteCourseButton" className="btn btn-danger w-100" onClick={deleteCourse}>
                                    Delete Course
                                </a>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
