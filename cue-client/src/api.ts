const BASE_URL = import.meta.env.VITE_API_URL;

export const api = (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    return fetch(`${BASE_URL}${endpoint}`, options);
};
