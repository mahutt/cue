import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

export interface FaceRef {
    focus: () => void;
}

interface Props {
    value: string;
    setValue: (value: string) => void;
    side?: string;
    placeholder?: string;
    readOnly?: boolean;
    edited?: boolean;
    reset?: () => void;
    resettable?: boolean;
    onCommandClick?: () => void;
}

export default forwardRef<FaceRef, Props>(
    (
        {
            value,
            setValue,
            side = '',
            placeholder = '',
            readOnly = false,
            edited = false,
            reset = () => {},
            resettable = true,
            onCommandClick = () => {},
        },
        ref
    ) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        const resize = () => {
            if (!textareaRef.current) return;
            textareaRef.current.style.height = 'fit-content';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        };

        useImperativeHandle(ref, () => ({
            focus: () => {
                if (textareaRef.current) textareaRef.current.focus();
            },
        }));

        useEffect(() => {
            resize();
        }, [value]);

        return (
            <div
                className={`card-face ${edited ? 'edited' : ''}`}
                onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) {
                        onCommandClick?.();
                    }
                }}
            >
                {resettable && (
                    <button
                        role="button"
                        className="undo-button"
                        onClick={() => {
                            reset();
                            textareaRef.current?.focus();
                        }}
                    >
                        <i className="bi bi-arrow-counterclockwise"></i>
                    </button>
                )}
                <textarea
                    ref={textareaRef}
                    className={side}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        margin: 0,
                        padding: 0,
                        font: 'inherit',
                        color: 'inherit',
                        backgroundColor: 'transparent',
                        resize: 'none',
                        textAlign: 'inherit',
                        overflow: 'hidden',
                    }}
                    onInput={resize}
                    onKeyDown={(e) => {
                        if (e.shiftKey && e.key === 'Enter') {
                            e.stopPropagation();
                        }
                    }}
                />
            </div>
        );
    }
);
