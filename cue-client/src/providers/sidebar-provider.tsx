import React, { createContext, useEffect, ReactNode } from 'react';
import useLocalStorage from 'use-local-storage';

const SIDEBAR_STORAGE_KEY = 'sidebar-state';
const TOGGLE_SIDEBAR_KEY = 'b';

export interface SidebarState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarState | undefined>(undefined);

interface SidebarProviderProps {
    children: ReactNode;
    initialSidebarState?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children, initialSidebarState = true }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage<boolean>(SIDEBAR_STORAGE_KEY, initialSidebarState);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey && event.key.toLowerCase() === TOGGLE_SIDEBAR_KEY) {
                event.preventDefault();
                setIsSidebarOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const value: SidebarState = {
        isSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
    };

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export { SidebarContext };
