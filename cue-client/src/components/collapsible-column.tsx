import { Link } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { useSidebar } from '../hooks/sidebar-hook';
import CoursePreview from './course-preview';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

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
                        <div className="flex flex-row justify-between items-center mb-2">
                            <Link to={`/${user.name}`} className="font-semibold text-3xl">
                                {user.name}
                            </Link>
                            <div className="md:hidden">
                                <Button variant="secondary" onClick={closeSidebar} style={{ height: '38px' }}>
                                    <Menu size={16} strokeWidth={1.5} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="text-gray-500 ms-1">Courses</div>
                            {[...user.courses].reverse().map((course) => (
                                <CoursePreview key={course.id} username={user.name} course={course} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 ms-1">
                            <div className="text-gray-500">Other Users</div>
                            {allUserNames
                                .filter((userName) => userName !== user.name)
                                .map((otherUserName) => (
                                    <Link key={otherUserName} to={`/${otherUserName}`}>
                                        {otherUserName}
                                    </Link>
                                ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-row gap-2">
                            <Link
                                to="/login"
                                className="block text-center px-[0.75rem] py-[0.375rem] bg-gray-100 border-[1px] border-gray-100 rounded hover:bg-gray-200 hover:border-gray-300 mb-3 w-full"
                            >
                                Log in
                            </Link>
                            <div className="md:hidden">
                                <Button variant="secondary" onClick={closeSidebar} style={{ height: '38px' }}>
                                    <Menu size={16} strokeWidth={1.5} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500">All Users</div>
                            {allUserNames.map((otherUserName) => (
                                <Link key={otherUserName} to={`/${otherUserName}`}>
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
