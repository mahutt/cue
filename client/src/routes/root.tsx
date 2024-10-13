import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation';

export default function Root() {
    return (
        <div className="h-screen flex items-stretch">
            <Navigation />
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
