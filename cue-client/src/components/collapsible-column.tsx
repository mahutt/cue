import { Link } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { useSidebar } from '../hooks/sidebar-hook';

export default function CollapsibleColumn() {
    const { user, allUserNames } = useAuth();
    const { isSidebarOpen, closeSidebar } = useSidebar();
    return (
        <div
            className="collapsible-column"
            style={{ overflow: 'hidden', transition: 'all 0.2s ease-out', width: isSidebarOpen ? 260 : 0 }}
        >
            <div id="navigation">
                {user ? (
                    <>
                        <div className="d-flex flex-row justify-content-between mb-2">
                            <a href={`/${user.name}`} className="title">
                                {user.name}
                            </a>
                            <div>
                                <div className="mobile btn btn-light toggle" onClick={closeSidebar}>
                                    <i className="bi bi-list"></i>
                                </div>
                            </div>
                        </div>
                        <div className="courses mb-4">
                            <div className="subtitle ms-1">Courses</div>
                            {user.courses.map((course) => (
                                <Link key={course.id} to={`/${user.name}/${course.code}`} className="course">
                                    <button className="btn btn-light text-start w-100">
                                        <div className="text-truncate">{course.name}</div>
                                        <div className="small text-secondary">
                                            {course.department.toUpperCase()} {course.number}
                                        </div>
                                    </button>
                                </Link>
                            ))}
                        </div>
                        <div className="users ms-1">
                            <div className="subtitle">Other Users</div>
                            {allUserNames
                                .filter((userName) => userName !== user.name)
                                .map((otherUserName) => (
                                    <Link key={otherUserName} to={`/${otherUserName}`} className="user">
                                        {otherUserName}
                                    </Link>
                                ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <div className="row">
                                <div className="mobile toggle" onClick={closeSidebar}>
                                    <i className="bi bi-list"></i>
                                </div>
                            </div>
                            <Link to="/login" className="btn btn-light mb-3 w-100">
                                Log in
                            </Link>
                        </div>
                        <div className="users">
                            <div className="subtitle">All Users</div>
                            {allUserNames.map((otherUserName) => (
                                <Link key={otherUserName} to={`/${otherUserName}`} className="user">
                                    {otherUserName}
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
