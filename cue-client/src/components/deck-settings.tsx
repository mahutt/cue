import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useNotification } from '../hooks/notification-hook';
import api from '../api';
import { Glasses, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeckSettings({ deckId, belongs }: { deckId: number; belongs: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setNotification } = useNotification();
    const [open, setOpen] = useState(false);

    const resetProgress = async () => {
        try {
            await api.delete(`/decks/${deckId}/progress`);
            setOpen(false);
            setNotification('Progress reset.');
        } catch {
            setNotification('Could not reset progress.');
        }
    };

    const deleteDeck = async () => {
        setOpen(false);
        // @todo: add confirmation dialog

        try {
            await api.delete(`/decks/${deckId}`);
            setNotification('Deck deleted.');
            navigate(-1);
        } catch {
            setNotification('Could not delete deck.');
        }
    };

    return (
        <div className="flex gap-2">
            <Link to={`${location.pathname}/study`}>
                <Button variant="secondary" size="icon">
                    <Glasses size={16} strokeWidth={1.5} />
                </Button>
            </Link>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="icon">
                        <Settings size={16} strokeWidth={1.5} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deck Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={resetProgress}>
                            Reset Progress
                        </Button>
                        {belongs && (
                            <Button variant="destructive" className="w-full" onClick={deleteDeck}>
                                Delete Deck
                            </Button>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
