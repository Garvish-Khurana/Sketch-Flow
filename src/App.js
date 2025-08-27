import './App.css';
import 'reactflow/dist/style.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TemplatesPage from './pages/TemplatesPage';
import DemoProjectPage from './pages/DemoProjectPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailNotice from './pages/VerifyEmailNotice';
import VerifyEmailHandler from './pages/VerifyEmailHandler';
import DashboardLanding from './pages/DashboardLanding';
import RoadmapEditor from './components/RoadmapEditor';
import PrivateRoute from './components/PrivateRoute';
import { ProjectsProvider } from './context/ProjectsContext';

export default function App() {
  return (
    <ProjectsProvider>
    <BrowserRouter>
      {/* NavBar stays here so it appears on every screen */}
      <Navbar /> 
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
         {/* Templates gallery */}
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/about" element={<AboutPage />}/>


        {/* Demo project (no persistence) */}
        <Route path="/projects/demo" element={<DemoProjectPage />} />

        {/* Template launchers (hydrate editor with a selected template) */}
        <Route path="/projects/template/:slug" element={<DemoProjectPage />} />
        <Route path="/projects/demo-session" element={<RoadmapEditor />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/notice" element={<VerifyEmailNotice />}/>
        <Route path="/verify-email" element={<VerifyEmailHandler />} />

        {/* Private */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLanding />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <RoadmapEditor /> 
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </ProjectsProvider>
  );
}
