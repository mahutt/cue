import { useNotification } from '../hooks/notification-hook';

export default function NotificationBanner() {
    const { notification, isVisible } = useNotification();

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
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
            }}
        >
            {notification}
        </div>
    );
}
