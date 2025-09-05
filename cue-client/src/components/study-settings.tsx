import { Pencil, RotateCw } from 'lucide-react';
import LightButton from './light-button';

export default function StudySettings({
    setEditing,
    reset,
}: {
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    reset: () => Promise<void>;
}) {
    return (
        <div>
            <LightButton id="editCardButton" type="button" onClick={() => setEditing((prev) => !prev)}>
                <Pencil size={16} strokeWidth={1.5} />
            </LightButton>{' '}
            <LightButton type="button" onClick={reset}>
                <RotateCw size={16} strokeWidth={1.5} />
            </LightButton>
        </div>
    );
}
