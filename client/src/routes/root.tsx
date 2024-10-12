import { Outlet } from 'react-router-dom';

export default function Root() {
    return (
        <>
            <div id="sidebar">side bar content</div>
            <main>
                <Outlet />
            </main>
        </>
    );
}
