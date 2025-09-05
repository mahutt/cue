import { Pencil, RotateCw } from 'lucide-react';
import { Button } from './ui/button';

export default function StudySettings({
    setEditing,
    reset,
}: {
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    reset: () => Promise<void>;
}) {
    return (
        <div>
            <Button variant="secondary" type="button" onClick={() => setEditing((prev) => !prev)}>
                <Pencil size={16} strokeWidth={1.5} />
            </Button>{' '}
            <Button variant="secondary" type="button" onClick={reset}>
                <RotateCw size={16} strokeWidth={1.5} />
            </Button>
        </div>
    );
}
