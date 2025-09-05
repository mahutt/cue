import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/auth-hook';
import { useNotification } from '../hooks/notification-hook';

export default function CourseForm() {
    const { setUser } = useAuth();
    const { setNotification } = useNotification();
    const modalDivRef = useRef<HTMLDivElement>(null);
    const [modal, setModal] = useState<any>(null);

    const [courseName, setCourseName] = useState<string>('');
    const [department, setDepartment] = useState<string>('');
    const [courseNumber, setCourseNumber] = useState<string>('');

    useEffect(() => {
        if (modalDivRef.current) {
            const modal = new window.bootstrap!.Modal(modalDivRef.current);
            setModal(modal);
        }
    }, [modalDivRef]);

    const createCourse = async () => {
        try {
            const response = await api('/api/courses', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: courseName,
                    department: department,
                    number: courseNumber,
                }),
            });

            const { course } = await response.json();
            setUser((prevUser) => {
                if (!prevUser) return prevUser;
                return {
                    ...prevUser,
                    courses: [...prevUser.courses, course],
                };
            });

            modal.hide();
            setNotification('Course created.');
        } catch {
            modal.hide();
            setNotification('Could not create course.');
        }
    };

    return (
        <>
            <button
                id="newCourseFormButton"
                className="btn btn-light"
                type="button"
                onClick={() => {
                    if (modal) {
                        modal.show();
                    }
                }}
            >
                <i className="bi bi-plus-lg"></i>
            </button>
            <div ref={modalDivRef} className="modal fade" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">New Course</h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Course Name:
                                    </label>
                                    <input
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        required
                                        maxLength={100}
                                        placeholder="Data Structures & Algorithms"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="department" className="form-label">
                                            Department:
                                        </label>
                                        <input
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            type="text"
                                            id="department"
                                            name="department"
                                            className="form-control"
                                            required
                                            minLength={4}
                                            maxLength={4}
                                            placeholder="COMP"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="number" className="form-label">
                                            Course Number:
                                        </label>
                                        <input
                                            value={courseNumber}
                                            onChange={(e) => setCourseNumber(e.target.value)}
                                            type="number"
                                            id="number"
                                            name="number"
                                            className="form-control"
                                            required
                                            placeholder="352"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    id="createCourseButton"
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={createCourse}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
