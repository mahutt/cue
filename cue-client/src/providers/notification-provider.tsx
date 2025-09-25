import React, { createContext, useState, ReactNode } from 'react';

export interface NotificationState {
    notification: string | null;
    notify: (message: string) => void;
    isVisible: boolean;
}

const NotificationContext = createContext<NotificationState | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const notify = (message: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setNotification(message);
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    const value: NotificationState = {
        notification,
        notify,
        isVisible,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export { NotificationContext };
