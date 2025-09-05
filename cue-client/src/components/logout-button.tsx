import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth-hook';
import LightButton from './light-button';

export default function LogoutButton() {
    const navigate = useNavigate();
    const { setLoading } = useAuth();
    const logout = () => {
        document.cookie = 'jwt=; path=/; max-age=0';
        setLoading(true);
        navigate('/login');
    };

    return <LightButton onClick={logout}>Logout</LightButton>;
}
