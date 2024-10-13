import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { ArrowUpRight } from 'lucide-react';

export default function Login() {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value.toLowerCase().trim());
    };

    const handleSubmit = async () => {
        if (!name || !password) {
            setError('Please fill in all fields');
            return;
        } else {
            setError('');
        }
        try {
            await login(name, password);
            navigate('/');
        } catch (err) {
            setError((err as any).response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>
                        {error ? (
                            <span className="text-red-500 text-sm">{error}</span>
                        ) : (
                            `Welcome back${name ? `, ${name}` : ''}`
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Input id="name" placeholder="name" value={name} onChange={handleNameChange} />
                        <Input
                            type="password"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link
                        to="/signup"
                        className="group flex items-center underline transition-colors hover:text-blue-500"
                    >
                        Sign up instead
                        <ArrowUpRight
                            size={16}
                            className="ml-0.5 transition-transform transform group-hover:-translate-y-0.5"
                        />
                    </Link>
                    <Button onClick={handleSubmit}>Log in</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
