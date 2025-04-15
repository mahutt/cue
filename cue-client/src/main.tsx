import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './providers/auth-provider.tsx';
import { SidebarProvider } from './providers/sidebar-provider.tsx';
import { NotificationProvider } from './providers/notification-provider.tsx';
import { ToolProvider } from './providers/tool-provider.tsx';
import './index.css';

import App from './App.tsx';
import LoginForm from './components/login-form.tsx';
import Profile from './components/profile.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <SidebarProvider>
                <NotificationProvider>
                    <ToolProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route element={<App />}>
                                    <Route path="/" element={<div>Home</div>} />
                                    <Route path="/login" element={<LoginForm />} />
                                    <Route path="/:username" element={<Profile />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </ToolProvider>
                </NotificationProvider>
            </SidebarProvider>
        </AuthProvider>
    </StrictMode>
);
