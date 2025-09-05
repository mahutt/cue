import { Outlet } from 'react-router';
import CollapsibleColumn from './components/collapsible-column';
import { useSidebar } from './hooks/sidebar-hook';
import NotificationBanner from './components/notification-banner';
import { useTool } from './hooks/tool-hook';
import LightButton from './components/light-button';
import { CornerUpLeft, Menu } from 'lucide-react';

function App() {
    const { toggleSidebar } = useSidebar();
    const { tool } = useTool();
    const navigateBack = () => window.history.back(); // to be fixed
    return (
        <div id="app">
            <CollapsibleColumn />
            <main>
                <div className="flex gap-2 p-4">
                    <LightButton type="button" onClick={toggleSidebar}>
                        <Menu size={16} strokeWidth={1.5} />
                    </LightButton>
                    <LightButton id="navigateBack" type="button" onClick={navigateBack}>
                        <CornerUpLeft size={16} strokeWidth={1.5} />
                    </LightButton>
                    <div id="dynamic" className="flex justify-end w-full">
                        {tool}
                    </div>
                </div>
                <div id="content">
                    <Outlet />
                </div>
            </main>
            <NotificationBanner />
        </div>
    );
}

export default App;
