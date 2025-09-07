import { useAuth } from '@/hooks/auth-hook';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoaderPage from './loader-page';

export default function HomePage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) {
            navigate(`/${user.name}`);
        } else {
            navigate('/login');
        }
    }, [user, loading]);

    return <LoaderPage />;
}
