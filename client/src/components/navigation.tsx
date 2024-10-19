import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '../context/AuthContext';

import { X } from 'lucide-react';

export default function Navigation() {
    const [open, setOpen] = useState(true);
    const [previousClientX, setPreviousClientX] = useState(0);
    const [mobile, setMobile] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 780) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    window.addEventListener('mousemove', (event) => {
        if (!open && event.clientX < 100 && event.clientX < previousClientX) {
            setOpen(true);
        }
        setPreviousClientX(event.clientX);
    });

    return (
        <nav
            className={`left-0 h-full bg-white shadow-lg overflow-hidden transition-all z-10 ${
                open ? 'w-[260px]' : 'w-[0px]'
            } ${mobile ? 'absolute' : 'static'}`}
            onMouseEnter={() => setOpen(true)}
        >
            <div className="h-full flex flex-col gap-4 w-[260px]">
                <div className="flex justify-between m-4">
                    <div>
                        {loading && <Skeleton className="h-9 w-40" />}
                        <Link to="profile" className="text-3xl font-bold truncate">
                            {user?.name}
                        </Link>
                    </div>
                    <button className="" onClick={() => setOpen(false)}>
                        <X />
                    </button>
                </div>
                <div className="overflow-y-auto pb-4">
                    <div className="flex flex-col gap-2 px-4">
                        <p className="text-slate-500">Courses</p>
                        {loading && (
                            <>
                                <Skeleton className="h-16 rounded-xl" />
                                <Skeleton className="h-16 rounded-xl" />
                                <Skeleton className="h-16 rounded-xl" />
                            </>
                        )}
                        {user?.courses.map((course) => (
                            <Link
                                key={course.id}
                                to={`courses/${course.id}`}
                                className="rounded-lg p-3 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <div className="truncate">{course.name}</div>
                                <div className="text-sm text-slate-500">
                                    {course.department} {course.number}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
