import { Link } from 'react-router-dom';
import { Course } from '@/types';
import { ArrowUpRight } from 'lucide-react';

type Props = {
    course: Course;
};

export default function CourseLink({ course }: Props) {
    return (
        <Link
            to={`/courses/${course.id}`}
            key={course.id}
            className="group flex flex-row justify-between items-center p-6 rounded-xl border shadow hover:transform hover:scale-[101%] active:scale-[99%] transition-transform duration-200"
        >
            <div>
                <div className="font-semibold tracking-tight leading-none">{course.name}</div>
                <div className="text-sm text-muted-foreground">{`${course.department} ${course.number}`}</div>
            </div>
            <div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
            </div>
        </Link>
    );
}
