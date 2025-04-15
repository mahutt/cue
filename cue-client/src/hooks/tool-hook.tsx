import { useContext } from 'react';
import { ToolContext, ToolState } from '../providers/tool-provider';

export const useTool = (): ToolState => {
    const context = useContext(ToolContext);
    if (context === undefined) {
        throw new Error('useTool must be used within a ToolProvider');
    }
    return context;
};
