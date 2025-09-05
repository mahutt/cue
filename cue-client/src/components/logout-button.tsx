import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import { Button } from './ui/button';

export default function LogoutButton() {
    const navigate = useNavigate();
    const { setLoading } = useAuth();
    const logout = () => {
        document.cookie = 'jwt=; path=/; max-age=0';
        setLoading(true);
        navigate('/login');
    };

    return (
        <Button variant="secondary" onClick={logout}>
            Logout
        </Button>
    );
}
