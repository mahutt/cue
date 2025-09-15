import React, { createContext, ReactNode, useRef } from 'react';
import { FaceRef } from '../components/card-face';

export interface DeckState {
    formFrontValue: string;
    formBackValue: string;
    setFormFrontValue: React.Dispatch<React.SetStateAction<string>>;
    setFormBackValue: React.Dispatch<React.SetStateAction<string>>;
    formFrontFaceRef: React.RefObject<FaceRef | null>;
    formBackFaceRef: React.RefObject<FaceRef | null>;
    focusForm: () => void;
    belongs: boolean;
}

const DeckContext = createContext<DeckState | undefined>(undefined);

interface DeckProviderProps {
    children: ReactNode;
    belongs: boolean;
}

export const DeckProvider: React.FC<DeckProviderProps> = ({ children, belongs }) => {
    const [formFrontValue, setFormFrontValue] = React.useState<string>('');
    const [formBackValue, setFormBackValue] = React.useState<string>('');

    const formFrontFaceRef = useRef<FaceRef | null>(null);
    const formBackFaceRef = useRef<FaceRef | null>(null);

    const focusForm = () => {
        if (formFrontFaceRef.current) formFrontFaceRef.current.focus();
    };

    const value: DeckState = {
        formFrontValue,
        formBackValue,
        setFormFrontValue,
        setFormBackValue,
        formFrontFaceRef,
        formBackFaceRef,
        focusForm,
        belongs,
    };

    return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export { DeckContext };
