import { useContext } from 'react';
import { NotificationContext, NotificationState } from '../providers/notification-provider';

export const useNotification = (): NotificationState => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
