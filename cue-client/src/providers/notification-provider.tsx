import React, { createContext, useState, ReactNode } from 'react';

export interface NotificationState {
    notification: string | null;
    setNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

const NotificationContext = createContext<NotificationState | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<string | null>(null);

    const value: NotificationState = {
        notification,
        setNotification,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export { NotificationContext };
