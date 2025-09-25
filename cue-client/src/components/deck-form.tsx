import { useState } from 'react';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';
import { Deck } from '../types';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeckForm({ courseId, addDeck }: { courseId: number; addDeck: (deck: Deck) => void }) {
    const { notify } = useNotification();
    const [open, setOpen] = useState(false);
    const [deckName, setDeckName] = useState<string>('');

    const createDeck = async () => {
        try {
            const response = await api.post('/api/decks', {
                course_id: courseId,
                name: deckName,
            });

            const { deck } = response.data;
            addDeck(deck);
            setOpen(false);
            notify('Deck created!');

            // Reset form
            setDeckName('');
        } catch {
            setOpen(false);
            notify('Could not create deck.');
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
