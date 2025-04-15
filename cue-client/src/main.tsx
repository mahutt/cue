import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './providers/auth-provider.tsx';
import { SidebarProvider } from './providers/sidebar-provider.tsx';
import './index.css';

import App from './App.tsx';
import LoginForm from './components/login-form.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <SidebarProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<App />}>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/:username" element={<div>User Dashboard</div>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </SidebarProvider>
        </AuthProvider>
    </StrictMode>
);
