import { useContext } from 'react';
import { DeckContext, DeckState } from '../providers/deck-provider';

export const useDeck = (): DeckState => {
    const context = useContext(DeckContext);
    if (context === undefined) {
        throw new Error('useDeck must be used within a DeckProvider');
    }
    return context;
};
