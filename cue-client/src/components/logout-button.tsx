import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth-hook';

export default function LogoutButton() {
    const navigate = useNavigate();
    const { setLoading } = useAuth();
    const logout = () => {
        document.cookie = 'jwt=; path=/; max-age=0';
        setLoading(true);
        navigate('/login');
    };

    return (
        <button className="btn btn-light" onClick={logout}>
            Logout
        </button>
    );
}
