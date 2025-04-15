import { Outlet } from 'react-router';
import CollapsibleColumn from './components/collapsible-column';
import { useSidebar } from './hooks/sidebar-hook';

function App() {
    const { toggleSidebar } = useSidebar();
    const navigateBack = () => window.history.back(); // to be fixed
    return (
        <div id="app">
            <CollapsibleColumn />
            <main>
                <div className="d-flex gap-2 menu-bar">
                    <button className="btn btn-light toggle" type="button" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                    <button id="navigateBack" className="btn btn-light" type="button" onClick={navigateBack}>
                        <i className="bi bi-arrow-90deg-left"></i>
                    </button>
                    <div id="dynamic" className="d-flex justify-content-end w-100"></div>
                </div>
                <div id="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default App;
