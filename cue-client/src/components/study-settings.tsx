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
                <i className="bi bi-pencil"></i>
            </LightButton>{' '}
            <LightButton type="button" onClick={reset}>
                <i className="bi bi-arrow-clockwise"></i>
            </LightButton>
        </div>
    );
}
