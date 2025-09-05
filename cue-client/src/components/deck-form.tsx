import { useState } from 'react';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';
import { Deck } from '../types';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeckForm({ courseId, addDeck }: { courseId: number; addDeck: (deck: Deck) => void }) {
    const { setNotification } = useNotification();
    const [open, setOpen] = useState(false);
    const [deckName, setDeckName] = useState<string>('');

    const createDeck = async () => {
        try {
            const response = await api('/api/decks', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id: courseId,
                    name: deckName,
                }),
            });

            if (response.ok) {
                const { deck } = await response.json();
                addDeck(deck);
                setOpen(false);
                setNotification('Deck created!');

                // Reset form
                setDeckName('');
            } else {
                setOpen(false);
                setNotification('Could not create deck.');
            }
        } catch {
            setOpen(false);
            setNotification('Could not create deck.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New deck</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Deck Name:</Label>
                        <Input
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            type="text"
                            id="name"
                            name="name"
                            required
                            maxLength={100}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createDeck();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={createDeck}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
