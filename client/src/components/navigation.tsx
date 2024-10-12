import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
    const [open, setOpen] = useState(true);
    const [previousClientX, setPreviousClientX] = useState(0);
    const [mobile, setMobile] = useState(false);

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

    // temporarily hard coded
    const courses = [
        { id: 1, name: 'Introduction to Computer Science', department: 'CSC', number: 101 },
        { id: 2, name: 'Data Structures', department: 'CSC', number: 201 },
        { id: 3, name: 'Algorithms', department: 'CSC', number: 202 },
        { id: 4, name: 'Computer Organization', department: 'CSC', number: 301 },
    ];

    window.addEventListener('mousemove', (event) => {
        if (!open && event.clientX < 100 && event.clientX < previousClientX) {
            setOpen(true);
        }
        setPreviousClientX(event.clientX);
    });

    return (
        <nav
            className={`left-0 h-full bg-white shadow-lg overflow-hidden transition-all ${
                open ? 'w-[260px]' : 'w-[0px]'
            } ${mobile ? 'absolute' : 'static'}`}
            onMouseEnter={() => setOpen(true)}
        >
            <div className="p-4 flex flex-col gap-4 w-[260px]">
                <div className="flex justify-between">
                    <Link to="profile" className="text-3xl font-bold truncate">
                        mahutt
                    </Link>
                    <button className="" onClick={() => setOpen(false)}>
                        x
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-slate-500">Courses</p>
                    {courses.map((course) => (
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
        </nav>
    );
}
