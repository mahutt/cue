import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation';

export default function Root() {
    return (
        <div className="h-screen w-screen grid grid-cols-[auto_1fr]">
            <Navigation />
            <main className="overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
