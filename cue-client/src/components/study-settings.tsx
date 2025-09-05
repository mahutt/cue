export default function StudySettings({
    setEditing,
    reset,
}: {
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    reset: () => Promise<void>;
}) {
    return (
        <div>
            <button
                id="editCardButton"
                className="btn btn-light"
                type="button"
                onClick={() => setEditing((prev) => !prev)}
            >
                <i className="bi bi-pencil"></i>
            </button>{' '}
            <button className="btn btn-light" type="button" onClick={reset}>
                <i className="bi bi-arrow-clockwise"></i>
            </button>
        </div>
    );
}
