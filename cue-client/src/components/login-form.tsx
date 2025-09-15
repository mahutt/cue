import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api';
import { useAuth } from '../hooks/auth-hook';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useTool } from '@/hooks/tool-hook';

export default function LoginForm() {
    const navigate = useNavigate();
    const { setLoading: setAuthLoading } = useAuth();
    const { setTool } = useTool();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [firstAttempt, setFirstAttempt] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        let valid = true;
        if (!username.trim()) {
            valid = false;
            setInvalidUsername(true);
        } else {
            setInvalidUsername(false);
        }
        if (!password.trim()) {
            valid = false;
            setInvalidPassword(true);
        } else {
            setInvalidPassword(false);
        }
        return valid;
    };

    const login = async () => {
        setFirstAttempt(false);
        if (!validate()) {
            return;
        }
        setLoading(true);

        const response = await api.post('/login', {
            name: username,
            password,
        });

        const data = response.data;
        if (data.error !== undefined) {
            setError(data.error);
            setLoading(false);
        } else {
            setAuthLoading(true);
            navigate(`/${username}`);
        }
    };

    useEffect(() => {
        setTool(null);
    }, []);

    useEffect(() => {
        if (firstAttempt) return;
        validate();
    }, [username, password, firstAttempt]);

    return (
        <div className="mt-4 flex justify-center">
            <Card className="w-80 bg-gray-50">
                <CardContent className="p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                className={invalidUsername ? 'border-red-500' : ''}
                                required
                            />
                            {invalidUsername && <p className="text-sm text-red-500">Required.</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        login();
                                    }
                                }}
                                disabled={loading}
                                className={invalidPassword ? 'border-red-500' : ''}
                                required
                            />
                            {invalidPassword && <p className="text-sm text-red-500">Required.</p>}
                        </div>

                        <Button onClick={login} disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
