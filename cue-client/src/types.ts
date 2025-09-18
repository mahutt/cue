declare global {
    interface Window {
        bootstrap: {
            Modal: new (element: HTMLElement) => { show: () => void };
        };
    }
}

export interface User {
    name: string;
    courses: Course[];
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

export interface PendingCard {
    id: number;
    front: string;
    back: string;
    promise: Promise<Card>;
}

export interface Message {
    id: number;
    content: string;
    user_id: number | null;
    username?: string;
    created_at: string;
}
