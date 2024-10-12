import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation';

export default function Root() {
    return (
        <div className="h-screen flex items-stretch">
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
