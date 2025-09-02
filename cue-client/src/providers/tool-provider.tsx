import React, { createContext, useState, ReactNode, JSX } from 'react';

export interface ToolState {
    tool: JSX.Element | null;
    setTool: (tool: JSX.Element | null) => void;
}

const ToolContext = createContext<ToolState | undefined>(undefined);

interface ToolProviderProps {
    children: ReactNode;
}

export const ToolProvider: React.FC<ToolProviderProps> = ({ children }) => {
    const [tool, setTool] = useState<JSX.Element | null>(null);

    const value: ToolState = {
        tool,
        setTool,
    };

    return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
};

export { ToolContext };
