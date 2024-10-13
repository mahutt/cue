import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { ArrowUpRight } from 'lucide-react';

export default function Login() {
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Welcome back{name ? `, ${name}` : ''}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Input id="name" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
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
                    <Button>Log in</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
