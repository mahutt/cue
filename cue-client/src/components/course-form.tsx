import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/auth-hook';
import { useNotification } from '../hooks/notification-hook';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CourseForm() {
    const { setUser } = useAuth();
    const { setNotification } = useNotification();
    const [open, setOpen] = useState(false);

    const [courseName, setCourseName] = useState<string>('');
    const [department, setDepartment] = useState<string>('');
    const [courseNumber, setCourseNumber] = useState<string>('');

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

            setOpen(false);
            setNotification('Course created.');

            // Reset form
            setCourseName('');
            setDepartment('');
            setCourseNumber('');
        } catch {
            setOpen(false);
            setNotification('Could not create course.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button id="newCourseFormButton" size="icon">
                    <Plus size={16} strokeWidth={1.5} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Course Name:</Label>
                        <Input
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            type="text"
                            id="name"
                            name="name"
                            required
                            maxLength={100}
                            placeholder="Data Structures & Algorithms"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="department">Department:</Label>
                            <Input
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                type="text"
                                id="department"
                                name="department"
                                required
                                minLength={4}
                                maxLength={4}
                                placeholder="COMP"
                            />
                        </div>
                        <div>
                            <Label htmlFor="number">Course Number:</Label>
                            <Input
                                value={courseNumber}
                                onChange={(e) => setCourseNumber(e.target.value)}
                                type="number"
                                id="number"
                                name="number"
                                required
                                placeholder="352"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button id="createCourseButton" type="button" onClick={createCourse}>
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
