import React, { createContext, useState, ReactNode } from 'react';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(initialSidebarState);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const openSidebar = () => setIsSidebarOpen(true);
    const closeSidebar = () => setIsSidebarOpen(false);

    const value: SidebarState = {
        isSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
    };

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export { SidebarContext };
