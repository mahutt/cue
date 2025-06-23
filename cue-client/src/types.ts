declare global {
    interface Window {
        bootstrap: {
            Modal: new (element: HTMLElement) => { show: () => void };
        };
    }
}

export interface Course {
    id: number;
    name: string;
    department: string;
    number: number;
    code: string;
}

export interface Deck {
    id: number;
    position: number;
    name: string;
    course_id: number;
    percentage?: number | null;
}

export interface Card {
    id: number;
    deck_id: number;
    position: number;
    front: string;
    back: string;
}
