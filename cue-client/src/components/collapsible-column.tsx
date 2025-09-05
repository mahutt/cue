import { Link } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { useSidebar } from '../hooks/sidebar-hook';
import CoursePreview from './course-preview';

export default function CollapsibleColumn() {
    const { user, allUserNames } = useAuth();
    const { isSidebarOpen, closeSidebar } = useSidebar();
    return (
        <div
            className="z-10 absolute l-0 h-full bg-white md:static shadow"
            style={{ overflow: 'hidden', transition: 'all 0.2s ease-out', width: isSidebarOpen ? 260 : 0 }}
        >
            <div className="flex flex-col w-[260px] max-h-screen overflow-y-auto p-3">
                {user ? (
                    <>
                        <div className="flex flex-row justify-between mb-2">
                            <Link to={`/${user.name}`} className="font-semibold text-3xl">
                                {user.name}
                            </Link>
                            <div>
                                <div className="mobile btn btn-light toggle" onClick={closeSidebar}>
                                    <i className="bi bi-list"></i>
                                </div>
                            </div>
                        </div>
                        <div className="courses mb-4">
                            <div className="text-gray-500 ms-1">Courses</div>
                            {user.courses.map((course) => CoursePreview({ username: user.name, course }))}
                        </div>
                        <div className="users ms-1">
                            <div className="text-gray-500">Other Users</div>
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
                            <div className="text-gray-500">All Users</div>
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
