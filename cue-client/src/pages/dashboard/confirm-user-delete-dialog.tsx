import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfirmUserDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userName: string;
    onConfirm: () => Promise<void>;
}

export function ConfirmUserDeleteDialog({ open, onOpenChange, userName, onConfirm }: ConfirmUserDeleteDialogProps) {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClose = () => {
        setInputValue('');
        setIsDeleting(false);
        onOpenChange(false);
    };

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        handleClose();
    };

    const isConfirmDisabled = inputValue !== userName || isDeleting;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the user{' '}
                        <span className="font-bold italic">{userName}</span> and all associated data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-name">
                            Type <span className="font-bold italic">{userName}</span> to confirm:
                        </Label>
                        <Input
                            id="confirm-name"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={userName}
                            disabled={isDeleting}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isConfirmDisabled}>
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
