import { useAuth } from '@/hooks/auth-hook';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

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

    return (
        <div className="flex justify-center items-center h-full">
            <LoaderCircle size={48} className="animate-spin" />
        </div>
    );
}
