import React, { createContext, useState, ReactNode, useEffect } from 'react';
import api from '../api';
import { Course } from '../types';

interface User {
    name: string;
    courses: Course[];
}

export interface AuthState {
    user: User | null;
    allUserNames: string[];
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [allUserNames, setAllUserNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const value: AuthState = {
        user,
        allUserNames,
        setUser,
        loading,
        setLoading,
    };

    const checkUser = async () => {
        try {
            const response = await api.get('/user');
            const { name, courses } = response.data;
            setUser({ name, courses });
            setLoading(false);
        } catch {
            setUser(null);
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await api.get('/api/users/all');
            const users = response.data;
            setAllUserNames(users.map((user: { name: string }) => user.name));
        } catch {}
    };

    useEffect(() => {
        if (!loading) return;
        checkUser();
    }, [loading]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
