import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api';
import { useAuth } from '../hooks/auth-hook';
import { useNotification } from '../hooks/notification-hook';
import { Settings } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

export default function CourseSettings({ courseId }: { courseId: number }) {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const { setNotification } = useNotification();
    const [open, setOpen] = useState(false);

    const deleteCourse = async () => {
        try {
            await api.delete(`/courses/${courseId}`);
            setNotification('Course deleted.');
            setUser((prevUser) => {
                if (!prevUser) return prevUser;
                return {
                    ...prevUser,
                    courses: prevUser.courses.filter((course) => course.id !== courseId),
                };
            });
            navigate(-1);
        } catch {
            setNotification('Could not delete course.');
        } finally {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" type="button">
                    <Settings size={16} strokeWidth={1.5} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Course Settings</DialogTitle>
                </DialogHeader>
                <Button variant="destructive" onClick={deleteCourse}>
                    Delete Course
                </Button>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
