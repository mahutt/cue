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
import CoursePage from './components/course-page.tsx';
import DeckPage from './components/deck-page.tsx';
import StudyStack from './components/study-stack.tsx';
import HomePage from './components/home-page.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <SidebarProvider>
                <NotificationProvider>
                    <ToolProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route element={<App />}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginForm />} />
                                    <Route path="/:username" element={<Profile />} />
                                    <Route path="/:username/:courseCode" element={<CoursePage />} />
                                    <Route path="/:username/:courseCode/:deckPosition" element={<DeckPage />} />
                                    <Route path="/:username/:courseCode/:deckPosition/study" element={<StudyStack />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </ToolProvider>
                </NotificationProvider>
            </SidebarProvider>
        </AuthProvider>
    </StrictMode>
);
