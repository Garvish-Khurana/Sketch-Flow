import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Keep a snapshot of the current auth token
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [busyCreate, setBusyCreate] = useState(false);
  const [createErr, setCreateErr] = useState('');

  // Sync token state whenever localStorage changes (login/logout events)
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token') || '');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  };

  // Helper: mark menu item as active
  const active = (base) =>
    location.pathname === base || location.pathname.startsWith(base + '/');

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  // Quick‑create a new project (same logic as homepage shortcut)
  const createNewProject = async () => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (busyCreate) return;

    try {
      setBusyCreate(true);
      setCreateErr('');
      const defaultTitle = 'My Roadmap';

      const res = await api.post('/projects', { title: defaultTitle, name: defaultTitle });
      const createdDoc = res?.data?.data ?? res?.data ?? {};
      const id = String(createdDoc?._id ?? createdDoc?.id ?? '');
      if (!id) throw new Error('Missing new project id');

      localStorage.setItem('lastOpenedProjectId', id);
      navigate(`/projects/${id}`);
    } catch (err) {
      if (err?.response?.status === 401) {
        // Token expired → reset auth and redirect
        localStorage.clear();
        setToken('');
        window.dispatchEvent(new Event('storage'));
        navigate('/login', { replace: true });
      } else {
        const msg =
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          'Failed to create project';
        setCreateErr(msg);
      }
    } finally {
      setBusyCreate(false);
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50 border-b-4 border-stone-800
        bg-cover bg-center bg-[#cbd039]
      "
      role="banner"
    >
      {/* Background gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🪨</span>
          <Link
            to="/"
            className="font-['Caveat',cursive] text-2xl text-stone-800 hover:underline underline-offset-4"
            aria-label="Home"
          >
            Sketch Flow
          </Link>
        </div>

        {/* Main nav (desktop) */}
        <nav className="hidden md:flex gap-6 text-stone-800 font-semibold" role="navigation" aria-label="Primary">
          <Link to="/" className={`hover:underline underline-offset-4 ${active('/') ? 'underline decoration-2' : ''}`}>Home</Link>
          <Link to="/dashboard" className={`hover:underline underline-offset-4 ${active('/dashboard') ? 'underline decoration-2' : ''}`}>Projects</Link>
          <Link to="/templates" className={`hover:underline underline-offset-4 ${active('/templates') ? 'underline decoration-2' : ''}`}>Templates</Link>
          <Link to="/about" className={`hover:underline underline-offset-4 ${active('/about') ? 'underline decoration-2' : ''}`}>About</Link>
        </nav>

        {/* Auth / action buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <button
                onClick={createNewProject}
                disabled={busyCreate}
                className="
                  inline-flex items-center gap-2 px-3 py-1 rounded-md
                  border-2 border-stone-800 bg-yellow-200 hover:bg-yellow-300
                  shadow-[4px_4px_0_#444] transition disabled:opacity-60
                "
                aria-label="Create new project"
                title="Create new project"
              >
                <span aria-hidden="true">🧪</span>
                {busyCreate ? 'Creating…' : 'New Project'}
              </button>
              <button
                onClick={handleLogout}
                className="
                  bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600
                  border-2 border-stone-800 shadow-[4px_4px_0_#444] transition
                "
                aria-label="Logout"
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline" aria-label="Login">Login</Link>
              <Link to="/register" className="hover:underline" aria-label="Register">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-2xl relative z-10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="
            md:hidden relative backdrop-blur-sm bg-stone-100/90 border-t border-stone-700
            p-4 space-y-3
          "
          role="navigation"
          aria-label="Mobile"
        >
          <Link to="/" className="block text-stone-800">Home</Link>
          <Link to="/dashboard" className="block text-stone-800">Projects</Link>
          <Link to="/templates" className="block text-stone-800">Templates</Link>
          <Link to="/about" className="block text-stone-800">About</Link>

          <div className="border-t border-stone-300 pt-3">
            {token ? (
              <>
                <button
                  onClick={createNewProject}
                  disabled={busyCreate}
                  className="
                    w-full text-left text-stone-800 mb-2
                    border-2 border-stone-800 bg-yellow-200 hover:bg-yellow-300
                    rounded-md px-3 py-2 shadow-[4px_4px_0_#444] disabled:opacity-60
                  "
                >
                  🧪 {busyCreate ? 'Creating…' : 'New Project'}
                </button>
                <button
                  onClick={handleLogout}
                  className="
                    w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition
                    border-2 border-stone-800 shadow-[4px_4px_0_#444]
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="text-center border-2 border-stone-800 bg-white rounded-md px-3 py-2 shadow-[4px_4px_0_#444]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center border-2 border-stone-800 bg-white rounded-md px-3 py-2 shadow-[4px_4px_0_#444]"
                >
                  Register
                </Link>
              </div>
            )}
            {createErr && (
              <div className="mt-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded px-2 py-1">
                {createErr}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
