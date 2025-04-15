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
