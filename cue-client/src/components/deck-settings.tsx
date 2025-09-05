import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';
import { Glasses, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeckSettings({ deckId, belongs }: { deckId: number; belongs: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setNotification } = useNotification();
    const [open, setOpen] = useState(false);

    const resetProgress = async () => {
        const response = await api(`/decks/${deckId}/progress`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setOpen(false);
        if (response.ok) {
            setNotification('Progress reset.');
        } else {
            setNotification('Could not reset progress.');
        }
    };

    const deleteDeck = async () => {
        setOpen(false);
        // @todo: add confirmation dialog

        const response = await api(`/decks/${deckId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setNotification('Deck deleted.');
            navigate(-1);
        } else {
            setNotification('Could not delete deck.');
        }
    };

    return (
        <div className="flex gap-2">
            <Link to={`${location.pathname}/study`}>
                <Button variant="ghost" size="icon">
                    <Glasses size={16} strokeWidth={1.5} />
                </Button>
            </Link>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button id="deckSettingsButton" variant="ghost" size="icon">
                        <Settings size={16} strokeWidth={1.5} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deck Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Button id="resetProgressButton" variant="outline" className="w-full" onClick={resetProgress}>
                            Reset Progress
                        </Button>
                        {belongs && (
                            <Button id="deleteDeckButton" variant="destructive" className="w-full" onClick={deleteDeck}>
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
