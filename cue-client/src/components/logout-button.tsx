import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { Button } from './ui/button';
import api from '@/api';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LogoutButton() {
    const navigate = useNavigate();
    const { setLoading } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const logout = async () => {
        setLoggingOut(true);
        await api.post('/logout');
        setLoading(true);
        navigate('/login');
    };

    return (
        <Button variant="secondary" onClick={logout} disabled={loggingOut}>
            {loggingOut ? <Loader2 /> : 'Logout'}
        </Button>
    );
}
