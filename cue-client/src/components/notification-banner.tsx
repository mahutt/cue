import { useEffect, useRef, useState } from 'react';
import { useNotification } from '../hooks/notification-hook';

export default function NotificationBanner() {
    // @todo fix duplicate banner bug (doesn't show)
    const { notification } = useNotification();
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (notification) {
            setVisible(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
                timeoutRef.current = null;
            }, 3000);
        }
    }, [notification]);

    return (
        <div
            style={{
                position: 'fixed',
                color: 'white',
                backgroundColor: 'black',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                pointerEvents: 'none',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '1rem',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
            }}
        >
            {notification}
        </div>
    );
}
