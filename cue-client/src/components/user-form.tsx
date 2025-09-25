import { useState } from 'react';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserForm() {
    const { notify } = useNotification();
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const createUser = async () => {
        if (!userName || !password) return;
        try {
            await api.post('/api/users', {
                name: userName,
                password: password,
            });

            setOpen(false);
            notify('User created!');

            // Reset form
            setUserName('');
        } catch {
            setOpen(false);
            notify('Could not create user.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    New user
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New user</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name:</Label>
                        <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"
                            id="name"
                            name="name"
                            required
                            maxLength={100}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createUser();
                                }
                            }}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password:</Label>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="text"
                            id="password"
                            name="password"
                            required
                            maxLength={100}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createUser();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={createUser}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
