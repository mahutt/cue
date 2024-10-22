export interface User {
    id: number;
    name: string;
    courses: Course[];
}

export interface Course {
    id: number;
    name: string;
    department: string;
    number: number;
    user_id: number;
    decks?: Deck[];
}

export interface Deck {
    id: number;
    position: number;
    name: string;
    course_id: number;
    percentage: number | null;
}

export interface Card {
    id: number;
    position: number;
    front: string;
    back: string;
    deck_id: number;
}

export interface Score {
    score: 0 | 1 | 2;
    user_id: number;
    card_id: number;
}
